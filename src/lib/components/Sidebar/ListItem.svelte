<script lang="ts">
	import IconButton from '@smui/icon-button';
	import Tooltip, { Wrapper } from '@smui/tooltip';
	import type { GeoJSON, Geometry, Feature, FeatureCollection } from 'geojson';
	import type { MapSource } from '../../../stores/mapSources';
	import _ from 'lodash';
	import { isGeometry, isFeature, isFeatureCollection } from '../../utils/geojson';
	import type mapboxgl from 'mapbox-gl';
	import { mapLayers } from '../../../stores/mapLayers';

	export let layer: mapboxgl.Layer;
	export let index: any;

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

	type LayerActionType = 'remove' | 'acceptEdit' | 'cancelEdit' | 'isVisible' | 'isInvisible';
	type Action = { tooltip: string; callback: () => void; muiIcon: string };
	let currentAction: LayerActionType = 'isVisible';

	const actionDescription: { [key in LayerActionType]: Action } = {
		acceptEdit: {
			tooltip: 'Accept layer edit',
			callback: () => console.log('yayaya'),
			muiIcon: 'check'
		},
		cancelEdit: { tooltip: 'Cancel edit', callback: () => null, muiIcon: 'do_disturb' },
		isInvisible: {
			tooltip: 'Show',
			callback: () => {
				mapLayers.toggleVisibility(layer.id);
				currentAction = 'isVisible';
			},
			muiIcon: 'visibility_off'
		},
		isVisible: {
			tooltip: 'Hide',
			callback: () => {
				mapLayers.toggleVisibility(layer.id);
				currentAction = 'isInvisible';
			},

			muiIcon: 'visibility'
		},
		remove: { tooltip: 'Accept layer edit', callback: () => null, muiIcon: 'remove' }
	};
</script>

<div class="item">
	<img class="icon" src={getIconPath(layer)} alt={layer.type} />
	<p class="description">{layer.id}</p>
	<Wrapper>
		<span class="remove-btn"
			><IconButton class="material-icons" on:click={actionDescription[currentAction].callback}>
				{actionDescription[currentAction].muiIcon}
			</IconButton></span
		>
		<Tooltip>{actionDescription[currentAction].tooltip}</Tooltip>
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
