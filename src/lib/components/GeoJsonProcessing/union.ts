import union from '@turf/union';
import type { MapLayer } from '../../../stores/mapLayers';
import type { GeoJSONSourceRaw } from 'mapbox-gl';
import _, { isString } from 'lodash';
import type { GeoJSON, Feature, Polygon, MultiPolygon, GeoJsonProperties } from 'geojson';
import type { GeoJSONProcessor } from './types';
import type mapboxgl from 'mapbox-gl';
import { isFeature, isFeatureCollection } from '$lib/utils/geojson';

function unionProcessor(input: MapLayer<mapboxgl.Layer>[]) {
	const [poly1, poly2] = _.map(input, (l) => {
		const source = l.source as GeoJSONSourceRaw;
		const data = source.data;

		if (data === undefined || isString(data)) return;

		if (isFeatureCollection(data)) {
			return data.features[0];
		}

		if (isFeature(data)) {
			return data;
		}
	});

	const res = union(poly1 as any, poly2 as any);
	return res as GeoJSON;
}

function unionInputValidator(input: MapLayer<mapboxgl.Layer>[]): boolean {
	if (input.length !== 2) throw new Error('Exactly two polygon layers required');

	return true;
}

export default {
	processor: unionProcessor,
	validator: unionInputValidator
} satisfies GeoJSONProcessor<MapLayer<mapboxgl.Layer>[], GeoJSON, {}, {}>;