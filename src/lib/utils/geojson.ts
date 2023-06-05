import type {
	GeoJSON,
	Geometry,
	Feature,
	FeatureCollection,
	GeometryCollection,
	GeoJsonTypes,
	GeoJsonProperties,
	Point,
	Polygon,
	LineString,
	MultiPoint,
	MultiPolygon,
	MultiLineString
} from 'geojson';

// export const geoJsonTypeGuards: Record<GeoJsonTypes, (geometry: GeoJSON) => boolean> = {
// 	Point: isPoint,
// 	MultiPoint: isMultiPoint,
// 	LineString: isLineString,
// 	MultiLineString: isMultiLineString,
// 	Polygon: isPolygon,
// 	MultiPolygon: isMultiPolygon,
// 	GeometryCollection: isGeometryCollection,
// 	Feature: isFeature,
// 	FeatureCollection: isFeatureCollection
// };

export function isGeometry(geojson: GeoJSON): geojson is Geometry {
	return (
		isPoint(geojson as Geometry) ||
		isMultiPoint(geojson as Geometry) ||
		isLineString(geojson as Geometry) ||
		isMultiLineString(geojson as Geometry) ||
		isPolygon(geojson as Geometry) ||
		isMultiPolygon(geojson as Geometry) ||
		isGeometryCollection(geojson)
	);
}

// export function isOfGeometryType<T extends Geometry>(
// 	fc: Feature<Geometry, GeoJsonProperties>
// ): fc is Feature<T, GeoJsonProperties>;
// export function isOfGeometryType<T extends Geometry>(
// 	fc: FeatureCollection<Geometry, GeoJsonProperties>
// ): fc is FeatureCollection<T, GeoJsonProperties>;
// export function isOfGeometryType<T extends Geometry>(
// 	f: Feature<Geometry, GeoJsonProperties> | FeatureCollection<Geometry, GeoJsonProperties>
// ): f is Feature<T, GeoJsonProperties> | FeatureCollection<T, GeoJsonProperties> {
// 	// if (isFeature(f)) {
// 	// 	return isGeometryOfType<T>(f.geometry);
// 	// } else if (isFeatureCollection(f)) {
// 	// 	return f.features.every((f) => isGeometryOfType<T>(f.geometry));
// 	// }

// 	if (isFeature(f)) {
// 	} else if (isFeatureCollection(f)) {
// 	}

// 	return false;
// }

// export function isGeometryOfType<T extends Geometry>(geometry: Geometry): geometry is T {
// 	const typeGuard = geoJsonTypeGuards[geometry.type];
// 	return typeGuard(geometry);
// }

export function isPoint(geometry: Geometry): geometry is Point {
	return geometry.type === 'Point';
}

export function isMultiPoint(geometry: Geometry): geometry is MultiPoint {
	return geometry.type === 'MultiPoint';
}

export function isLineString(geometry: Geometry): geometry is LineString {
	return geometry.type === 'LineString';
}

export function isMultiLineString(geometry: Geometry): geometry is MultiLineString {
	return geometry.type === 'MultiLineString';
}

export function isPolygon(geometry: Geometry): geometry is Polygon {
	return geometry.type === 'Polygon';
}

export function isMultiPolygon(geometry: Geometry): geometry is MultiPolygon {
	return geometry.type === 'MultiPolygon';
}

export function isFeature(geojson: GeoJSON): geojson is Feature {
	return geojson.type === 'Feature';
}

export function isFeatureCollection(geojson: GeoJSON): geojson is FeatureCollection {
	return geojson.type === 'FeatureCollection';
}

export function isGeometryCollection(geojson: GeoJSON): geojson is GeometryCollection {
	return geojson.type === 'GeometryCollection';
}

export function isGeoJSON(json: any): json is GeoJSON {
	if (json && typeof json === 'object') {
		if (json.type === 'FeatureCollection' && Array.isArray(json.features)) {
			// Check if it's a valid FeatureCollection
			return json.features.every((feature: Feature) => {
				return (
					feature &&
					typeof feature === 'object' &&
					feature.type === 'Feature' &&
					feature.geometry &&
					typeof feature.geometry === 'object'
				);
			});
		} else if (json.type === 'Feature' && json.geometry && typeof json.geometry === 'object') {
			// Check if it's a valid Feature
			return true;
		} else if (
			json.type &&
			typeof json.type === 'string' &&
			json.geometry &&
			typeof json.geometry === 'object'
		) {
			// Check if it's a valid Geometry
			return true;
		} else if (
			json.type &&
			typeof json.type === 'string' &&
			json.geometries &&
			Array.isArray(json.geometries)
		) {
			return true;
		}
	}
	return false;
}

export function convertGeometry(geometry: Geometry, converter: proj4.Converter): Geometry {
	if (geometry.type === 'Point') {
		return {
			...geometry,
			coordinates: converter.forward(geometry.coordinates)
		};
	} else if (geometry.type === 'LineString' || geometry.type === 'MultiPoint') {
		return {
			...geometry,
			coordinates: geometry.coordinates.map(converter!.forward)
		};
	} else if (geometry.type === 'Polygon' || geometry.type === 'MultiLineString') {
		return {
			...geometry,
			coordinates: geometry.coordinates.map((p) => p.map(converter!.forward))
		};
	} else if (geometry.type === 'MultiPolygon') {
		return {
			...geometry,
			coordinates: geometry.coordinates.map((p) => p.map((p) => p.map(converter!.forward)))
		};
	} else if (geometry.type === 'GeometryCollection') {
		return {
			...geometry,
			geometries: geometry.geometries.map((g) => convertGeometry(g, converter))
		} satisfies GeometryCollection;
	}

	return geometry;
}

type ValueOf<T> = T[keyof T];

type IncludesEvery<T, U extends T[]> = T extends ValueOf<U> ? true : false;

type WhenIncludesEvery<T, U extends T[]> = IncludesEvery<T, U> extends true ? U : never;

export const enumerate =
	<T>() =>
	<U extends T[]>(...elements: WhenIncludesEvery<T, U>): U =>
		elements;

/**
 * Denne er litt artig...
 */
export function isGeoJsonType(candidate: string): candidate is GeoJsonTypes {
	const valid = enumerate<GeoJsonTypes>()(
		'Feature',
		'FeatureCollection',
		'GeometryCollection',
		'LineString',
		'MultiLineString',
		'MultiPoint',
		'MultiPolygon',
		'Point',
		'Polygon'
	);

	return valid.some((value) => candidate === value);
}
