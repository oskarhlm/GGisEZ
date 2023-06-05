import bbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';
import type { MapLayer } from '../../../stores/mapLayers';
import type { GeoJSONSourceRaw } from 'mapbox-gl';
import _, { isString } from 'lodash';
import type { GeoJSON, Feature, Polygon, MultiPolygon, GeoJsonProperties } from 'geojson';
import type { GeoJSONProcessor } from './types';
import type mapboxgl from 'mapbox-gl';
import { isFeature, isFeatureCollection, isGeoJSON } from '$lib/utils/geojson';

function bboxProcessor(input: MapLayer<mapboxgl.Layer>[]) {
	const data = (input[0].source as GeoJSONSourceRaw).data;

	if (!data || !isGeoJSON(data)) {
		return null;
	}

	const bboxCoords = bbox(data);
	return bboxPolygon(bboxCoords);
}

function intersectInputValidator(input: MapLayer<mapboxgl.Layer>[]): boolean {
	const data = (input[0].source as GeoJSONSourceRaw).data;

	if (!data || !isGeoJSON(data)) {
		return false;
	}

	return true;
}

export default {
	processor: bboxProcessor,
	validator: intersectInputValidator
} satisfies GeoJSONProcessor<MapLayer<mapboxgl.Layer>[], GeoJSON, {}, {}>;
