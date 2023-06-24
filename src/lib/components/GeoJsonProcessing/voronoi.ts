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
	isGeometry,
	isGeometryCollection,
	isMultiPoint,
	isPoint
} from '$lib/utils/geojson';
import { isValid } from '../Map/utils';

export type VoronoiOptions = {
	bbox: BBox;
};

function voronoiProcessor(input: MapLayer<mapboxgl.Layer>[], options?: VoronoiOptions) {
	const data = input.map((l) => (l.source as GeoJSONSourceRaw).data) as GeoJSON[];

	const voronoiFCs = data.map((d) => {
		if (isGeometryCollection(d)) {
			// Turf voronoi only accepts FeatureCollections, so we need to convert
			d = {
				type: 'FeatureCollection',
				features: d.geometries.map((g) => ({
					type: 'Feature',
					geometry: g,
					properties: {}
				}))
			} satisfies FeatureCollection<Geometry, GeoJsonProperties>;
		} else if (isGeometry(d) && (isPoint(d) || isMultiPoint(d))) {
			d = {
				type: 'FeatureCollection',
				features: [
					{
						type: 'Feature',
						geometry: {
							type: d.type,
							coordinates: d.coordinates as any
						},
						properties: {}
					}
				]
			} satisfies FeatureCollection<Point | MultiPoint, GeoJsonProperties>;
		} else if (isFeature(d)) {
			d = {
				type: 'FeatureCollection',
				features: [d] as any
			} satisfies FeatureCollection<Point | MultiPoint, GeoJsonProperties>;
		}

		const flattenedPoints = flatten(d as FeatureCollection<Point | MultiPoint>);

		const voronoiFC = voronoi(flattenedPoints, {
			bbox: options?.bbox || bbox(flattenedPoints)
		});

		voronoiFC.features = voronoiFC.features.filter((f) => f !== undefined);

		return voronoiFC as GeoJSON;
	});

	return voronoiFCs.filter((v) => v !== null) as GeoJSON[];
}

function voronoiInputValidator(input: MapLayer<mapboxgl.Layer>[]): boolean {
	if (input.length === 0) return false;
	const data = input.map((l) => (l.source as GeoJSONSourceRaw).data) as GeoJSON[];

	return data.every((d) => {
		if (isGeometryCollection(d)) return d.geometries.every((g) => isPoint(g) || isMultiPoint(g));
		if (isGeometry(d)) return isPoint(d) || isMultiPoint(d);
		if (isFeature(d)) return isPoint(d.geometry) || isMultiPoint(d.geometry);
		if (isFeatureCollection(d))
			return d.features.every((f) => isPoint(f.geometry) || isMultiPoint(f.geometry));
	});
}

export default {
	processor: voronoiProcessor,
	validator: voronoiInputValidator
} satisfies GeoJSONProcessor<MapLayer<mapboxgl.Layer>[], GeoJSON[], VoronoiOptions, {}>;
