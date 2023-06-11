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
import {
	getPolygonGeometries,
	isFeature,
	isFeatureCollection,
	isMultiPolygon,
	isPolygon
} from '$lib/utils/geojson';
import difference from '@turf/difference';

export type DifferenceOptions = {
	layerA: MapLayer<mapboxgl.Layer>;
	layerB: MapLayer<mapboxgl.Layer>;
};

function differenceProcessor(input: MapLayer<mapboxgl.Layer>[], options?: DifferenceOptions) {
	if (!options) return null;
	const { layerA, layerB } = options;
	const data = [layerA, layerB].map((l) => (l.source as GeoJSONSourceRaw).data) as GeoJSON[];
	const [poly1, poly2] = data.map((d) => {
		if (isFeatureCollection(d)) {
			if (!d.features.every((f) => isPolygon(f.geometry) || isMultiPolygon(f.geometry)))
				return null;
			return {
				type: 'MultiPolygon',
				coordinates: d.features.flatMap((f) => {
					if (isMultiPolygon(f.geometry)) return f.geometry.coordinates;
					if (isPolygon(f.geometry)) return [f.geometry.coordinates];
					return [];
				})
			} satisfies MultiPolygon;
		}
		return d;
	});
	console.log(poly1, poly2);
	const res = [difference(poly1 as any, poly2 as any)] as GeoJSON[];
	console.log(res);
	return res;
}

function differenceInputValidator(input: MapLayer<mapboxgl.Layer>[]): boolean {
	const data = input.map((l) => (l.source as GeoJSONSourceRaw).data) as GeoJSON[];
	const geoms = getPolygonGeometries(data).filter((g) => g !== null);
	return input.length === geoms.length && geoms.length === 2;
}

export default {
	processor: differenceProcessor,
	validator: differenceInputValidator
} satisfies GeoJSONProcessor<MapLayer<mapboxgl.Layer>[], GeoJSON[], DifferenceOptions, {}>;
