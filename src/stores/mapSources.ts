import { writable, type Writable } from 'svelte/store';
import type { GeoJSON } from 'geojson';
import type { AnySourceData } from 'mapbox-gl';

// export type MapSource = { name: string; data: GeoJSON };
export type MapSource = { name: string; data: GeoJSON };

function createMapSources() {
	const { subscribe, set, update }: Writable<MapSource[]> = writable([]);

	return {
		subscribe,
		set,
		add: (newSources: MapSource[]) =>
			update((storeSources) => {
				newSources.forEach((s) => {
					if (storeSources.map((l) => l.name).includes(s.name)) {
						const numEqualNamesInStore = storeSources
							.map((l) => l.name)
							.filter((name) => name.startsWith(s.name)).length;
						s.name += `_${numEqualNamesInStore}`;
					}
				});

				return [...storeSources, ...newSources];
			})
	};
}

export const mapSources = createMapSources();
