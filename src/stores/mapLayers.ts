import { writable, type Writable } from 'svelte/store';
import type mapboxgl from 'mapbox-gl';
import type { GeoJSON } from 'geojson';
import { enumerate } from '$lib/utils/geojson';
import type { GeoJSONSourceRaw } from 'mapbox-gl';

export type MapLayer<T extends mapboxgl.Layer> = {
	displayName: string;
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
		add: <T extends mapboxgl.Layer>(newLayer: MapLayer<T>) =>
			update((storeLayers) => {
				if (storeLayers.map((l) => l.id).includes(newLayer.id)) {
					const numEqualNamesInStore = storeLayers
						.map((l) => l.id)
						.filter((name) => name.startsWith(newLayer.id)).length;
					newLayer.id += `_${numEqualNamesInStore}`;
				}
				console.log((newLayer.source as GeoJSONSourceRaw).data);

				return [newLayer, ...storeLayers];
			}),
		setNewLayerIndex,
		subscribeNewLayerIndex
	};
}

export const mapLayers = createMapLayers();
