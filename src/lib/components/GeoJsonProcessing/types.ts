import type { GeoJSON, Feature, FeatureCollection } from 'geojson';
import type { MapLayer } from '../../../stores/mapLayers';
import type mapboxgl from 'mapbox-gl';
import type { SvelteComponent } from 'svelte';

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

export type Tool<Input extends MapLayer<mapboxgl.Layer>[], Output extends GeoJSON | null> = {
	name: ToolName;
	iconPath: string;
	geoProcessor?: GeoJSONProcessor<Input, Output, any, any>;
	optionsComponent?: {
		component: any;
		props: { [key: string]: any };
	};
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
// export type GeoJSONTool = Tool<MapLayer<mapboxgl.Layer>[], GeoJSON>;
export type GeoJSONTool = Tool<any, GeoJSON | null>;
// export type GeoJSONTool = Tool<any, Feature | FeatureCollection | null>;

export type GeoJSONProcessor<
	Input, // extends MapLayer<mapboxgl.Layer>[],
	Output,
	ProcessorArgs extends Record<string, any>,
	ValidatorArgs extends Record<string, any>
> = {
	processor: (inputData: Input, options?: ProcessorArgs) => Output | null;
	validator: (inputData: Input, options?: ValidatorArgs) => boolean;
};
