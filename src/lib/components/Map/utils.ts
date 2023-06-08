import type mapboxgl from 'mapbox-gl';
import { mapSources, type MapSource } from '../../../stores/mapSources';
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

export type LayerOptions<T extends mapboxgl.AnyLayer> = Omit<
	T,
	'id' | 'type' | 'source' | 'source-layer'
> & {
	border?: mapboxgl.LinePaint;
};

export function addLayerWithTypeCheck(
	map: mapboxgl.Map,
	source: MapSource,
	options?: LayerOptions<mapboxgl.AnyLayer>
) {
	const data = source.geojson.data;
	if (!isValid(data)) {
		throw new Error('Invalid data source');
	}

	switch (data.type) {
		case 'Point':
		case 'MultiPoint':
			addPointLayer(map, data, source.id, options);
			break;
		case 'LineString':
		case 'MultiLineString':
			addLineLayer(map, data, source.id, options);
			break;
		case 'Polygon':
		case 'MultiPolygon':
			addPolygonLayer(map, data, source.id, options);
			break;
		case 'Feature':
			addFeature(map, source, options);
			break;
		case 'GeometryCollection':
			addGeometryCollection(map, source, options);
			break;
		case 'FeatureCollection':
			addFeatureCollectionLayer(map, source, options);
			break;
	}
}

function addPointLayer(
	map: mapboxgl.Map,
	data: GeoJSON,
	id: string,
	options?: LayerOptions<mapboxgl.CircleLayer>
) {
	let newLayer: MapLayer<mapboxgl.CircleLayer> = {
		// id: id + '-point',
		id: mapSources.getUniqueSourceId(id + '-point'),
		type: 'circle',
		source: {
			type: 'geojson',
			data,
			generateId: true
		},
		paint: {
			'circle-color': nextColor()
		},
		isVisible: true,
		displayName: id,
		...options
	};
	newLayer = mapLayers.getUniqueLayerId(newLayer);
	mapLayers.add(newLayer);
	map.addLayer(newLayer);
}

function addLineLayer(
	map: mapboxgl.Map,
	data: GeoJSON,
	id: string,
	options?: LayerOptions<mapboxgl.LineLayer>
) {
	let newLayer: MapLayer<mapboxgl.LineLayer> = {
		// id: id + '-line',
		id: mapSources.getUniqueSourceId(id + '-line'),
		type: 'line',
		source: {
			type: 'geojson',
			data,
			generateId: true
		},
		paint: {
			'line-color': nextColor()
		},
		isVisible: true,
		displayName: id,
		...options
	};
	newLayer = mapLayers.getUniqueLayerId(newLayer);
	mapLayers.add(newLayer);
	map.addLayer(newLayer);
}

function addPolygonLayer(
	map: mapboxgl.Map,
	data: GeoJSON,
	id: string,
	options?: LayerOptions<mapboxgl.FillLayer>
) {
	let newLayer: MapLayer<mapboxgl.FillLayer> = {
		// id: id + '-polygon',
		id: mapSources.getUniqueSourceId(id + '-polygon'),
		type: 'fill',
		source: {
			type: 'geojson',
			data,
			generateId: true
		},
		paint: {
			'fill-color': nextColor(),
			'fill-opacity': 0.5,
			'fill-outline-color': '#000'
		},
		isVisible: true,
		displayName: id,
		...options
	};
	newLayer = mapLayers.getUniqueLayerId(newLayer);
	mapLayers.add(newLayer);
	map.addLayer(newLayer);
}

function addFeature(
	map: mapboxgl.Map,
	source: MapSource,
	options?: LayerOptions<mapboxgl.AnyLayer>
) {
	const data = source.geojson.data;
	if (!isValid(data) || !isFeature(data)) throw new Error('Not a Feature');

	addLayerWithTypeCheck(
		map,
		{
			...source,
			geojson: {
				type: 'geojson',
				data: data.geometry
			}
		},
		options
	);
}

function addGeometryCollection(map: mapboxgl.Map, source: MapSource, options?: LayerOptions<any>) {
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
				addPointLayer(map, data, source.id, options);
				break;
			case 'LineString':
				addLineLayer(map, data, source.id, options);
				break;
			case 'Polygon':
				addPolygonLayer(map, data, source.id, options);
				break;
		}
	});
}

function addFeatureCollectionLayer(
	map: mapboxgl.Map,
	source: MapSource,
	options?: LayerOptions<any>
) {
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
				addPointLayer(map, data, source.id, options);
				break;
			case 'LineString':
				addLineLayer(map, data, source.id, options);
				break;
			case 'Polygon':
				addPolygonLayer(map, data, source.id, options);
				break;
		}
	});
}
