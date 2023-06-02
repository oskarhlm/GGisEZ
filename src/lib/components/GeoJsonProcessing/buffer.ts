import type { GeoJSON } from 'geojson';
import type { GeoJSONProcessor } from './types';

function bufferProcessor(input: GeoJSON): GeoJSON | undefined {
	return input;
}

function bufferInputValidator(input: GeoJSON): boolean {
	return true;
}

export default {
	processor: bufferProcessor,
	validator: bufferInputValidator
} satisfies GeoJSONProcessor<GeoJSON, GeoJSON | undefined>;
