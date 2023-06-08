import type { GeoJSON, Feature, FeatureCollection } from 'geojson';
import type { MapLayer } from '../../../stores/mapLayers';
import type mapboxgl from 'mapbox-gl';

export const toolNamesArray = [
	'bbox',
	'buffer',
	'clip',
	'difference',
	'intersect',
	'union',
	'voronoi',
	'dissolve'
] as const;
export type ToolName = (typeof toolNamesArray)[number];

export type Tool<Input extends MapLayer<mapboxgl.Layer>[], Output extends GeoJSON[] | null> = {
	name: ToolName;
	iconPath: string;
	geoProcessor?: GeoJSONProcessor<Input, Output, any, any>;
	tooltip: any;
	optionsComponent?: {
		component: any;
		props: { [key: string]: any };
	};
	onSelected?: () => void;
};

export type GeoJSONTool = Tool<any, GeoJSON[] | null>;

export type GeoJSONProcessor<
	Input extends MapLayer<mapboxgl.Layer>[],
	Output extends GeoJSON[] | null,
	ProcessorArgs extends Record<string, any>,
	ValidatorArgs extends Record<string, any>
> = {
	processor: (inputData: Input, options?: ProcessorArgs) => Output | null;
	validator: (inputData: Input, options?: ValidatorArgs) => boolean;
};
