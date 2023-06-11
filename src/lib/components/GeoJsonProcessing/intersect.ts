import intersect from '@turf/intersect';
import type { MapLayer } from '../../../stores/mapLayers';
import type { GeoJSONSourceRaw } from 'mapbox-gl';
import _, { isString } from 'lodash';
import type { GeoJSON, Feature, Polygon, MultiPolygon, GeoJsonProperties, Position } from 'geojson';
import type { GeoJSONProcessor } from './types';
import type mapboxgl from 'mapbox-gl';
import {
	isFeature,
	isFeatureCollection,
	isGeoJSON,
	isGeometry,
	isGeometryCollection,
	isMultiPolygon,
	isPolygon
} from '$lib/utils/geojson';

type ValidInput = Polygon | MultiPolygon | Feature<Polygon | MultiPolygon, GeoJsonProperties>;

function getPolygonGeometries(data: (GeoJSON | string | undefined)[]) {
	if (data === undefined || isString(data)) throw new Error('Invalid data');
	return (data as GeoJSON[]).map((d) => {
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
		if (isFeature(d)) return d.geometry;
		if (isGeometryCollection(d)) {
			if (!d.geometries.every((g) => isPolygon(g) || isMultiPolygon(g))) return null;
			return {
				type: 'MultiPolygon',
				coordinates: d.geometries.flatMap((g) => {
					if (isMultiPolygon(g)) return g.coordinates;
					if (isPolygon(g)) return [g.coordinates];
					return [];
				})
			} satisfies MultiPolygon;
		}
		if (isPolygon(d) || isMultiPolygon(d)) return d;
		return null;
	});
}

function intersectProcessor(input: MapLayer<mapboxgl.Layer>[]) {
	const data = input.map((l) => (l.source as GeoJSONSourceRaw).data) as any;
	let geoms = getPolygonGeometries(data)! as (Polygon | MultiPolygon)[];
	console.log(geoms);
	const [poly1, poly2] = geoms;
	const intersection = intersect(poly1, poly2);
	return [intersection] as GeoJSON[];
}

function intersectInputValidator(input: MapLayer<mapboxgl.Layer>[]): boolean {
	const data = input.map((l) => (l.source as GeoJSONSourceRaw).data) as GeoJSON[];
	const geoms = getPolygonGeometries(data).filter((g) => g !== null);
	return input.length === geoms.length && geoms.length === 2;
}

export default {
	processor: intersectProcessor,
	validator: intersectInputValidator
} satisfies GeoJSONProcessor<MapLayer<mapboxgl.Layer>[], GeoJSON[], {}, {}>;
