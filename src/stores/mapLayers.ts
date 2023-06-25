import { writable, type Subscriber, type Writable, get } from 'svelte/store';
import type mapboxgl from 'mapbox-gl';
import type { GeoJSON } from 'geojson';
import { enumerate } from '$lib/utils/geojson';
import type { GeoJSONSourceRaw } from 'mapbox-gl';
import type { MapSource } from './mapSources';

export type MapLayer<T extends mapboxgl.Layer> = {
	epsg?: string;
	projectionName?: string;
	isVisible: boolean;
	displayName: string;
	attachedLayerIds?: string[];
} & T;

function createMapLayers() {
	const { subscribe, set, update }: Writable<MapLayer<mapboxgl.Layer>[]> = writable([]);
	const {
		subscribe: subscribeNewLayerIndex,
		set: setNewLayerIndex
	}: Writable<{ layerId: string; index: number }> = writable();

	return {
		subscribe,
		set,
		update,
		add: <T extends mapboxgl.Layer>(newLayer: MapLayer<T>) =>
			update((storeLayers) => [newLayer, ...storeLayers]),
		getUniqueLayerId: <T extends mapboxgl.Layer>(newLayer: MapLayer<T>): MapLayer<T> => {
			const storeLayers = get(mapLayers);

			if (storeLayers.map((l) => l.id).includes(newLayer.id)) {
				const numEqualNamesInStore = storeLayers
					.map((l) => l.id)
					.filter((name) => name.startsWith(newLayer.id)).length;
				newLayer.id += `_${numEqualNamesInStore}`;
				newLayer.displayName += `_${numEqualNamesInStore}`;
			}

			return newLayer;
		},
		setNewLayerIndex,
		subscribeNewLayerIndex,
		toggleVisibility: (layerId: string) =>
			update((storeLayers) => {
				const layer = storeLayers.find((l) => l.id === layerId);
				if (!layer) throw new Error('Invalid layer id');
				layer.isVisible = !layer.isVisible;
				return storeLayers;
			}),
		deleteLayer: (layerId: string) =>
			update((storeLayers) => {
				return storeLayers.filter((l) => l.id !== layerId);
			})
	};
}

export const mapLayers = createMapLayers();
