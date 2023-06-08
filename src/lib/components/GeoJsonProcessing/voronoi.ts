import voronoi from '@turf/voronoi';
import flatten from '@turf/flatten';
import type { BBox } from '@turf/helpers';
import bbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';
import type { MapLayer } from '../../../stores/mapLayers';
import type { GeoJSONSourceRaw } from 'mapbox-gl';
import _, { isString } from 'lodash';
import type {
	Geometry,
	FeatureCollection,
	GeoJSON,
	Point,
	Feature,
	Polygon,
	MultiPolygon,
	MultiPoint,
	GeoJsonProperties
} from 'geojson';
import type { GeoJSONProcessor } from './types';
import type mapboxgl from 'mapbox-gl';
import {
	isFeature,
	isFeatureCollection,
	isGeoJSON,
	isGeometryCollection,
	isMultiPoint,
	isPoint
} from '$lib/utils/geojson';

export type VoronoiOptions = {
	bbox: BBox;
};

function voronoiProcessor(input: MapLayer<mapboxgl.Layer>[], options?: VoronoiOptions) {
	let data = (input[0].source as GeoJSONSourceRaw).data;

	if (!data || isString(data)) {
		return null;
	}

	if (isGeometryCollection(data)) {
		// Turf voronoi only accepts FeatureCollections, so we need to convert
		data = {
			type: 'FeatureCollection',
			features: data.geometries.map((g) => ({
				type: 'Feature',
				geometry: g,
				properties: {}
			}))
		} satisfies FeatureCollection<Geometry, GeoJsonProperties>;
	}

	if (
		!isFeatureCollection(data) ||
		!data.features.every((f) => isPoint(f.geometry) || isMultiPoint(f.geometry))
	) {
		return null;
	}

	const flattenedPoints = flatten(data as FeatureCollection<Point | MultiPoint>);

	const voronoiFC = voronoi(flattenedPoints, {
		bbox: options?.bbox || bbox(flattenedPoints)
	});

	voronoiFC.features = voronoiFC.features.filter((f) => f !== undefined);

	return [voronoiFC];
}

function voronoiInputValidator(input: MapLayer<mapboxgl.Layer>[]): boolean {
	if (input.length === 0) return false;

	const data = (input[0].source as GeoJSONSourceRaw).data;

	if (!data || !isGeoJSON(data)) {
		return false;
	}

	return true;
}

export default {
	processor: voronoiProcessor,
	validator: voronoiInputValidator
} satisfies GeoJSONProcessor<MapLayer<mapboxgl.Layer>[], GeoJSON[], VoronoiOptions, {}>;
