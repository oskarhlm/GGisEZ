import intersect from '@turf/intersect';
import type { MapLayer } from '../../../stores/mapLayers';
import type { GeoJSONSourceRaw } from 'mapbox-gl';
import _, { isString } from 'lodash';
import type { GeoJSON, Feature, Polygon, MultiPolygon, GeoJsonProperties, Position } from 'geojson';
import type { GeoJSONProcessor } from './types';
import type mapboxgl from 'mapbox-gl';
import {
	getPolygonGeometries,
	isFeature,
	isFeatureCollection,
	isGeoJSON,
	isGeometry,
	isGeometryCollection,
	isMultiPolygon,
	isPolygon
} from '$lib/utils/geojson';

function intersectProcessor(input: MapLayer<mapboxgl.Layer>[]) {
	const data = input.map((l) => (l.source as GeoJSONSourceRaw).data) as any;
	let geoms = getPolygonGeometries(data)! as (Polygon | MultiPolygon)[];
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
