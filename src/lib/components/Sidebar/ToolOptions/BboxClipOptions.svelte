<script lang="ts">
	import Button, { Label, Icon } from '@smui/button';
	import type { BBox } from '@turf/helpers';
	import bbox from '@turf/bbox';
	import type { mapLayers, MapLayer } from '../../../../stores/mapLayers';
	import type { ToolSelectOptions } from '../Sidebar.svelte';
	import IconButton from '@smui/icon-button';
	import type mapboxgl from 'mapbox-gl';
	import type { VoronoiOptions } from '$lib/components/GeoJsonProcessing/voronoi';
	import { isFeature, isPolygon } from '$lib/utils/geojson';
	import type { DrawCreateEvent } from '@mapbox/mapbox-gl-draw';
	import { onMount, onDestroy } from 'svelte';
	import type { BBoxClipOptions } from '$lib/components/GeoJsonProcessing/bboxClip';

	export let updateOptions: (options: ToolSelectOptions, cleanupFn?: () => void) => void;
	export let map: mapboxgl.Map;
	export let draw: MapboxDraw;

	let drawEnabled = true;

	$: {
		if (drawEnabled) draw.changeMode('draw_rectangle');
		else draw.changeMode('simple_select');
	}

	let selectedBBox: {
		id: string;
		bbox: BBox;
	};

	map.on('draw.create', (e: DrawCreateEvent) => {
		const feature = e.features[0];
		if (!isFeature(feature) || !isPolygon(feature.geometry)) {
			return;
		}

		if (selectedBBox) draw.delete(selectedBBox.id);
		selectedBBox = {
			id: feature.id as string,
			bbox: bbox(feature.geometry)
		};

		drawEnabled = false;
	});

	$: {
		selectedBBox &&
			updateOptions(
				{
					args: {
						bbox: selectedBBox.bbox
					} satisfies BBoxClipOptions
				},
				() => {
					draw.delete(selectedBBox.id);
				}
			);
	}
</script>

<span class="draw-btn">
	<Button
		bind:disabled={drawEnabled}
		variant="unelevated"
		on:click={() => {
			drawEnabled = true;
		}}><Label>Draw new BBox</Label></Button
	>
</span>

<style lang="scss">
	.draw-btn {
		display: flex;
		justify-content: center;
		margin-block: 10px;
	}
</style>
