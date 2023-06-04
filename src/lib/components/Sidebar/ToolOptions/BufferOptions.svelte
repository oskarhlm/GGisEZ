<script lang="ts">
	import Slider from '@smui/slider';
	import Button from '@smui/button';
	import FormField from '@smui/form-field/src/FormField.svelte';
	import Select, { Option } from '@smui/select';
	import type { Units } from '@turf/helpers';
	import type { BufferOptions } from '$lib/components/GeoJsonProcessing/buffer';

	export let updateOptions: (neweValue: any) => void;

	const unitsArray: Units[] = ['meters', 'kilometers', 'nauticalmiles', 'acres'];
	let units: Units = 'kilometers';
	let radius = 1;

	$: {
		updateOptions({ radius, units } satisfies BufferOptions);
	}
</script>

<span style="display: flex; align-items: center;">
	<FormField align="end" style="flex: 1;">
		<Slider style="width: 100%;" bind:value={radius} />
	</FormField>
	<p>{radius}</p>
</span>

<Select bind:value={units} label="Unit: ">
	{#each unitsArray as unit}
		<Option value={unit}>{unit.charAt(0).toUpperCase() + unit.slice(1)}</Option>
	{/each}
</Select>

<span style="margin-top: 20px" />
