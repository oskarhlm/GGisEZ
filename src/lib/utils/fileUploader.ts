import _ from 'lodash';
import type {
	GeoJSON,
	FeatureCollection,
	Geometry,
	Position,
	GeometryCollection,
	Point,
	MultiLineString,
	MultiPoint,
	MultiPolygon,
	LineString,
	Polygon
} from 'geojson';
import { isFeatureCollection, isGeoJSON } from './geojson';
import { read, openDbf } from 'shapefile';
import proj4 from 'proj4';
import type { MapSource } from '../../stores/mapSources';

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

export async function getProj4String(epsg: string) {
	const res = await fetch(`https://epsg.io/${epsg}.proj4js`);
	const str = await res.text();
	const proj4StringRegex = /"([^"]+)"/g;
	const match = str.match(proj4StringRegex);
	if (match && match.length > 1) {
		const proj4String = match[1].replace(/"/g, '');
		return proj4String.trim();
	} else {
		console.log('Failed to extract Proj4 string.');
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
				console.log(geojsonData);

				if (isFeatureCollection(geojsonData)) {
					const collections = _.groupBy(geojsonData.features, (feature) => feature.geometry.type);
					console.log(collections);
				}

				resolve({ name: file.name.replace('.json', ''), data: geojsonData });
			}

			reject('Could not parse geoJSON file');
		};

		reader.readAsText(file);
	});
}

async function readShp(shp: File, dbf?: File, prj?: File): Promise<MapSource> {
	const arrayBuffer = await shp.arrayBuffer();

	const geojsonData = await read(arrayBuffer);
	console.log(geojsonData);

	const properties = dbf && (await readDbf(dbf));
	console.log(properties);

	const converter = prj && (await readPrj(prj));
	console.log(converter);

	console.log(converter?.forward([276844.4299999997, 7029156.989999998]));

	const convertGeometry = (geometry: Geometry, converter: proj4.Converter): Geometry => {
		if (geometry.type === 'Point') {
			return {
				...geometry,
				coordinates: converter.forward(geometry.coordinates)
			};
		} else if (geometry.type === 'LineString' || geometry.type === 'MultiPoint') {
			return {
				...geometry,
				coordinates: geometry.coordinates.map(converter!.forward)
			};
		} else if (geometry.type === 'Polygon' || geometry.type === 'MultiLineString') {
			return {
				...geometry,
				coordinates: geometry.coordinates.map((p) => p.map(converter!.forward))
			};
		} else if (geometry.type === 'MultiPolygon') {
			return {
				...geometry,
				coordinates: geometry.coordinates.map((p) => p.map((p) => p.map(converter!.forward)))
			};
		} else if (geometry.type === 'GeometryCollection') {
			return {
				...geometry,
				geometries: geometry.geometries.map((g) => convertGeometry(g, converter))
			} satisfies GeometryCollection;
		}

		return geometry;
	};

	converter &&
		geojsonData.features.forEach((f) => {
			f.geometry = convertGeometry(f.geometry, converter);
		});
	console.log(geojsonData);

	return { name: shp.name, data: geojsonData };
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
	const properties = (await dbf.read()).value;
	return properties;
}
