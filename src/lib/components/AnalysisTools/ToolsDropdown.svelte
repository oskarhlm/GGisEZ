<script lang="ts">
	import AnalysisElement from './AnalysisElement.svelte';
	import { BufferProcessor, IntersectProcessor } from '../GeoJsonProcessing';
	import type { GeoJSONTool, ToolName } from '../GeoJsonProcessing/types';
	import BufferOptions from '../Sidebar/ToolOptions/BufferOptions.svelte';
	import IntersectOptions from '../Sidebar/ToolOptions/IntersectOptions.svelte';

	export let map: mapboxgl.Map;
	export let selectedTool: GeoJSONTool | null;

	const tools: GeoJSONTool[] = [
		{ name: 'bbox', iconPath: 'button-icons/bbox.png' },
		{
			name: 'buffer',
			iconPath: 'button-icons/buffer.png',
			geoProcessor: BufferProcessor,
			optionsComponent: BufferOptions
		},
		{ name: 'clip', iconPath: 'button-icons/clip.png' },
		{ name: 'difference', iconPath: 'button-icons/difference.png' },
		{
			name: 'intersect',
			iconPath: 'button-icons/intersection.png',
			geoProcessor: IntersectProcessor,
			optionsComponent: IntersectOptions
		},
		{ name: 'union', iconPath: 'button-icons/union.png' },
		{ name: 'voronoi', iconPath: 'button-icons/vornoi.png' }
	];

	// const tools: GeoJSONTools = {
	// 	bbox: { iconPath: 'button-icons/bbox.png' },
	// 	buffer: { iconPath: 'button-icons/buffer.png', geoProcessor: BufferProcessor },
	// 	clip: { iconPath: 'button-icons/clip.png' },
	// 	difference: { iconPath: 'button-icons/difference.png' },
	// 	intersect: { iconPath: 'button-icons/intersection.png' },
	// 	union: {iconPath: 'button-icons/union.png' },
	// 	voronoi: { iconPath: 'button-icons/vornoi.png' }
	// }
</script>

<div class="container">
	{#each tools as tool}
		<AnalysisElement {tool} selected={tool === selectedTool} on:toolSelected />
	{/each}
</div>

<style lang="scss">
	.container {
		/* position: absolute;
		top: 0;
		right: 0; */
		margin-left: 10px;
		pointer-events: all;
		/* border-radius: 5px; */
		display: flex;
		flex-direction: column;
		/* gap: 7px; */
		@include transparent-background($background-gray, 0.6);
		height: fit-content;
		align-items: center;
	}

	.container:hover {
		@include transparent-background($background-gray, 0.8);
	}
</style>
