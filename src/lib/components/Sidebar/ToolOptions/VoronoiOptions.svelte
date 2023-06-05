<script lang="ts">
	import { Label, Icon } from '@smui/button';
	import type { BBox } from '@turf/helpers';
	import bbox from '@turf/bbox';
	import type { mapLayers, MapLayer } from '../../../../stores/mapLayers';
	import type { ToolSelectOptions } from '../Sidebar.svelte';
	import IconButton from '@smui/icon-button';
	import type mapboxgl from 'mapbox-gl';
	import type { VoronoiOptions } from '$lib/components/GeoJsonProcessing/voronoi';
	import { isFeature, isPolygon } from '$lib/utils/geojson';
	import type { DrawCreateEvent } from '@mapbox/mapbox-gl-draw';

	export let updateOptions: (options: ToolSelectOptions, cleanupFn?: () => void) => void;
	export let map: mapboxgl.Map;
	export let draw: MapboxDraw;

	let drawingRectangle = draw.getMode() === 'draw_rectangle';
	let selectedBBox: {
		id: string;
		bbox: BBox;
	};

	function handleToggleRectangleMode() {
		if (draw.getMode() === 'draw_rectangle') {
			draw.changeMode('simple_select');
		} else {
			draw.changeMode('draw_rectangle');
		}

		drawingRectangle = !drawingRectangle;
	}

	map.on('draw.create', (e: DrawCreateEvent) => {
		const feature = e.features[0];
		if (!isFeature(feature) || !isPolygon(feature.geometry)) {
			return;
		}

		selectedBBox = {
			id: feature.id as string,
			bbox: bbox(feature.geometry)
		};
		drawingRectangle = !drawingRectangle;
	});

	$: {
		selectedBBox &&
			updateOptions(
				{
					args: {
						bbox: selectedBBox.bbox
					} satisfies VoronoiOptions
				},
				() => {
					draw.delete(selectedBBox.id);
					console.log(draw.getAll());
				}
			);
	}
</script>

<div style="display: flex; align-items: center;">
	<h4>Draw bounding box</h4>
	<Icon class="material-icons" on>arrow_forward</Icon>
	<span class={drawingRectangle ? 'drawing' : ''}>
		<IconButton class="material-icons" on:click={handleToggleRectangleMode}>mode_edit</IconButton>
	</span>
</div>

<style lang="scss">
	.drawing {
		:global(.material-icons) {
			color: $error;
		}
	}
</style>
