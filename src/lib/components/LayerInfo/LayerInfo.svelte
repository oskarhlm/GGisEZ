<script lang="ts">
	import Tab, { Label } from '@smui/tab';
	import TabBar from '@smui/tab-bar';
	import Properties from './Properties.svelte';
	import Info from './Info.svelte';
	import type { MapLayer } from '../../../stores/mapLayers';
	import type mapboxgl from 'mapbox-gl';

	export let layer: MapLayer<mapboxgl.Layer>;

	type Tab = { tabName: string; component: any };
	const tabs: Tab[] = [
		{ tabName: 'Properties', component: Properties },
		{ tabName: 'Info', component: Info }
	];
	let active: Tab = tabs[0];
</script>

<div class="container">
	<div class="content">
		<TabBar {tabs} let:tab bind:active>
			<Tab {tab}>
				<Label>{tab.tabName}</Label>
			</Tab>
		</TabBar>
		{#if layer}
			<svelte:component this={active.component} bind:layer on:propertiesSet />
		{/if}
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
