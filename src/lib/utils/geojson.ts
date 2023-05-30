import type {
	GeoJSON,
	Geometry,
	Feature,
	FeatureCollection,
	GeometryCollection,
	GeoJsonTypes
} from 'geojson';

export function isGeometry(geojson: GeoJSON): geojson is Geometry {
	return (geojson as Geometry).type !== undefined;
}

export function isFeature(geojson: GeoJSON): geojson is Feature {
	return (geojson as Feature).type === 'Feature';
}

export function isFeatureCollection(geojson: GeoJSON): geojson is FeatureCollection {
	return (geojson as FeatureCollection).type === 'FeatureCollection';
}

export function isGeometryCollection(geojson: GeoJSON): geojson is GeometryCollection {
	return (geojson as GeometryCollection).type === 'GeometryCollection';
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
