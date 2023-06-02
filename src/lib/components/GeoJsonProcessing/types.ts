import type { GeoJSON } from 'geojson';

const toolTypeArray = [
	'bbox',
	'buffer',
	'clip',
	'difference',
	'intersect',
	'union',
	'voronoi'
] as const;
export type ToolName = (typeof toolTypeArray)[number];

export type Tool<Input extends GeoJSON, Output extends GeoJSON> = {
	name: ToolName;
	iconPath: string;
	geoProcessor?: GeoJSONProcessor<Input, Output | undefined>;
};

export type GeoJSONTool = Tool<GeoJSON, GeoJSON>;

export type GeoJSONProcessor<T extends GeoJSON, U extends GeoJSON | undefined> = {
	processor: (inputData: T) => U;
	validator: (inputData: T) => boolean;
};
