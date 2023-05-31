<script lang="ts">
	import mapboxgl from 'mapbox-gl';
	import type { GeometryCollection, Feature } from 'geojson';
	import 'mapbox-gl/dist/mapbox-gl.css';
	import MapboxDraw from '@mapbox/mapbox-gl-draw';
	import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
	import { onMount, createEventDispatcher } from 'svelte';
	import { mapSources } from '../../../stores/mapSources';
	import { addLayerWithTypeCheck } from './utils';
	import { mapLayers } from '../../../stores/mapLayers';

	let map: mapboxgl.Map;

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
			center: [10.395053, 63.430515],
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
			// map.addSource('source', {
			// 	type: 'geojson',
			// 	data: geometryCollection
			// });
			// addLayerWithTypeCheck(map, { name: 'source', data: geometryCollection });
			// map.addSource('point-source', {
			// 	type: 'geojson',
			// 	data: pointFeature
			// });
			// addLayerWithTypeCheck(map, { name: 'point-source', data: pointFeature });
		});
	});

	mapSources.subscribe((sources) => {
		sources.forEach((source) => {
			if (map.getSource(source.name)) return;
			map.addSource(source.name, {
				type: 'geojson',
				data: source.data
			});
			addLayerWithTypeCheck(map, source);
		});
	});
</script>

<div id="map" />

<style>
	#map {
		width: 100vw;
		height: 100vh;
	}
</style>
