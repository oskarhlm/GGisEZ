<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { GeoJSONTool } from '../GeoJsonProcessing/types';

	export let tool: GeoJSONTool;
	export let selected = false;

	const dispatch = createEventDispatcher<{ toolSelected: GeoJSONTool | null }>();

	function handleSelect() {
		selected = !selected;
		dispatch('toolSelected', selected ? tool : null);
	}
</script>

<button class:selected on:click={handleSelect}>
	<img class="button-icon" alt="button" src={tool.iconPath || 'button-icons/intersection.png'} />
	<p>{tool.name.toUpperCase()}</p>
</button>

<style lang="scss">
	p {
		margin: 0;
		font-size: 12px;
		color: white;
	}

	button {
		/* border: none; */
		border-style: solid;
		border-width: 2px;
		appearance: none;
		border-color: rgba(0, 0, 0, 0);
		background-color: rgba(0, 0, 0, 0);
		/* border-radius: 5px; */
		padding: 0;
		cursor: inherit;
		width: 100%;
		padding-inline: 3px;
		padding-block: 8px;
	}

	button:hover {
		background-color: $background-gray-brighter;
	}

	.selected {
		background-color: $background-gray-brighter;
		border-color: $highlight-color;
		opacity: 1;
	}

	.button-icon {
		width: 40px;
	}
</style>
