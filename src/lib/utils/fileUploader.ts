import _ from 'lodash';
import type { GeoJsonProperties } from 'geojson';
import { convertGeometry, isFeatureCollection } from './geojson';
import { read, openDbf } from 'shapefile';
import proj4 from 'proj4';
import type { MapSource } from '../../stores/mapSources';

/**
 * Reads each file and reads them based on their file extension,
 * returning an array of MapSoruce objects.
 */
export function readFiles(files: FileList) {
	const groupedFiles = _.groupBy(files, (file) => file.name.split('.')[0]);

	const geoJsonSources = _.flatMap(groupedFiles, (group) => {
		const shp = group.find((f) => f.name.endsWith('.shp'));
		const json = group.find((f) => f.name.endsWith('.json'));

		if (shp) {
			const dbf = group.find((f) => f.name.endsWith('.dbf'));
			const prj = group.find((f) => f.name.endsWith('.prj'));
			return readShp(shp, dbf, prj);
		} else if (json) {
			return group.map(readGeoJSONFile);
		}
	});

	const filteredSources = geoJsonSources.filter(
		(item): item is Promise<MapSource> => item !== undefined
	);

	return Promise.all(filteredSources);
}

/**
 * Takes an EPSG number and gets the proj4 string from https://epsg.io.
 */
export async function getProj4String(epsg: string) {
	try {
		const res = await fetch(`https://epsg.io/${epsg}.proj4`);
		return await res.text();
	} catch (e) {
		console.error('Failed to extract Proj4 string', e);
	}
}

export async function getProjectionName(epsg: string) {
	try {
		const res = await fetch(`https://epsg.io/${epsg}.json`);
		const json = await res.json();
		return json.name as string;
	} catch (error) {
		console.error('Invalid EPSG');
	}
}

function readGeoJSONFile(file: File) {
	if (file.type !== 'application/json') {
		console.error('Not a json file!');
		return;
	}

	return new Promise<MapSource>((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (e: ProgressEvent<FileReader>) => {
			if (e.target && e.target.result) {
				const fileContent = e.target.result as string;
				const geojsonData = JSON.parse(fileContent);

				if (isFeatureCollection(geojsonData)) {
					const collections = _.groupBy(geojsonData.features, (feature) => feature.geometry.type);
				}

				resolve({
					id: file.name.replace('.json', ''),
					geojson: {
						type: 'geojson',
						data: geojsonData
					}
				});
			}

			reject('Could not parse geoJSON file');
		};

		reader.readAsText(file);
	});
}

async function readShp(shp: File, dbf?: File, prj?: File): Promise<MapSource> {
	const arrayBuffer = await shp.arrayBuffer();
	const geojsonData = await read(arrayBuffer);

	const properties = dbf && (await readDbf(dbf));
	if (properties && geojsonData.features.length === properties.length) {
		_.zip(geojsonData.features, properties).forEach(([f, p]) => {
			_.merge(f, { properties: p });
		});
	}

	const converter = prj && (await readPrj(prj));
	if (converter)
		geojsonData.features.forEach((f) => {
			f.geometry = convertGeometry(f.geometry, converter);
		});

	return {
		id: shp.name.split('.')[0],
		geojson: {
			type: 'geojson',
			data: geojsonData
		},
		projectionName: converter ? await readPrjName(prj) : undefined
	};
}

async function readPrjName(file: File) {
	return new Promise<string>((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = async (e) => {
			try {
				const prjFileContent = e.target?.result;
				const sourceProjection = prjFileContent?.toString().trim();
				const regex = /PROJCS\["([^"]+)"/;
				const match = sourceProjection!.match(regex);
				const prjName = match![1].replaceAll('_', ' ');
				resolve(prjName);
			} catch (error) {
				reject(error);
			}
		};

		reader.readAsText(file);
	});
}

async function readPrj(file: File) {
	return new Promise<proj4.Converter>((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = async (e) => {
			try {
				const prjFileContent = e.target?.result;
				const sourceProjection = prjFileContent?.toString().trim();
				const targetProjection = await getProj4String('4326');
				const converter = proj4(sourceProjection!, targetProjection);
				resolve(converter);
			} catch (error) {
				reject(error);
			}
		};

		reader.readAsText(file);
	});
}

async function readDbf(file: File) {
	const arrayBuffer = await file.arrayBuffer();
	const dbf = await openDbf(arrayBuffer);

	async function readUntilDone(
		propertiesArray: GeoJsonProperties[] = []
	): Promise<GeoJsonProperties[]> {
		const properties = await dbf.read();
		if (!properties.done) {
			return await readUntilDone([...propertiesArray, properties.value]);
		}

		return propertiesArray;
	}

	return await readUntilDone();
}
