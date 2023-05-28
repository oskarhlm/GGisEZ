import _, { every } from 'lodash';
import type { GeoJSON, FeatureCollection } from 'geojson';
import { isFeatureCollection, isGeoJSON } from './geojson';
import { read, openDbf } from 'shapefile';
import proj4 from 'proj4';
import type { MapSource } from '../../stores/mapSources';

class GeoReader {
	public readFiles(files: FileList) {
		const geojsonSources = _.map(files, (file) => this.readJSONFile(file)).filter(
			(item): item is Promise<MapSource> => item !== undefined
		);

		return geojsonSources;

		// const requests = _.map(files, (file) => new Promise(() => this.readShape(file)));

		// const requests = _.map(files, (file) => new Promise(() => this.readPrj(file)));
	}

	public async getProjString(epsg: string) {
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

	private readJSONFileOld(file: File) {
		if (file.type !== 'application/json') {
			console.error('Not a json file!');
			return;
		}

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

				this.cb(file.name.replace('.json', ''), geojsonData);
			}
		};

		reader.readAsText(file);
	}

	private readJSONFile(file: File) {
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

					resolve({ name: file.name, data: geojsonData });
				}
				reject('Could not parse geoJSON file');
			};
			reader.readAsText(file);
		});
	}

	private async readShp(shp: File, dbf?: File, prj?: File) {
		const arrayBuffer = await shp.arrayBuffer();

		const geojsonData = await read(arrayBuffer);
		console.log(geojsonData);

		const properties = dbf && (await this.readDbf(dbf));
		console.log(properties);

		const converter = prj && (await this.readPrj(prj));
		// converter?.forward(proj4)

		this.cb(shp.name.replace('.shp', ''), geojsonData);
	}

	private async readPrj(file: File) {
		return new Promise<proj4.Converter>((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = async (e) => {
				try {
					const prjFileContent = e.target?.result;
					const sourceProjection = prjFileContent?.toString().trim();
					const targetProjection = await this.getProjString('4236');
					const converter = proj4(sourceProjection!, targetProjection);
					resolve(converter);
				} catch (error) {
					reject(error);
				}
			};

			reader.readAsText(file);
		});
	}

	private async readDbf(file: File) {
		const arrayBuffer = await file.arrayBuffer();
		const dbf = await openDbf(arrayBuffer);
		const properties = (await dbf.read()).value;
		return properties;
	}
}

export default GeoReader;
