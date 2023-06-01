<script lang="ts" context="module">
	const toolTypeArray = [
		'bbox',
		'buffer',
		'clip',
		'difference',
		'intersect',
		'union',
		'voronoi'
	] as const;
	export type Tool = (typeof toolTypeArray)[number];
</script>

<script lang="ts">
	import AnalysisElement from './AnalysisElement.svelte';

	export let map: mapboxgl.Map;
	export let selectedTool: Tool | null;

	const tools: { name: Tool; iconPath: string }[] = [
		{ name: 'bbox', iconPath: 'button-icons/bbox.png' },
		{ name: 'buffer', iconPath: 'button-icons/buffer.png' },
		{ name: 'clip', iconPath: 'button-icons/clip.png' },
		{ name: 'difference', iconPath: 'button-icons/difference.png' },
		{ name: 'intersect', iconPath: 'button-icons/intersection.png' },
		{ name: 'union', iconPath: 'button-icons/union.png' },
		{ name: 'voronoi', iconPath: 'button-icons/vornoi.png' }
	];
</script>

<div class="container">
	{#each tools as tool}
		<AnalysisElement {...tool} selected={tool.name === selectedTool} on:toolSelected />
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
