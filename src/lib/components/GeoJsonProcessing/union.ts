import union from '@turf/union';
import type { MapLayer } from '../../../stores/mapLayers';
import type { GeoJSONSourceRaw } from 'mapbox-gl';
import _, { isString } from 'lodash';
import type { GeoJSON, Feature, Polygon, MultiPolygon, GeoJsonProperties } from 'geojson';
import type { GeoJSONProcessor } from './types';
import type mapboxgl from 'mapbox-gl';
import {
	getPolygonGeometries,
	isFeature,
	isFeatureCollection,
	isMultiPolygon,
	isPolygon
} from '$lib/utils/geojson';

function unionProcessor(input: MapLayer<mapboxgl.Layer>[]) {
	const data = input.map((l) => (l.source as GeoJSONSourceRaw).data) as GeoJSON[];
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
	return [union(poly1 as any, poly2 as any)].filter((u) => u !== null) as GeoJSON[];
}

function unionInputValidator(input: MapLayer<mapboxgl.Layer>[]): boolean {
	const data = input.map((l) => (l.source as GeoJSONSourceRaw).data) as GeoJSON[];
	const geoms = getPolygonGeometries(data).filter((g) => g !== null);
	return input.length === geoms.length && geoms.length === 2;
}

export default {
	processor: unionProcessor,
	validator: unionInputValidator
} satisfies GeoJSONProcessor<MapLayer<mapboxgl.Layer>[], GeoJSON[], {}, {}>;
