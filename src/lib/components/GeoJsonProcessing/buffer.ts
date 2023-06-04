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
import _ from 'lodash';
import type { GeoJSONSourceRaw } from 'mapbox-gl';

export type BufferOptions = { radius: number; units: Units };

function bufferProcessor(input: MapLayer<mapboxgl.Layer>[], options?: BufferOptions) {
	const sources = input.map((l) => l.source) as GeoJSONSourceRaw[];
	const data: any = sources.map((s) => s.data);
	const buf = buffer(data[0], options?.radius || 1, { units: options?.units || 'kilometers' });
	return buf;
}

function bufferInputValidator(input: MapLayer<mapboxgl.Layer>[]): boolean {
	return true;
}

export default {
	processor: bufferProcessor,
	validator: bufferInputValidator
} satisfies GeoJSONProcessor<
	MapLayer<mapboxgl.Layer>[],
	FeatureCollection | Feature<Polygon | MultiPolygon> | undefined,
	{ radius: number; units: Units },
	{}
>;
