import type {
	GeoJSON,
	FeatureCollection,
	Feature,
	Polygon,
	MultiPolygon,
	GeometryCollection,
	Geometry
} from 'geojson';
import type { GeoJSONProcessor } from './types';
import buffer from '@turf/buffer';
import type { Units } from '@turf/helpers';
import type { MapLayer } from '../../../stores/mapLayers';
import type mapboxgl from 'mapbox-gl';
import _, { isString } from 'lodash';
import type { GeoJSONSourceRaw } from 'mapbox-gl';
import { isFeature, isFeatureCollection } from '$lib/utils/geojson';
import difference from '@turf/difference';

export type DifferenceOptions = {
	layerA: MapLayer<mapboxgl.Layer> | undefined;
	layerB: MapLayer<mapboxgl.Layer> | undefined;
};

function differenceProcessor(input: MapLayer<mapboxgl.Layer>[]) {
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

	const res = difference(poly1 as any, poly2 as any);
	return res as GeoJSON;
}

function differenceInputValidator(input: MapLayer<mapboxgl.Layer>[]): boolean {
	if (input.length !== 2) return false;

	return true;
}

export default {
	processor: differenceProcessor,
	validator: differenceInputValidator
} satisfies GeoJSONProcessor<MapLayer<mapboxgl.Layer>[], GeoJSON, DifferenceOptions, {}>;
