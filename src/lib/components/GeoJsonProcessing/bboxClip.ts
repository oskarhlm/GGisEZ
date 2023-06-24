import bboxClip from '@turf/bbox-clip';
import type { BBox } from '@turf/helpers';
import { geomReduce } from '@turf/meta';
import union from '@turf/union';
import type { MapLayer } from '../../../stores/mapLayers';
import type { GeoJSONSourceRaw } from 'mapbox-gl';
import _, { isString } from 'lodash';
import type { GeoJSONProcessor } from './types';
import type mapboxgl from 'mapbox-gl';
import bboxPolygon from '@turf/bbox-polygon';
import flatten from '@turf/flatten';
import {
	isFeature,
	isFeatureCollection,
	isGeometry,
	isGeometryCollection,
	isLineString,
	isMultiLineString,
	isMultiPoint,
	isMultiPolygon,
	isPoint,
	isPolygon
} from '$lib/utils/geojson';
import { isValid } from '../Map/utils';
import type {
	Geometry,
	GeometryCollection,
	FeatureCollection,
	Feature,
	GeoJSON,
	Polygon,
	MultiPolygon,
	GeoJsonProperties,
	Point,
	MultiPoint
} from 'geojson';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';

export type BBoxClipOptions = {
	bbox: BBox;
};

function bboxClipper<T extends Feature | Geometry>(data: T, options: BBoxClipOptions) {
	let geoms: Geometry;
	if (isFeature(data)) {
		geoms = data.geometry;
	} else if (isGeometry(data)) {
		geoms = data;
	} else return [];

	const bboxPoly = bboxPolygon(options.bbox);
	if (isPoint(geoms)) {
		if (booleanPointInPolygon(geoms, bboxPoly)) {
			return {
				type: 'Feature',
				geometry: geoms,
				properties: {}
			} satisfies Feature<Point, {}>;
		}
	} else if (isMultiPoint(geoms)) {
		return {
			type: 'Feature',
			geometry: {
				type: 'MultiPoint',
				coordinates: geoms.coordinates.filter((p) => booleanPointInPolygon(p, bboxPoly))
			},
			properties: {}
		} satisfies Feature<MultiPoint, {}>;
	}

	if (
		isLineString(geoms) ||
		isMultiLineString(geoms) ||
		isPolygon(geoms) ||
		isMultiPolygon(geoms)
	) {
		return bboxClip(geoms, options.bbox);
	}

	return [];
}

function bboxClipProcessor(input: MapLayer<mapboxgl.Layer>[], options?: BBoxClipOptions) {
	const data = input.map((l) => (l.source as GeoJSONSourceRaw).data) as GeoJSON[];

	const res = data.map((d) => {
		if (isGeometryCollection(d))
			return {
				type: 'GeometryCollection',
				geometries: d.geometries.flatMap((g) => bboxClipper(g, options!)).map((f) => f.geometry)
			} satisfies GeometryCollection;

		if (isFeatureCollection(d))
			return {
				type: 'FeatureCollection',
				features: d.features.flatMap((f) => bboxClipper(f, options!))
			} satisfies FeatureCollection;

		if (isFeature(d) || isGeometry(d)) return bboxClipper(d, options!);

		return null;
	});

	return res.filter((r) => r !== undefined) as GeoJSON[];
}

function bboxClipInputValidator(
	input: MapLayer<mapboxgl.Layer>[],
	options?: BBoxClipOptions
): boolean {
	const data = input.map((l) => (l.source as GeoJSONSourceRaw).data);
	return input.length > 0 && options !== undefined && data.every(d => isValid(d));
}

export default {
	processor: bboxClipProcessor,
	validator: bboxClipInputValidator
} satisfies GeoJSONProcessor<
	MapLayer<mapboxgl.Layer>[],
	GeoJSON[],
	BBoxClipOptions,
	BBoxClipOptions
>;
