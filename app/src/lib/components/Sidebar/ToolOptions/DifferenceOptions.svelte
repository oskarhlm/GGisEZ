<script lang="ts">
	import Select, { Option } from '@smui/select';
	import { mapLayers, type MapLayer } from '../../../../stores/mapLayers';
	import { get } from 'svelte/store';
	import type { DifferenceOptions } from '$lib/components/GeoJsonProcessing/difference';
	import type { ToolSelectOptions } from '../Sidebar.svelte';

	export let updateOptions: (options: ToolSelectOptions) => void;

	let layerAId: string;
	let layerBId: string;

	$: layerAOptions = get(mapLayers).filter((l) => l.id !== layerBId);
	$: layerBOptions = get(mapLayers).filter((l) => l.id !== layerAId);

	$: {
		updateOptions({
			args: {
				layerA: get(mapLayers).find((l) => l.id === layerAId)!,
				layerB: get(mapLayers).find((l) => l.id === layerBId)!
			} satisfies DifferenceOptions,
			layerSelection: get(mapLayers).filter((l) => [layerAId, layerBId].includes(l.id))
		});
	}
</script>

<Select bind:value={layerAId} label="Layer A">
	{#each layerAOptions as layer}
		<Option value={layer.id}>{layer.displayName}</Option>
	{/each}
</Select>

<Select bind:value={layerBId} label="Layer B">
	{#each layerBOptions as layer}
		<Option value={layer.id}>{layer.displayName}</Option>
	{/each}
</Select>

<span style="margin-top: 20px" />
