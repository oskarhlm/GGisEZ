<script lang="ts">
	import type mapboxgl from 'mapbox-gl';
	import type { MapLayer } from '../../../stores/mapLayers';
	import type { GeoJSONSourceRaw } from 'mapbox-gl';
	import { isValid } from '../Map/utils';
	import { isFeatureCollection } from '$lib/utils/geojson';
	import _ from 'lodash';

	export let layer: MapLayer<mapboxgl.Layer>;

	let stats = new Map<string, string>();

	$: {
		const data = (layer.source as GeoJSONSourceRaw).data;
		stats = new Map<string, string>();
		if (isValid(data)) {
			stats.set('Layer name', layer.displayName);
			stats.set('Type', data.type);
			// stats.set('Source', JSON.stringify(layer.source as any));
			if (isFeatureCollection(data)) {
				stats.set('Total number of features', data.features.length.toString());
				const featureGroups = _.groupBy(data.features, (f) => f.geometry.type);
				_.forEach(featureGroups, (items, category) => {
					stats.set(`\t- ${category}s`, items.length.toString());
				});
			}
		}
	}
</script>

<h1>Info</h1>
{#each Array.from(stats) as [k, v]}
	<div class="stat"><span class="key">{k}</span>: {v}</div>
{/each}

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
