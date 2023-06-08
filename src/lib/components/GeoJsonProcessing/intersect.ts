import intersect from '@turf/intersect';
import type { MapLayer } from '../../../stores/mapLayers';
import type { GeoJSONSourceRaw } from 'mapbox-gl';
import _, { isString } from 'lodash';
import type { GeoJSON, Feature, Polygon, MultiPolygon, GeoJsonProperties } from 'geojson';
import type { GeoJSONProcessor } from './types';
import type mapboxgl from 'mapbox-gl';
import { isFeature, isFeatureCollection } from '$lib/utils/geojson';

function intersectProcessor(input: MapLayer<mapboxgl.Layer>[]) {
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

	const intersection = intersect(poly1 as any, poly2 as any);
	return [intersection] as GeoJSON[];
}

function intersectInputValidator(input: MapLayer<mapboxgl.Layer>[]): boolean {
	return input.length === 2;
}

export default {
	processor: intersectProcessor,
	validator: intersectInputValidator
} satisfies GeoJSONProcessor<
	// { poly1: MapLayer<mapboxgl.Layer>; poly2: MapLayer<mapboxgl.Layer> },
	MapLayer<mapboxgl.Layer>[],
	// Feature<Polygon | MultiPolygon, any> | null,
	GeoJSON[],
	{},
	{}
>;
