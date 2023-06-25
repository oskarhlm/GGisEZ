import { get, writable, type Writable } from 'svelte/store';
import type { GeoJSON } from 'geojson';
import type { GeoJSONSourceRaw } from 'mapbox-gl';

export type MapSource = {
	id: string;
	geojson: GeoJSONSourceRaw;
	epsg?: string;
	projectionName?: string;
};

function createMapSources() {
	const { subscribe, set, update }: Writable<MapSource[]> = writable([]);

	return {
		subscribe,
		set,
		add: (newSources: MapSource[]) =>
			update((storeSources) => {
				newSources.forEach((s) => {
					if (storeSources.map((l) => l.id).includes(s.id)) {
						const numEqualNamesInStore = storeSources
							.map((l) => l.id)
							.filter((id) => id.startsWith(s.id)).length;
						s.id += `_${numEqualNamesInStore}`;
					}
				});

				return [...storeSources, ...newSources];
			}),
		getUniqueSourceId: (idProposal: string) => {
			const storeSources = get(mapSources);
			if (storeSources.map((s) => s.id).includes(idProposal)) {
				const numEqualNamesInStore = storeSources
					.map((l) => l.id)
					.filter((name) => name.startsWith(idProposal)).length;
				idProposal += `_${numEqualNamesInStore}`;
			}

			return idProposal;
		}
	};
}

export const mapSources = createMapSources();
