<script lang="ts">
	import Tab, { Label } from '@smui/tab';
	import TabBar from '@smui/tab-bar';
	import Styling from './Styling.svelte';
	import Info from './Info.svelte';
	import { mapLayers, type MapLayer } from '../../../stores/mapLayers';
	import type mapboxgl from 'mapbox-gl';
	import Button from '@smui/button';
	import { get } from 'svelte/store';

	// export let layer: MapLayer<mapboxgl.Layer>;
	export let layer: any;
	export let map: mapboxgl.Map;

	type Tab = { tabName: string; component: any };
	const tabs: Tab[] = [
		{ tabName: 'Styling', component: Styling },
		{ tabName: 'Info', component: Info }
	];
	let active: Tab = tabs[0];
</script>

<!-- 
	@component
	Contanier for layer specific tabs (styling and info). 
 -->

<div class="container">
	<div class="content">
		<TabBar {tabs} let:tab bind:active>
			<Tab {tab}>
				<Label>{tab.tabName}</Label>
			</Tab>
		</TabBar>
		{#if layer}
			<svelte:component
				this={active.component}
				bind:layer
				{map}
				on:propertiesSet
				on:closeProperties
			/>
		{/if}
		<!-- <Button
			on:click={() => {
				let source = layer.source;
				console.log(layer.epsg, source);
				const layers = get(mapLayers);
				console.log(layers);
				layer.source = layers[0].source;

				console.log(layer.source, map.getSource(layer.id));
				map.removeLayer(layer.id);
				map.removeSource(layer.id);
				console.log(layer.source);
				map.addLayer(layer);
			}}>Transform</Button
		> -->
	</div>
</div>

<style lang="scss">
	.container {
		width: 350px;
		/* width: 250px; */
		/* height: 100%; */
		height: auto;
		@include transparent-background($secondary-color, 0.9);
		pointer-events: all;
		box-sizing: border-box;
	}

	.content {
		padding: 20px;
		height: calc(100% - 40px);
		display: flex;
		flex-direction: column;

		:global(::-webkit-scrollbar) {
			width: 0px;
		}

		:global(ul) {
			margin-block: 0;
			overflow-y: scroll;

			:global(li) {
				border: none;
			}
		}
	}
</style>
