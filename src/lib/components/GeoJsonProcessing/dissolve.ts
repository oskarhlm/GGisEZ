import dissolve from '@turf/dissolve';
import type { MapLayer } from '../../../stores/mapLayers';
import type { GeoJSONSourceRaw } from 'mapbox-gl';
import _, { isString } from 'lodash';
import type { GeoJSON, FeatureCollection, Polygon } from 'geojson';
import type { GeoJSONProcessor } from './types';
import type mapboxgl from 'mapbox-gl';
import { isFeature, isFeatureCollection, isPolygon } from '$lib/utils/geojson';
import { isValid } from '../Map/utils';

function dissolveProcessor(input: MapLayer<mapboxgl.Layer>[]) {
	const data = (input[0].source as GeoJSONSourceRaw).data;
	if (
		!isValid(data) ||
		!isFeatureCollection(data) ||
		!data.features.every((f) => isPolygon(f.geometry))
	)
		return null;

	return dissolve(data as FeatureCollection<Polygon, {}>) as GeoJSON;
}

function dissolveInputValidator(input: MapLayer<mapboxgl.Layer>[]) {
	return input.every((l) => {
		const data = (l.source as GeoJSONSourceRaw).data;
		return isValid(data) && isFeatureCollection(data);
	});
}

export default {
	processor: dissolveProcessor,
	validator: dissolveInputValidator
} satisfies GeoJSONProcessor<MapLayer<mapboxgl.Layer>[], GeoJSON, {}, {}>;
