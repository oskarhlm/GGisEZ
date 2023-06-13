<script lang="ts">
	import type mapboxgl from 'mapbox-gl';
	import type { MapLayer } from '../../../stores/mapLayers';
	import type { GeoJSONSourceRaw } from 'mapbox-gl';
	import { isValid } from '../Map/utils';
	import { isFeature, isFeatureCollection } from '$lib/utils/geojson';
	import _ from 'lodash';
	import Button from '@smui/button';
	import { get } from 'svelte/store';
	import { mapSources } from '../../../stores/mapSources';
	import AttributeTable from './AttributeTable.svelte';

	export let layer: MapLayer<mapboxgl.Layer>;
	export let map: mapboxgl.Map;

	let stats = new Map<string, string>();
	let attributeTableOpen: boolean = false;

	$: {
		const data = (layer.source as GeoJSONSourceRaw).data;
		stats = new Map<string, string>();
		if (isValid(data)) {
			stats.set('Layer name', layer.displayName);
			stats.set('Type', data.type);
			stats.set('EPSG', layer.epsg || 'unknown');
			if (isFeatureCollection(data)) {
				stats.set('Total number of features', data.features.length.toString());
				const featureGroups = _.groupBy(data.features, (f) => f.geometry.type);
				_.forEach(featureGroups, (items, category) => {
					stats.set(`\t- ${category}s`, items.length.toString());
				});
			} else if (isFeature(data)) {
				stats.set('Geometry type', data.geometry.type);
			}
		}
	}

	$: source = get(mapSources).find((s) => s.id === layer.id.split('-')[0]);
</script>

<!-- 
	@component
	Displays a list of stats about the selected layer. 
 -->

<h1>Info</h1>
{#each Array.from(stats) as [k, v]}
	<div class="stat"><span class="key">{k}</span>: {v}</div>
{/each}

{#if source && source.geojson}
	<span style="margin-top: 30px;" />
	<Button
		variant="unelevated"
		on:click={() => {
			attributeTableOpen = true;
		}}>Show attribute table</Button
	>
	<AttributeTable bind:open={attributeTableOpen} bind:geojson={source.geojson} />
{/if}

<style lang="scss">
	.key {
		font-weight: 600;
		white-space: pre;
	}

	.stat {
		display: flex;
		margin-block: 5px;
	}
</style>
