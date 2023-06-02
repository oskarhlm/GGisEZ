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
import {
	isFeature,
	isFeatureCollection,
	isGeometry,
	isGeometryCollection
} from '$lib/utils/geojson';
import { isValid } from '../Map/utils';
import type { MapLayer } from '../../../stores/mapLayers';
import type mapboxgl from 'mapbox-gl';
import _ from 'lodash';
import type { GeoJSONSourceRaw } from 'mapbox-gl';

function bufferProcessor(input: MapLayer<mapboxgl.Layer>[]) {
	const sources = input.map((l) => l.source) as GeoJSONSourceRaw[];
	const data: any = sources.map((s) => s.data);
	console.log(data);
	return buffer(data[0], 20);
}

function bufferInputValidator(input: MapLayer<mapboxgl.Layer>[]): boolean {
	return true;
}

export default {
	processor: bufferProcessor,
	validator: bufferInputValidator
} satisfies GeoJSONProcessor<
	MapLayer<mapboxgl.Layer>[],
	FeatureCollection | Feature<Polygon | MultiPolygon> | undefined
>;
