<script lang="ts" context="module">
	type RgbValue = { r: number; g: number; b: number; a?: number };

	export function rgba2hex(rgba: RgbValue) {
		let hex =
			(rgba.r | (1 << 8)).toString(16).slice(1) +
			(rgba.g | (1 << 8)).toString(16).slice(1) +
			(rgba.b | (1 << 8)).toString(16).slice(1);

		return {
			color: '#' + hex,
			opacity: rgba.a
		};
	}

	export type LayerStyleProperties = {
		layer: MapLayer<mapboxgl.Layer>;
		newName: string;
		color: string;
		opacity?: number;
	};

	function floatToHex(value: number) {
		var intValue = Math.round(value * 255);
		var hexValue = intValue.toString(16).padStart(2, '0');
		return hexValue;
	}
</script>

<script lang="ts">
	import iro from '@jaames/iro';
	import { createEventDispatcher, onMount } from 'svelte';
	import Button from '@smui/button';
	import Textfield from '@smui/textfield';
	import type { MapLayer } from '../../../stores/mapLayers';
	import type mapboxgl from 'mapbox-gl';

	export let layer: MapLayer<mapboxgl.Layer>;
	$: layerName = layer.displayName;
	$: displayName = layerName;

	$: {
		if (colorWheel) {
			console.log(layer.paint);
			const hexColor = (layer.paint as any)[`${layer.type}-color`] as string;
			const opacity = (layer.paint as any)[`${layer.type}-opacity`];
			const hexOpacity = floatToHex(opacity || 1);
			colorWheel.color.set(hexColor + hexOpacity);
		}
	}

	let colorWheel: iro.ColorPicker;

	const dispatch = createEventDispatcher<{
		propertiesSet: LayerStyleProperties;
		closeProperties: null;
	}>();

	function onApply() {
		dispatch('propertiesSet', {
			layer,
			newName: displayName,
			...rgba2hex(colorWheel.color.rgba)
		});
	}

	onMount(() => {
		colorWheel = iro.ColorPicker('#colorWheel', {
			width: 250,
			color: '#fff',
			layoutDirection: 'vertical',
			padding: 4,
			handleRadius: 8,
			wheelLightness: true,
			wheelDirection: 'anticlockwise',
			sliderSize: undefined,
			sliderMargin: 12,
			layout: [
				{
					component: iro.ui.Wheel,
					options: {
						wheelLightness: true,
						wheelAngle: 0,
						wheelDirection: 'anticlockwise'
					}
				},
				{
					component: iro.ui.Slider,
					options: {
						sliderType: 'value'
					}
				},
				{
					component: iro.ui.Slider,
					options: {
						sliderType: 'alpha', // can also be 'saturation', 'value', 'alpha' or 'kelvin',
						activeIndex: 2
					}
				}
			]
		});
	});
</script>

<span style="height: 10px;" />
<Textfield bind:value={displayName} label="Layer name" />
<div class="wheel" id="colorWheel" />
<span class="btn-row">
	<span id="apply-btn"><Button on:click={onApply} variant="unelevated">Apply</Button></span>
	<Button on:click={() => dispatch('closeProperties')} variant="outlined">Cancel</Button>
</span>

<style lang="scss">
	.wheel {
		margin-top: 20px;
		margin-inline: auto;
	}

	#apply-btn {
		/* margin-top: auto; */
		margin-left: auto;
	}

	.btn-row {
		margin-top: 24px;
		display: flex;
		align-items: center;
		gap: 4px;
	}
</style>
