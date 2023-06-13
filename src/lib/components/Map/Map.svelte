<script lang="ts">
	import mapboxgl, { Map } from 'mapbox-gl';
	import type { AnySourceData, GeoJSONSourceRaw } from 'mapbox-gl';
	import type { GeometryCollection, Feature, FeatureCollection } from 'geojson';
	import 'mapbox-gl/dist/mapbox-gl.css';
	import MapboxDraw from '@mapbox/mapbox-gl-draw';
	import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
	import { onMount } from 'svelte';
	import { mapSources } from '../../../stores/mapSources';
	import { addLayerWithTypeCheck, isValid } from './utils';
	import { mapLayers, type MapLayer } from '../../../stores/mapLayers';
	import Sidebar from '../Sidebar/Sidebar.svelte';
	import ToolsDropdown from '../AnalysisTools/ToolsDropdown.svelte';
	import type { GeoJSON } from 'geojson';
	import type { GeoJSONTool } from '../GeoJsonProcessing/types';
	// @ts-ignore
	import DrawRecangle from 'mapbox-gl-draw-rectangle-mode';
	import {
		BboxProcessor,
		BufferProcessor,
		DifferenceProcessor,
		IntersectProcessor,
		UnionProcessor,
		VoronoiProcessor,
		BboxClipProcessor,
		DissolveProcessor
	} from '../GeoJsonProcessing';
	import BufferOptions from '../Sidebar/ToolOptions/BufferOptions.svelte';
	import DifferenceOptions from '../Sidebar/ToolOptions/DifferenceOptions.svelte';
	import VoronoiOptions from '../Sidebar/ToolOptions/VoronoiOptions.svelte';
	import BboxClipOptions from '../Sidebar/ToolOptions/BboxClipOptions.svelte';
	import LayerInfo from '../LayerInfo/LayerInfo.svelte';
	import type { LayerStyleProperties } from '../LayerInfo/Styling.svelte';

	let map: mapboxgl.Map;
	let draw: MapboxDraw;
	let tools: GeoJSONTool[];
	let selectedTool: GeoJSONTool | null = null;
	let infoLayer: MapLayer<mapboxgl.Layer> | null;

	function handleSingleLayerSelect(e: any) {
		infoLayer = e.detail.layer;
	}

	onMount(() => {
		mapboxgl.accessToken =
			'pk.eyJ1Ijoia29ob2xtIiwiYSI6ImNremUzM2tsMzJmZWsybm54d20xazFicWQifQ.uZRVptXit_O5hkkSFBKXug';
		map = new mapboxgl.Map({
			container: 'map',
			style: 'mapbox://styles/mapbox/streets-v11',
			center: [10.345053, 63.430515],
			zoom: 11
		});

		draw = new MapboxDraw({
			modes: {
				...MapboxDraw.modes,
				draw_rectangle: DrawRecangle
			},
			displayControlsDefault: false,
			defaultMode: 'simple_select'
		});

		tools = [
			{
				name: 'bbox',
				iconPath: 'button-icons/bbox.png',
				geoProcessor: BboxProcessor,
				tooltip:
					'Takes a set of features, calculates the bbox of all input features, and returns a bounding box.'
			},
			{
				name: 'buffer',
				iconPath: 'button-icons/buffer.png',
				geoProcessor: BufferProcessor,
				tooltip:
					'Calculates a buffer for input features for a given radius. For FeatureCollections, individual buffers are calculated for each feature, but you can use dissolve to combine them.',
				optionsComponent: {
					component: BufferOptions,
					props: {}
				}
			},
			{
				name: 'clip',
				iconPath: 'button-icons/clip.png',
				geoProcessor: BboxClipProcessor,
				tooltip:
					'Clips a selected feature to the bbox (bounding box) using lineclip. Select two positions in the map to create the bbox.',
				optionsComponent: {
					component: BboxClipOptions,
					props: { map: map, draw: draw }
				}
			},
			{
				name: 'difference',
				iconPath: 'button-icons/difference.png',
				geoProcessor: DifferenceProcessor,
				tooltip:
					'Finds the difference between two polygons by clipping the second polygon from the first.',
				optionsComponent: {
					component: DifferenceOptions,
					props: {}
				}
			},
			{
				name: 'intersect',
				iconPath: 'button-icons/intersection.png',
				geoProcessor: IntersectProcessor,
				tooltip:
					'Takes two polygon or multi-polygon geometries and finds their polygonal intersection, if there is one.'
			},
			{
				name: 'union',
				iconPath: 'button-icons/union.png',
				geoProcessor: UnionProcessor,
				tooltip:
					'Takes two (Multi)Polygon(s) and returns a combined polygon. If the input polygons are not contiguous, this function returns a MultiPolygon feature.'
			},
			{
				name: 'voronoi',
				iconPath: 'button-icons/voronoi.png',
				geoProcessor: VoronoiProcessor,
				tooltip:
					'Takes a FeatureCollection of points, and an optional bounding box, and returns a FeatureCollection of Voronoi polygons.',
				optionsComponent: {
					component: VoronoiOptions,
					props: { map: map, draw: draw }
				}
			},
			{
				name: 'dissolve',
				iconPath: 'button-icons/dissolve.png',
				geoProcessor: DissolveProcessor,
				tooltip:
					'Dissolves a FeatureCollection of polygon features, filtered by an optional property name. Like a union reduction on a single FeatureCollection.'
			}
		];

		map.addControl(draw, 'top-left');

		map.on('load', function () {
			mapLayers.subscribeNewLayerIndex((newLayerIndex) => {
				if (!newLayerIndex) return;

				const { index } = newLayerIndex;
				const movedLayer = $mapLayers[index];
				const layerAbove = $mapLayers[index - 1];

				layerAbove ? map.moveLayer(movedLayer.id, layerAbove.id) : map.moveLayer(movedLayer.id);
			});
		});
		mapLayers.subscribe((layers) => {
			layers.forEach((layer) => {
				if (!map.getLayer(layer.id)) return;
				map.setLayoutProperty(layer.id, 'visibility', layer.isVisible ? 'visible' : 'none');
			});
		});
	});

	mapSources.subscribe((sources) => {
		sources.forEach((source) => {
			if (map.getSource(source.id)) return;
			const data = source.geojson.data;
			if (!isValid(data)) return;
			const sourceData: GeoJSONSourceRaw = {
				type: 'geojson',
				data: data
			};
			map.addSource(source.id, sourceData);
			addLayerWithTypeCheck(map, source);
		});
	});

	function handlePropertiesSet(e: CustomEvent<LayerStyleProperties>) {
		const { layer, newName, color, opacity } = e.detail;
		mapLayers.update((storeLayers) => {
			const layerToUpdate = storeLayers.find((l) => l.id === layer.id);
			if (layerToUpdate) {
				layerToUpdate.displayName = newName;
				(layerToUpdate.paint as any)[`${layer.type}-color`] = color as any;
				(layerToUpdate.paint as any)[`${layer.type}-opacity`] = opacity;
			}
			return storeLayers;
		});

		map.setPaintProperty(layer.id, `${layer.type}-color`, color);
		map.setPaintProperty(layer.id, `${layer.type}-opacity`, opacity);
	}
</script>

<div id="map" />
<div id="overlay">
	<Sidebar {map} {draw} {tools} bind:selectedTool on:singleLayerSelect={handleSingleLayerSelect} />
	<ToolsDropdown {tools} bind:selectedTool on:toolSelected={(e) => (selectedTool = e.detail)} />
	{#if infoLayer}
		<span style="margin-left: auto;">
			<LayerInfo
				bind:layer={infoLayer}
				on:propertiesSet={handlePropertiesSet}
				on:closeProperties={() => {
					infoLayer = null;
				}}
			/>
		</span>
	{/if}
</div>

<style lang="scss">
	#map {
		width: 100vw;
		height: 100vh;
	}

	#overlay {
		position: absolute;
		top: 0;
		left: 0;
		inset: 20px;
		pointer-events: none;
		display: flex;
	}
</style>
