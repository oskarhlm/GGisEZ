import bbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';
import type { MapLayer } from '../../../stores/mapLayers';
import type { GeoJSONSourceRaw } from 'mapbox-gl';
import _, { isString } from 'lodash';
import type {
	GeoJSON,
	Feature,
	Polygon,
	MultiPolygon,
	GeoJsonProperties,
	FeatureCollection,
	GeometryCollection
} from 'geojson';
import type { GeoJSONProcessor } from './types';
import type mapboxgl from 'mapbox-gl';
import { isFeature, isFeatureCollection, isGeoJSON } from '$lib/utils/geojson';

function bboxProcessor(input: MapLayer<mapboxgl.Layer>[]) {
	const data = input.map((l) => (l.source as GeoJSONSourceRaw).data) as GeoJSON[];
	const polygons = data.map(bbox).map((bb) => bboxPolygon(bb));
	const bb = bbox({
		type: 'FeatureCollection',
		features: polygons
	} satisfies FeatureCollection<Polygon, GeoJsonProperties>);
	return [bboxPolygon(bb)];
}

function intersectInputValidator(input: MapLayer<mapboxgl.Layer>[]): boolean {
	console.log(input);
	if (input.length === 0) return false;
	const data = input.map((l) => (l.source as GeoJSONSourceRaw).data).filter(isGeoJSON);
	return input.length === data.length;
}

export default {
	processor: bboxProcessor,
	validator: intersectInputValidator
} satisfies GeoJSONProcessor<MapLayer<mapboxgl.Layer>[], GeoJSON[], {}, {}>;
