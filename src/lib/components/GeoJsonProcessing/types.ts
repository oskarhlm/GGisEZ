import type { GeoJSON } from 'geojson';
import type { MapLayer } from '../../../stores/mapLayers';
import type mapboxgl from 'mapbox-gl';

export const toolNamesArray = [
	'bbox',
	'buffer',
	'clip',
	'difference',
	'intersect',
	'union',
	'voronoi'
] as const;
export type ToolName = (typeof toolNamesArray)[number];

export type Tool<Input extends MapLayer<mapboxgl.Layer>[], Output extends GeoJSON> = {
	name: ToolName;
	iconPath: string;
	geoProcessor?: GeoJSONProcessor<Input, Output | undefined>;
};

// export type Tool<Input extends GeoJSON, Output extends GeoJSON> = {
// 	iconPath: string;
// 	geoProcessor?: GeoJSONProcessor<Input, Output | undefined>;
// };

// export type Tools<Input extends GeoJSON, Output extends GeoJSON> = {
// 	[key in ToolName]: Tool<Input, Output>;
// };

// export type Tools<Input extends GeoJSON, Output extends GeoJSON> = {
// 	[key in ToolName]: {
// 		iconPath: string;
// 		geoProcessor?: GeoJSONProcessor<Input, Output | undefined>;
// 	};
// };

// export type GeoJSONTools = Tools<GeoJSON, GeoJSON>;
export type GeoJSONTool = Tool<MapLayer<mapboxgl.Layer>[], GeoJSON>;

export type GeoJSONProcessor<
	T extends MapLayer<mapboxgl.Layer>[],
	U extends GeoJSON | undefined
> = {
	processor: (inputData: T) => U;
	validator: (inputData: T) => boolean;
};
