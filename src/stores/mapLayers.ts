import { writable, type Writable } from 'svelte/store';
import type mapboxgl from 'mapbox-gl';

// export const mapLayers: Writable<mapboxgl.AnyLayer[]> = writable([]);

function createMapLayers() {
	const { subscribe, set, update }: Writable<mapboxgl.AnyLayer[]> = writable([]);

	return {
		subscribe,
		set,
		add: (newLayer: mapboxgl.AnyLayer) =>
			update((storeLayers) => {
				console.log('yaya');
				if (storeLayers.map((l) => l.id).includes(newLayer.id)) {
					const numEqualNamesInStore = storeLayers
						.map((l) => l.id)
						.filter((name) => name.startsWith(newLayer.id)).length;
					newLayer.id += `_${numEqualNamesInStore}`;
				}

				console.log(newLayer.id);
				return [...storeLayers, newLayer];
			})
	};
}

export const mapLayers = createMapLayers();
