<script lang="ts">
	import mapboxgl from 'mapbox-gl';
	import type { GeometryCollection } from 'geojson';
	import 'mapbox-gl/dist/mapbox-gl.css';
	import MapboxDraw from '@mapbox/mapbox-gl-draw';
	import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
	import { onMount, createEventDispatcher } from 'svelte';
	import { mapSources } from '../../../stores/mapSources';
	import { addLayerWithTypeCheck } from './utils';

	let map: mapboxgl.Map;

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

		map.on('load', () => {
			map.addSource('geomColl', {
				type: 'geojson',
				data: geometryCollection
			});

			// 	map.addLayer({
			// 		id: 'layer',
			// 		type: 'fill',
			// 		source: 'geomColl',
			// 		layout: {},
			// 		paint: {
			// 			'fill-color': '#088',
			// 			'fill-opacity': 0.8
			// 		}
			// 	});
			// 	map.addLayer({
			// 		id: 'layer2',
			// 		type: 'circle',
			// 		source: 'geomColl',
			// 		layout: {},
			// 		paint: {
			// 			'circle-radius': 10,
			// 			'circle-color': '#088',
			// 			'circle-opacity': 0.8
			// 		},
			// 		filter: ['==', '$type', 'Point']
			// 	});
			addLayerWithTypeCheck(map, { name: 'geomColl', data: geometryCollection });
		});

		const Draw = new MapboxDraw({
			displayControlsDefault: false,
			controls: {
				point: true,
				line_string: true,
				polygon: true,
				trash: true
			},
			// Set mapbox-gl-draw to draw by default.
			// The user does not have to click the polygon control button first.
			defaultMode: 'draw_polygon'
		});
		// map.addControl(Draw, 'top-left');
	});

	mapSources.subscribe((sources) => {
		sources.forEach((source, index) => {
			if (map.getSource(source.name)) return;
			map.addSource(source.name, {
				type: 'geojson',
				data: source.data
			});
			addLayerWithTypeCheck(map, source);
		});
	});

	const dispatch = createEventDispatcher();
	function handleMapUpdate() {
		dispatch('variableUpdated', map);
	}
</script>

<div id="map" />

<style>
	#map {
		width: 100vw;
		height: 100vh;
	}
</style>
