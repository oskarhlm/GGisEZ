import type { GeoJSON, Geometry, Feature, FeatureCollection } from 'geojson';

export function isGeometry(geojson: GeoJSON): geojson is Geometry {
	return (geojson as Geometry).type !== undefined;
}

export function isFeature(geojson: GeoJSON): geojson is Feature {
	return (geojson as Feature).type === 'Feature';
}

export function isFeatureCollection(geojson: GeoJSON): geojson is FeatureCollection {
	return (geojson as FeatureCollection).type === 'FeatureCollection';
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
