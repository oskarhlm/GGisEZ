import { writable, type Writable } from 'svelte/store';
import type { GeoJSON } from 'geojson';

export type MapSource = { name: string; data: GeoJSON };

export const mapSources: Writable<MapSource[]> = writable([]);
