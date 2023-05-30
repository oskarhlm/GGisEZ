import { writable, type Writable } from 'svelte/store';
import type mapboxgl from 'mapbox-gl';

function createMapLayers() {
	const { subscribe, set, update }: Writable<mapboxgl.AnyLayer[]> = writable([]);
	const {
		subscribe: subscribeNewLayerIndex,
		set: setNewLayerIndex
	}: Writable<{ layerId: string; index: number }> = writable();

	return {
		subscribe,
		set,
		add: (newLayer: mapboxgl.AnyLayer) =>
			update((storeLayers) => {
				if (storeLayers.map((l) => l.id).includes(newLayer.id)) {
					const numEqualNamesInStore = storeLayers
						.map((l) => l.id)
						.filter((name) => name.startsWith(newLayer.id)).length;
					newLayer.id += `_${numEqualNamesInStore}`;
				}

				return [newLayer, ...storeLayers];
			}),
		setNewLayerIndex,
		subscribeNewLayerIndex
	};
}

export const mapLayers = createMapLayers();
