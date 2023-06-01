import type mapboxgl from 'mapbox-gl';
import type { MapSource } from '../../../stores/mapSources';
import type {
	GeoJsonTypes,
	FeatureCollection,
	GeoJSON,
	Feature,
	GeometryCollection,
	Geometry
} from 'geojson';
import {
	isFeature,
	isFeatureCollection,
	isGeometryCollection,
	isGeometry,
	isGeoJsonType
} from '$lib/utils/geojson';
import { mapLayers, type MapLayer } from '../../../stores/mapLayers';
import _ from 'lodash';
import type { GeoJSONSource, GeoJSONSourceRaw } from 'mapbox-gl';

const defaultColors: string[] = [
	'#FF5733',
	'#F2BE22',
	'#17BEBB',
	'#7B68EE',
	'#FF8C00',
	'#00BFFF',
	'#9932CC',
	'#2E8B57',
	'#FF1493',
	'#8B4513'
];

let colorIndex = 0;
const nextColor = () => defaultColors[colorIndex++ % defaultColors.length];

type LayerTypes = Extract<GeoJsonTypes, 'Point' | 'LineString' | 'Polygon'>;

function isString(value: unknown): value is string {
	return typeof value === 'string';
}

export function isValid(data: GeoJSON | undefined | string): data is GeoJSON {
	return data !== undefined && !isString(data);
}

export function addLayerWithTypeCheck(map: mapboxgl.Map, source: MapSource, id?: string) {
	const data = source.geojson.data;
	if (!isValid(data)) {
		throw new Error('Invalid data source');
	}

	switch (data.type) {
		case 'Point':
		case 'MultiPoint':
			addPointLayer(map, data, source.id);
			break;
		case 'LineString':
		case 'MultiLineString':
			addLineLayer(map, data, source.id);
			break;
		case 'Polygon':
		case 'MultiPolygon':
			addPolygonLayer(map, data, source.id);
			break;
		case 'Feature':
			addFeature(map, source);
			break;
		case 'GeometryCollection':
			addGeometryCollection(map, source);
			break;
		case 'FeatureCollection':
			addFeatureCollectionLayer(map, source);
			break;
	}
}

function addPointLayer(map: mapboxgl.Map, data: GeoJSON, id: string) {
	const newLayer: MapLayer<mapboxgl.CircleLayer> = {
		id: id + '-point',
		type: 'circle',
		source: {
			type: 'geojson',
			data
		},
		paint: {
			'circle-color': nextColor()
		},
		isVisible: true,
		displayName: id
	};
	mapLayers.add(newLayer);
	map.addLayer(newLayer);
}

function addLineLayer(map: mapboxgl.Map, data: GeoJSON, id: string) {
	const newLayer: MapLayer<mapboxgl.LineLayer> = {
		id: id + '-line',
		type: 'line',
		source: {
			type: 'geojson',
			data
		},
		paint: {
			'line-color': nextColor()
		},
		isVisible: true,
		displayName: id
	};
	mapLayers.add(newLayer);
	map.addLayer(newLayer);
}

function addPolygonLayer(map: mapboxgl.Map, data: GeoJSON, id: string) {
	const newLayer: MapLayer<mapboxgl.FillLayer> = {
		id: id + '-polygon',
		type: 'fill',
		source: {
			type: 'geojson',
			data
		},
		paint: {
			'fill-color': nextColor()
		},
		isVisible: true,
		displayName: id
	};
	mapLayers.add(newLayer);
	map.addLayer(newLayer);
}

function addFeature(map: mapboxgl.Map, source: MapSource) {
	const data = source.geojson.data;
	if (!isValid(data) || !isFeature(data)) throw new Error('Not a Feature');

	addLayerWithTypeCheck(map, {
		...source,
		geojson: {
			type: 'geojson',
			data: data.geometry
		}
	});
}

function addGeometryCollection(map: mapboxgl.Map, source: MapSource) {
	const data = source.geojson.data;
	if (!isValid(data) || !isGeometryCollection(data)) throw new Error('Not a GeometryCollection');

	const groups = _.groupBy(data.geometries, (g): LayerTypes => {
		switch (g.type) {
			case 'Point':
			case 'MultiPoint':
				return 'Point';
			case 'LineString':
			case 'MultiLineString':
				return 'LineString';
			case 'Polygon':
			case 'MultiPolygon':
				return 'Polygon';
			case 'GeometryCollection':
				throw new Error('Invalid structure');
		}
	});
	_.forEach(groups, (group, value) => {
		const data = {
			type: 'GeometryCollection',
			geometries: group
		} satisfies GeometryCollection;
		switch (value as LayerTypes) {
			case 'Point':
				addPointLayer(map, data, source.id);
				break;
			case 'LineString':
				addLineLayer(map, data, source.id);
				break;
			case 'Polygon':
				addPolygonLayer(map, data, source.id);
				break;
		}
	});
}

function addFeatureCollectionLayer(map: mapboxgl.Map, source: MapSource) {
	const data = source.geojson.data;
	if (!isValid(data) || !isFeatureCollection(data)) throw new Error('Not a FeaureCollection');

	const groups = _.groupBy(data.features, (f): LayerTypes => {
		switch (f.geometry.type) {
			case 'Point':
			case 'MultiPoint':
				return 'Point';
			case 'LineString':
			case 'MultiLineString':
				return 'LineString';
			case 'Polygon':
			case 'MultiPolygon':
				return 'Polygon';
			case 'GeometryCollection':
				throw new Error('Invalid structure');
		}
	});
	_.forEach(groups, (group, value) => {
		const data = {
			type: 'FeatureCollection',
			features: group
		} satisfies FeatureCollection;
		switch (value as LayerTypes) {
			case 'Point':
				addPointLayer(map, data, source.id);
				break;
			case 'LineString':
				addLineLayer(map, data, source.id);
				break;
			case 'Polygon':
				addPolygonLayer(map, data, source.id);
				break;
		}
	});
}
