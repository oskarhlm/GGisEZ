import voronoi from '@turf/voronoi';
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

type VoronoiOptions = {
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
		console.log('haha');
		return null;
	}

	const flattenedPoints = data.features.flatMap((f) => {
		if (isPoint(f.geometry)) return f as Feature<Point, GeoJsonProperties>;
		else if (isMultiPoint(f.geometry)) {
			return (f as Feature<MultiPoint, GeoJsonProperties>).geometry.coordinates.map((coords) => {
				const feature: Feature<Point, GeoJsonProperties> = {
					type: 'Feature',
					geometry: {
						type: 'Point',
						coordinates: coords
					},
					properties: {}
				};
				return feature;
			});
		}

		throw new Error();
	});

	return voronoi(
		{
			type: 'FeatureCollection',
			features: flattenedPoints
		} satisfies FeatureCollection<Point, GeoJsonProperties>,
		{
			bbox: options?.bbox || bbox(data)
		}
	);
}

function voronoiInputValidator(input: MapLayer<mapboxgl.Layer>[]): boolean {
	const data = (input[0].source as GeoJSONSourceRaw).data;

	if (!data || !isGeoJSON(data)) {
		return false;
	}

	return true;
}

export default {
	processor: voronoiProcessor,
	validator: voronoiInputValidator
} satisfies GeoJSONProcessor<MapLayer<mapboxgl.Layer>[], GeoJSON, VoronoiOptions, {}>;
