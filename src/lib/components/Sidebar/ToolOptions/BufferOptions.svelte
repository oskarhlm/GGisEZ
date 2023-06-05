<script lang="ts">
	import Slider from '@smui/slider';
	import Button from '@smui/button';
	import Textfield from '@smui/textfield';

	import FormField from '@smui/form-field/src/FormField.svelte';
	import Select, { Option } from '@smui/select';
	import type { Units } from '@turf/helpers';
	import type { BufferOptions } from '$lib/components/GeoJsonProcessing/buffer';
	import type { ToolSelectOptions } from '../Sidebar.svelte';

	export let updateOptions: (options: ToolSelectOptions) => void;

	const unitsArray: Units[] = ['meters', 'kilometers'];
	let units: Units = 'kilometers';
	let radius = 1;

	let radiusText = radius.toString();
	let oldRadiusText = radiusText;

	$: {
		if (radiusText && radiusText !== oldRadiusText) {
			radius = parseInt(radiusText);
		}

		radiusText = radius.toString();
		oldRadiusText = radiusText;

		updateOptions({ args: { radius, units } satisfies BufferOptions });
	}
</script>

<span style="display: flex; align-items: center;">
	{#if units === 'kilometers'}
		<Slider style="width: 100%;" bind:value={radius} min={1} max={50} step={1} />
	{:else if units === 'meters'}
		<Slider style="width: 100%;" bind:value={radius} min={1} max={1000} step={1} />
	{/if}
	<!-- <Textfield bind:value={radiusText} /> -->
	<p>{radius.toFixed(0)}</p>
</span>

<Select bind:value={units} label="Unit: ">
	{#each unitsArray as unit}
		<Option value={unit}>{unit.charAt(0).toUpperCase() + unit.slice(1)}</Option>
	{/each}
</Select>

<span style="margin-top: 20px" />
