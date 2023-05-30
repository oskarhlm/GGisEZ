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
import { mapLayers } from '../../../stores/mapLayers';
import _ from 'lodash';

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

export function addLayerWithTypeCheck(
	map: mapboxgl.Map,
	source: MapSource,
	id?: string,
	filter?: any[]
) {
	switch (source.data.type) {
		case 'Point':
		case 'MultiPoint':
			addPointLayer(map, source, id, filter);
			break;
		case 'LineString':
		case 'MultiLineString':
			addLineLayer(map, source, id, filter);
			break;
		case 'Polygon':
		case 'MultiPolygon':
			addPolygonLayer(map, source, id, filter);
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

function addPointLayer(map: mapboxgl.Map, source: MapSource, id?: string, filter?: any[]) {
	const newLayer: mapboxgl.CircleLayer = {
		id: id || source.name,
		type: 'circle',
		source: source.name,
		paint: {
			'circle-color': nextColor()
		}
	};
	if (filter) newLayer.filter = filter;
	mapLayers.update((currentLayers) => [...currentLayers, newLayer]);
	map.addLayer(newLayer);
}

function addLineLayer(map: mapboxgl.Map, source: MapSource, id?: string, filter?: any[]) {
	const newLayer: mapboxgl.LineLayer = {
		id: id || source.name,
		type: 'line',
		source: source.name,
		paint: {
			'line-color': nextColor()
		}
	};
	if (filter) newLayer.filter = filter;
	mapLayers.update((currentLayers) => [...currentLayers, newLayer]);
	map.addLayer(newLayer);
}

function addPolygonLayer(map: mapboxgl.Map, source: MapSource, id?: string, filter?: any[]) {
	const newLayer: mapboxgl.FillLayer = {
		id: id || source.name,
		type: 'fill',
		source: source.name,
		paint: {
			'fill-color': nextColor()
		}
	};
	if (filter) newLayer.filter = filter;
	mapLayers.update((currentLayers) => [...currentLayers, newLayer]);
	map.addLayer(newLayer);
}

function addFeature(map: mapboxgl.Map, source: MapSource) {
	if (!isFeature(source.data)) throw new Error('Not a Feature');

	addLayerWithTypeCheck(map, { ...source, data: source.data.geometry });
}

function addGeometryCollection(map: mapboxgl.Map, source: MapSource) {
	if (!isGeometryCollection(source.data)) throw new Error('Not a GeometryCollection');

	let includesPoints = false;
	let includesLines = false;
	let includesPolygons = false;

	const groups = _.groupBy(source.data.geometries, (g) => g.type);
	_.forEach(groups, (group, value) => {
		if (!isGeoJsonType(value)) throw new Error('Not a valid geometry type');
		if (group.length === 0) return;

		switch (value) {
			case 'Point':
			case 'MultiPoint':
				includesPoints = true;
				break;
			case 'LineString':
			case 'MultiLineString':
				includesLines = true;
				break;
			case 'Polygon':
			case 'MultiPolygon':
				includesPolygons = true;
				break;
			default:
				throw new Error('GeometryCollection structure is invalid');
		}
	});

	includesPoints && addPointLayer(map, source, `${source.name}-point`, ['==', '$type', 'Point']);
	includesLines && addLineLayer(map, source, `${source.name}-line`, ['==', '$type', 'LineString']);
	includesPolygons &&
		addPolygonLayer(map, source, `${source.name}-polygon`, ['==', '$type', 'Polygon']);
}

function addFeatureCollectionLayer(map: mapboxgl.Map, source: MapSource) {
	if (!isFeatureCollection(source.data)) throw new Error('Not a FeaureCollection');

	let includesPoints = false;
	let includesLines = false;
	let includesPolygons = false;

	const groups = _.groupBy(source.data.features, (f) => f.geometry.type);
	_.forEach(groups, (group, value) => {
		if (!isGeoJsonType(value)) throw new Error('Not a valid geometry type');
		if (group.length === 0) return;

		switch (value) {
			case 'Point':
			case 'MultiPoint':
				includesPoints = true;
				break;
			case 'LineString':
			case 'MultiLineString':
				includesLines = true;
				break;
			case 'Polygon':
			case 'MultiPolygon':
				includesPolygons = true;
				break;
			default:
				throw new Error('FeatureCollection structure is invalid');
		}
	});

	includesPoints && addPointLayer(map, source, `${source.name}-point`, ['==', '$type', 'Point']);
	includesLines && addLineLayer(map, source, `${source.name}-line`, ['==', '$type', 'LineString']);
	includesPolygons &&
		addPolygonLayer(map, source, `${source.name}-polygon`, ['==', '$type', 'Polygon']);
}
