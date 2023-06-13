<script lang="ts">
	import AnalysisElement from './AnalysisElement.svelte';
	import type { GeoJSONTool } from '../GeoJsonProcessing/types';
	import _ from 'lodash';

	export let selectedTool: GeoJSONTool | null;
	export let tools: GeoJSONTool[] | null;
</script>

<!--
	@component 
	Component that takes a list of GeoJSONTools and aligns them vertically.
 -->

<div class="container">
	{#if tools}
		{#each _.sortBy(tools, (t) => t.name) as tool}
			<AnalysisElement {tool} selected={tool === selectedTool} on:toolSelected />
		{/each}
	{/if}
</div>

<style lang="scss">
	.container {
		margin-left: 10px;
		pointer-events: all;
		display: flex;
		flex-direction: column;
		@include transparent-background($background-gray, 0.6);
		height: fit-content;
		align-items: center;
	}

	.container:hover {
		@include transparent-background($background-gray, 0.8);
	}
</style>
