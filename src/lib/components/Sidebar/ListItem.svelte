<script lang="ts">
	import IconButton from '@smui/icon-button';
	import Tooltip, { Wrapper } from '@smui/tooltip';
	import type { GeoJSON } from 'geojson';
	import { onMount } from 'svelte';
	import type { MapSource } from '../../../stores/mapSources';

	export let item: MapSource;
	export let index: any;

	const featureTypeToIconPath = new Map<
		'point' | 'line' | 'polygon',
		{ description: string; iconPath: string }
	>([
		['point', { description: 'Point', iconPath: 'button-icons/point.png' }],
		['line', { description: 'Line', iconPath: 'button-icons/line.png' }],
		['polygon', { description: 'Polygon', iconPath: 'button-icons/polygon.png' }]
	]);

	type layerAction = 'remove' | 'acceptEdit' | 'cancelEdit';
	let action: layerAction = 'acceptEdit';
	const actionDescription = new Map<layerAction, string>([
		['remove', 'Remove layer'],
		['acceptEdit', 'Accept layer edit'],
		['cancelEdit', 'Exit edit mode']
	]);
</script>

<div class="item">
	<img class="icon" src="button-icons/polygon.png" alt={item.name} />
	<p class="description">{item.name}</p>
	<Wrapper>
		<span class="remove-btn"
			><IconButton class="material-icons">
				{#if action === 'remove'}
					remove
				{:else if action === 'acceptEdit'}
					check
				{:else if action === 'cancelEdit'}
					do_disturb
				{/if}
			</IconButton></span
		>
		<Tooltip>{actionDescription.get(action)}</Tooltip>
	</Wrapper>
</div>

<style lang="scss">
	.item {
		display: flex;
		align-items: center;
		cursor: grab;
	}

	.icon {
		margin-right: 10px;
		width: 20px;
		-webkit-user-drag: none;
	}

	.remove-btn {
		margin-left: auto;

		:global(.material-icons) {
			background: none;
			border: none;
			cursor: pointer;
		}
	}
</style>
