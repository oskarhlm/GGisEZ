import { writable, type Writable } from 'svelte/store';
import type mapboxgl from 'mapbox-gl';

export const mapLayers: Writable<mapboxgl.AnyLayer[]> = writable([]);
