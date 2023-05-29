import type mapboxgl from 'mapbox-gl';
import type { MapSource } from '../../../stores/mapSources';
import type { FeatureCollection, GeoJSON } from 'geojson';
import { isFeature, isFeatureCollection, isGeometryCollection } from '$lib/utils/geojson';

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

export function addLayerWithTypeCheck(map: mapboxgl.Map, source: MapSource) {
	switch (source.data.type) {
		case 'Point':
		case 'MultiPoint':
			addPointLayer(map, source);
			break;
		case 'LineString':
		case 'MultiLineString':
			addLineLayer(map, source);
			break;
		case 'Polygon':
		case 'MultiPolygon':
			addPolygonLayer(map, source);
			break;
		case 'Feature':
		case 'GeometryCollection':
		case 'FeatureCollection':
			addFeatureOrFeatureOrGeometryCollectionLayer(map, source);
			break;
	}
}

function addPointLayer(map: mapboxgl.Map, source: MapSource, id?: string, filter?: any[]) {
	map.addLayer({
		id: id || source.name,
		type: 'circle',
		source: source.name,
		filter,
		paint: {
			'circle-color': nextColor()
		}
	});
}

function addLineLayer(map: mapboxgl.Map, source: MapSource, id?: string, filter?: any[]) {
	map.addLayer({
		id: id || source.name,
		type: 'line',
		source: source.name,
		filter,
		paint: {
			'line-color': nextColor()
		}
	});
}

function addPolygonLayer(map: mapboxgl.Map, source: MapSource, id?: string, filter?: any[]) {
	map.addLayer({
		id: id || source.name,
		type: 'fill',
		source: source.name,
		filter,
		paint: {
			'fill-color': nextColor()
		}
	});
}

function addFeatureOrFeatureOrGeometryCollectionLayer(map: mapboxgl.Map, source: MapSource) {
	addPointLayer(map, source, `${source.name}-point`, ['==', '$type', 'Point']);
	addLineLayer(map, source, `${source.name}-line`, ['==', '$type', 'LineString']);
	addPolygonLayer(map, source, `${source.name}-fill`, ['==', '$type', 'Polygon']);
}
