<script lang="ts">
	import type mapboxgl from 'mapbox-gl';
	import type { MapLayer } from '../../../stores/mapLayers';
	import type { GeoJSONSourceRaw } from 'mapbox-gl';
	import { isValid } from '../Map/utils';
	import { convertGeometry, isFeature, isFeatureCollection } from '$lib/utils/geojson';
	import _ from 'lodash';
	import Button from '@smui/button';
	import { get } from 'svelte/store';
	import { mapSources } from '../../../stores/mapSources';
	import AttributeTable from './AttributeTable.svelte';
	import { getProj4String, getProjectionName } from '$lib/utils/fileUploader';
	import Textfield from '@smui/textfield';
	import proj4 from 'proj4';

	// export let layer: MapLayer<mapboxgl.Layer>;
	export let layer: any;
	export let map: mapboxgl.Map;

	let stats = new Map<string, string>();
	let attributeTableOpen: boolean = false;

	$: {
		const data = (layer.source as GeoJSONSourceRaw).data;
		stats = new Map<string, string>();
		if (isValid(data)) {
			stats.set('Layer name', layer.displayName);
			stats.set('Type', data.type);
			layer.projectionName && stats.set('From projection', layer.projectionName);
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

	$: showAttributeTableButton =
		source &&
		source.geojson &&
		isValid(source.geojson.data) &&
		isFeatureCollection(source.geojson.data) &&
		source.geojson.data.features.every(
			(f) => 'properties' in f && Object.keys(f.properties!).length > 0
		);

	let epsgValue: string = '';
	let invalidEpsg = false;

	async function transformLayer() {
		try {
			const sourceProjection = await getProj4String(epsgValue);
			const targetProjection = await getProj4String('4326');
			const converter = proj4(sourceProjection!, targetProjection);

			const data = layer.source.data;

			if (isFeatureCollection(data)) {
				data.features.forEach((f) => {
					f.geometry = convertGeometry(f.geometry, converter);
				});
			}

			layer.epsg = epsgValue;
			layer.projectionName = await getProjectionName(epsgValue);

			map.removeLayer(layer.id);
			map.removeSource(layer.id);
			map.addLayer(layer);
		} catch (error) {
			invalidEpsg = true;
			console.error('Could not convert');
		}
	}
</script>

<!-- 
	@component
	Displays a list of stats about the selected layer. 
 -->

<span style="margin-top: 20px;" />
{#each Array.from(stats) as [k, v]}
	<div class="stat"><span class="key">{k}</span>: {v}</div>
{/each}

{#if source && showAttributeTableButton}
	<span style="margin-top: 30px;" />
	<Button
		variant="unelevated"
		on:click={() => {
			attributeTableOpen = true;
		}}>Show attribute table</Button
	>
	<AttributeTable bind:open={attributeTableOpen} bind:geojson={source.geojson} />
{/if}

{#if layer.epsg === undefined}
	<span style="display: flex; align-items: center; gap: 20px; margin-top: 20px;">
		<Textfield label="EPSG" bind:value={epsgValue} bind:invalid={invalidEpsg} />
		<Button variant="unelevated" style="flex: 1;" on:click={transformLayer}>Set</Button>
	</span>
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
