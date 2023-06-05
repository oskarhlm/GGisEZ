<script lang="ts">
	import AnalysisElement from './AnalysisElement.svelte';
	import type { GeoJSONTool, ToolName } from '../GeoJsonProcessing/types';

	export let selectedTool: GeoJSONTool | null;
	export let tools: GeoJSONTool[] | null;
</script>

<div class="container">
	{#if tools}
		{#each tools as tool}
			<AnalysisElement {tool} selected={tool === selectedTool} on:toolSelected />
		{/each}
	{/if}
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
