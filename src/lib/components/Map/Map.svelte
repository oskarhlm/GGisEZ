<script lang="ts" context="module">
	export const tools: GeoJSONTool[] = [
		{ name: 'bbox', iconPath: 'button-icons/bbox.png', geoProcessor: BboxProcessor },
		{
			name: 'buffer',
			iconPath: 'button-icons/buffer.png',
			geoProcessor: BufferProcessor,
			optionsComponent: BufferOptions
		},
		{ name: 'clip', iconPath: 'button-icons/clip.png' },
		{
			name: 'difference',
			iconPath: 'button-icons/difference.png',
			geoProcessor: DifferenceProcessor,
			optionsComponent: DifferenceOptions
		},
		{
			name: 'intersect',
			iconPath: 'button-icons/intersection.png',
			geoProcessor: IntersectProcessor
		},
		{ name: 'union', iconPath: 'button-icons/union.png', geoProcessor: UnionProcessor },
		{ name: 'voronoi', iconPath: 'button-icons/vornoi.png' }
	];
</script>

<script lang="ts">
	import mapboxgl from 'mapbox-gl';
	import type { AnySourceData, GeoJSONSourceRaw } from 'mapbox-gl';
	import type { GeometryCollection, Feature } from 'geojson';
	import 'mapbox-gl/dist/mapbox-gl.css';
	import MapboxDraw from '@mapbox/mapbox-gl-draw';
	import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
	import { onMount } from 'svelte';
	import { mapSources } from '../../../stores/mapSources';
	import { addLayerWithTypeCheck, isValid } from './utils';
	import { mapLayers } from '../../../stores/mapLayers';
	import Sidebar from '../Sidebar/Sidebar.svelte';
	import ToolsDropdown from '../AnalysisTools/ToolsDropdown.svelte';
	import type { GeoJSON } from 'geojson';
	import type { GeoJSONTool } from '../GeoJsonProcessing/types';
	import {
		BboxProcessor,
		BufferProcessor,
		DifferenceProcessor,
		IntersectProcessor,
		UnionProcessor
	} from '../GeoJsonProcessing';
	import BufferOptions from '../Sidebar/ToolOptions/BufferOptions.svelte';
	import DifferenceOptions from '../Sidebar/ToolOptions/DifferenceOptions.svelte';

	let map: mapboxgl.Map;
	let selectedTool: GeoJSONTool | null;

	const pointFeature: Feature = {
		type: 'Feature',
		properties: {
			capacity: '10',
			type: 'U-Rack',
			mount: 'Surface'
		},
		geometry: {
			type: 'Point',
			coordinates: [-71.073283, 42.4175]
		}
	};

	const geometryCollection: GeometryCollection = {
		type: 'GeometryCollection',
		geometries: [
			{
				type: 'MultiPolygon',
				coordinates: [
					[
						[
							[-73, 45],
							[-76, 46],
							[-75, 47],
							[-73, 45]
						]
					],
					[
						[
							[-70, 42],
							[-73, 43],
							[-72, 44],
							[-70, 42]
						]
					]
				]
			},
			{
				type: 'MultiPoint',
				coordinates: [
					[-72, 44],
					[-75, 45],
					[-74, 46]
				]
			}
		]
	};

	onMount(() => {
		mapboxgl.accessToken =
			'pk.eyJ1Ijoia29ob2xtIiwiYSI6ImNremUzM2tsMzJmZWsybm54d20xazFicWQifQ.uZRVptXit_O5hkkSFBKXug';
		map = new mapboxgl.Map({
			container: 'map',
			style: 'mapbox://styles/mapbox/streets-v11',
			center: [10.345053, 63.430515],
			zoom: 11
		});

		const Draw = new MapboxDraw({
			displayControlsDefault: false,
			controls: {
				point: true,
				line_string: true,
				polygon: true,
				trash: true
			},
			defaultMode: 'draw_polygon'
		});
		// map.addControl(Draw, 'top-left');

		map.on('load', function () {
			mapLayers.subscribeNewLayerIndex((newLayerIndex) => {
				if (!newLayerIndex) return;

				const { index } = newLayerIndex;
				const movedLayer = $mapLayers[index];
				const layerAbove = $mapLayers[index - 1];

				layerAbove ? map.moveLayer(movedLayer.id, layerAbove.id) : map.moveLayer(movedLayer.id);
			});
			const sourceData: GeoJSONSourceRaw = {
				type: 'geojson',
				data: geometryCollection
			};
			// map.addSource('source', sourceData);
			addLayerWithTypeCheck(map, {
				id: 'source',
				geojson: sourceData
			});
			map.addSource('point-source', {
				type: 'geojson',
				data: pointFeature
			});
			addLayerWithTypeCheck(map, {
				id: 'point-source',
				geojson: {
					type: 'geojson',
					data: pointFeature
				}
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
</script>

<div id="map" />
<div id="overlay">
	<Sidebar {map} bind:selectedTool />
	<ToolsDropdown bind:selectedTool on:toolSelected={(e) => (selectedTool = e.detail)} />
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
