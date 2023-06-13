<script lang="ts" context="module">
	export type LayerActionType =
		| 'remove'
		| 'acceptEdit'
		| 'cancelEdit'
		| 'isVisible'
		| 'isInvisible'
		| 'checked'
		| 'notChecked';
	export type Action = { tooltip?: string; onClick: () => void; muiIcon: string };
	export type IconButtonDescription = { [key in LayerActionType]: Action };
</script>

<script lang="ts">
	import IconButton from '@smui/icon-button';
	import Tooltip, { Wrapper } from '@smui/tooltip';
	import _ from 'lodash';
	import type mapboxgl from 'mapbox-gl';
	import { mapLayers, type MapLayer } from '../../../stores/mapLayers';
	import { createEventDispatcher } from 'svelte';
	import type { GeoJSONTool, Tool } from '../GeoJsonProcessing/types';

	export let map: mapboxgl.Map;
	export let layer: MapLayer<mapboxgl.Layer>;
	export let selectedTool: GeoJSONTool | null;
	export let selectModeEnabled: boolean;
	export let selectedLayers: MapLayer<mapboxgl.Layer>[];

	$: checked = selectedLayers.includes(layer);
	let currentAction: LayerActionType;

	$: currentAction =
		!selectedTool && !selectModeEnabled ? 'remove' : checked ? 'checked' : 'notChecked';

	let visibility: LayerActionType;
	$: visibility = layer.isVisible ? 'isVisible' : 'isInvisible';

	let nodeRef: Node;

	const dispatch = createEventDispatcher<{
		toggled: MapLayer<mapboxgl.Layer>;
		singleSelect: MapLayer<mapboxgl.Layer>;
	}>();
	const handleOnToggled = () => dispatch('toggled', layer);
	const handleOnSingleSelect = () => dispatch('singleSelect', layer);

	function getIconPath(layer: mapboxgl.Layer) {
		switch (layer.type) {
			case 'circle':
				return 'button-icons/point.png';
			case 'line':
				return 'button-icons/line.png';
			case 'fill':
			case 'fill-extrusion':
				return 'button-icons/polygon.png';
			default:
				return 'button-icons/polygon.png';
		}
	}

	const actionDescription: IconButtonDescription = {
		acceptEdit: {
			tooltip: 'Accept layer edit',
			onClick: () => console.log('yayaya'),
			muiIcon: 'check'
		},
		cancelEdit: { tooltip: 'Cancel edit', onClick: () => null, muiIcon: 'do_disturb' },
		isInvisible: {
			tooltip: 'Show',
			onClick: () => {
				mapLayers.toggleVisibility(layer.id);
			},
			muiIcon: 'visibility_off'
		},
		isVisible: {
			tooltip: 'Hide',
			onClick: () => {
				mapLayers.toggleVisibility(layer.id);
			},
			muiIcon: 'visibility'
		},
		remove: {
			onClick: () => {
				map.removeLayer(layer.id);
				map.removeSource(layer.id);
				mapLayers.deleteLayer(layer.id);
			},
			muiIcon: 'delete_outline'
		},
		checked: {
			onClick: () => {
				handleOnToggled();
				checked = false;
			},
			muiIcon: 'check_box'
		},
		notChecked: {
			onClick: () => {
				handleOnToggled();
				checked = true;
			},
			muiIcon: 'check_box_outline_blank'
		}
	};
</script>

<div class="item" class:checked>
	<button class="btn" on:click={handleOnSingleSelect}>
		<img class="icon" src={getIconPath(layer)} alt={layer.type} />
		<p class="description">{layer.displayName}</p>
	</button>
	<Wrapper>
		<span class="visibility-btn"
			><IconButton class="material-icons" on:click={actionDescription[visibility].onClick}>
				{actionDescription[visibility].muiIcon}
			</IconButton></span
		>
	</Wrapper>
	<Wrapper>
		<span class="action-btn"
			><IconButton class="material-icons" on:click={actionDescription[currentAction].onClick}>
				{actionDescription[currentAction].muiIcon}
			</IconButton></span
		>
		{#if actionDescription[currentAction].tooltip}
			<Tooltip>{actionDescription[currentAction].tooltip}</Tooltip>
		{/if}
	</Wrapper>
</div>

<style lang="scss">
	.item {
		display: flex;
		align-items: center;
		cursor: grab;
		border: none;
		background: none;
		width: 100%;
	}

	.btn {
		display: flex;
		align-items: center;
		cursor: grab;
		border: none;
		background: none;
		width: 100%;
		color: $primary-color;
	}

	.icon {
		padding-inline: 12px;
		width: 20px;
		-webkit-user-drag: none;
	}

	.visibility-btn {
		margin-left: auto;

		:global(.material-icons) {
			background: none;
			border: none;
			cursor: pointer;
		}
	}

	.checked {
		@include transparent-background($highlight-color, 0.4);
	}

	.visibility-btn {
		:global(.material-icons) {
			background: none;
			border: none;
			cursor: pointer;
		}
	}
</style>
