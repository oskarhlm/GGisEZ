import _, { every } from 'lodash';
import type { GeoJSON } from 'geojson';
import { isFeatureCollection, isGeoJSON } from './geojson';
import { read, openDbf } from 'shapefile';
import proj4 from 'proj4';

class GeoReader {
	cb: (filename: string, data: GeoJSON) => void;

	constructor(cb: (filename: string, data: GeoJSON) => void) {
		this.cb = cb;
	}

	setupReader(reader: FileReader, filename: string) {
		reader.onload = (e: ProgressEvent<FileReader>) => {
			if (e.target && e.target.result) {
				const fileContent = e.target.result as string;
				const geojsonData = JSON.parse(fileContent);
				console.log(geojsonData);

				if (isFeatureCollection(geojsonData)) {
					const collections = _.groupBy(geojsonData.features, (feature) => feature.geometry.type);
					console.log(collections);
				}

				this.cb(filename.replace('.json', ''), geojsonData);
			}
		};
	}

	readJSONFile(file: File) {
		if (file.type !== 'application/json') {
			console.error('Not a json file!');
			return;
		}

		const reader = new FileReader();
		this.setupReader(reader, file.name);
		reader.readAsText(file);
	}

	async readPrj(file: File) {
		const reader = new FileReader();

		reader.onload = async (e: ProgressEvent<FileReader>) => {
			const prjFileContent = e.target?.result;
			const sourceProjWkt = prjFileContent?.toString().trim();
			const targetProj2 = await this.getProjString('4236');
			const pts = proj4(sourceProjWkt!, targetProj2!, [270344.33, 7041891.63]);
			console.log(pts);
		};

		reader.readAsText(file);
	}

	private async getProjString(epsg: string) {
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

	async readShape(shp: File, dbf?: File, prj: string = '25833') {
		const arrayBuffer = await shp.arrayBuffer();
		if (shp.name.endsWith('.dbf')) {
			const dbf = await openDbf(arrayBuffer);
			console.log(await dbf.read());
			return;
		}

		const sourceEPSG = '25833';
		const targetEPSG = '4326';
		const geojsonData = await read(arrayBuffer);

		console.log(geojsonData);
		this.cb(shp.name.replace('.shp', ''), geojsonData);
	}

	readFiles(files: FileList) {
		// const requests = _.map(files, (file) => new Promise(() => this.readJSONFile(file)));
		// Promise.all(requests).then(() => console.log('Done reading files'));
		// this.getProjString('4326');
		// const requests = _.map(files, (file) => new Promise(() => this.readShape(file)));
		// Promise.all(requests).then(() => console.log('Done reading files'));

		const requests = _.map(files, (file) => new Promise(() => this.readPrj(file)));
	}
}

export default GeoReader;
