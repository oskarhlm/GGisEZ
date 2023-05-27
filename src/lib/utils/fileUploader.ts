import _ from 'lodash';
import type { GeoJSON } from 'geojson';
import { isFeatureCollection, isGeoJSON } from './geojson';

class GeoJSONReader {
	cb: (filename: string, data: GeoJSON) => void;

	constructor(cb: (filename: string, data: GeoJSON) => void) {
		this.cb = cb;
	}

	setupReader(reader: FileReader, filename: string) {
		reader.onload = (e: ProgressEvent<FileReader>) => {
			if (e.target && e.target.result) {
				const fileContent = e.target.result as string;
				const jsonData = JSON.parse(fileContent);
				console.log(jsonData);

				if (!isGeoJSON(jsonData)) {
					console.error('Not a geojson file!');
					return;
				}

				if (isFeatureCollection(jsonData)) {
					const collections = _.groupBy(jsonData.features, (feature) => feature.geometry.type);
					console.log(collections);
				}

				this.cb(filename.replace('.json', ''), jsonData);
			}
		};
	}

	readFile(file: File) {
		if (file.type !== 'application/json') {
			console.error('Not a json file!');
			return;
		}

		const reader = new FileReader();
		this.setupReader(reader, file.name);
		reader.readAsText(file);
	}

	readFiles(files: FileList) {
		const requests = _.map(files, (file) => new Promise(() => this.readFile(file)));
		Promise.all(requests).then(() => console.log('Done reading files'));
	}
}

export default GeoJSONReader;
