import intersect from '@turf/intersect';
import type { MapLayer } from '../../../stores/mapLayers';
import type { GeoJSONSourceRaw } from 'mapbox-gl';
import _, { isString } from 'lodash';
import type { GeoJSON, Feature, Polygon, MultiPolygon, GeoJsonProperties } from 'geojson';
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

function getGeometries(data: (GeoJSON | string | undefined)[]) {
	if (data === undefined || isString(data)) throw new Error('Invalid data');
	return (data as GeoJSON[])
		.map((d) => {
			if (isFeatureCollection(d)) return d.features.map((f) => f.geometry);
			if (isFeature(d)) return d.geometry;
			if (isGeometryCollection(d)) return d.geometries;
			if (isGeometry(d)) return d;
		})
		.filter((d) => d !== undefined);
}

function intersectProcessor(input: MapLayer<mapboxgl.Layer>[]) {
	const data = input.map((l) => (l.source as GeoJSONSourceRaw).data);
	let geoms = getGeometries(data)! as unknown as (Polygon | MultiPolygon | Polygon[])[];
	geoms = geoms.map((g) => {
		if (Array.isArray(g))
			return {
				type: 'MultiPolygon',
				coordinates: g.map((g) => g.coordinates)
			} satisfies MultiPolygon;

		return g;
	});
	const [poly1, poly2] = geoms as (Polygon | MultiPolygon)[];
	const intersection = intersect(poly1, poly2);
	return [intersection] as GeoJSON[];
}

function intersectInputValidator(input: MapLayer<mapboxgl.Layer>[]): boolean {
	const geoms = getGeometries(input.map((l) => (l.source as GeoJSONSourceRaw).data));
	console.log(geoms);
	return (
		input.length === 2 &&
		geoms.every((g) => {
			if (Array.isArray(g)) return g.every(isPolygon);
			return g && (isPolygon(g) || isMultiPolygon(g));
		})
	);
}

export default {
	processor: intersectProcessor,
	validator: intersectInputValidator
} satisfies GeoJSONProcessor<MapLayer<mapboxgl.Layer>[], GeoJSON[], {}, {}>;
