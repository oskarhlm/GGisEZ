<script lang="ts">
	import IconButton from '@smui/icon-button';
	import Tooltip, { Wrapper } from '@smui/tooltip';
	import type { GeoJSON, Geometry, Feature, FeatureCollection } from 'geojson';
	import type { MapSource } from '../../../stores/mapSources';
	import _ from 'lodash';
	import { isGeometry, isFeature, isFeatureCollection } from '../../utils/geojson';
	import type mapboxgl from 'mapbox-gl';

	export let item: mapboxgl.AnyLayer;
	export let index: any;

	function getIconPath(layer: mapboxgl.AnyLayer) {
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

	type layerAction = 'remove' | 'acceptEdit' | 'cancelEdit';
	let action: layerAction = 'acceptEdit';
	const actionDescription = new Map<layerAction, string>([
		['remove', 'Remove layer'],
		['acceptEdit', 'Accept layer edit'],
		['cancelEdit', 'Exit edit mode']
	]);
</script>

<div class="item">
	<img class="icon" src={getIconPath(item)} alt={item.type} />
	<p class="description">{item.id}</p>
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
