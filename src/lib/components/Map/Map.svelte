<script lang="ts">
	import mapboxgl from 'mapbox-gl';
	import 'mapbox-gl/dist/mapbox-gl.css';
	import MapboxDraw from '@mapbox/mapbox-gl-draw';
	import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
	import { onMount, createEventDispatcher } from 'svelte';
	import { mapSources } from '../../../stores/mapSources';

	let map: mapboxgl.Map;
	let draw: MapboxDraw;
	// const layers =

	const defaultColors: string[] = [
		'#FF5733',
		'#F2BE22',
		'#17BEBB',
		'#7B68EE',
		'#FF8C00',
		'#00BFFF',
		'#9932CC',
		'#2E8B57',
		'#FF1493',
		'#8B4513'
	];

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
			map.addLayer({
				id: source.name,
				type: 'fill',
				source: source.name,
				paint: {
					'fill-color': defaultColors[index % defaultColors.length]
				}
			});
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
