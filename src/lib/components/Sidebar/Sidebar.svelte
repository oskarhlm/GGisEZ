<script lang="ts" context="module">
	export type ToolSelectOptions = { args: any; layerSelection?: MapLayer<mapboxgl.Layer>[] };
	// export type ToolSelectCallback = (args: any, layerSelection?: MapLayer<mapboxgl.Layer>[]) => void;
</script>

<script lang="ts">
	import Tooltip, { Content, Wrapper } from '@smui/tooltip';
	import Button, { Label } from '@smui/button';
	import IconButton, { Icon } from '@smui/icon-button';
	import SortableList from '../../SortableList.svelte';
	import ListItem from './ListItem.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import { readFiles } from '../../utils/fileUploader';
	import { mapSources } from '../../../stores/mapSources';
	import { mapLayers } from '../../../stores/mapLayers';
	import _ from 'lodash';
	import type mapboxgl from 'mapbox-gl';
	import type { MapLayer } from '../../../stores/mapLayers';
	import type { GeoJSONSourceRaw } from 'mapbox-gl';
	import type { GeoJSONTool } from '../GeoJsonProcessing/types';
	import { addLayerWithTypeCheck, type LayerOptions } from '../Map/utils';
	import type { FeatureCollection, Polygon, GeoJsonProperties } from 'geojson';
	import type MapboxDraw from '@mapbox/mapbox-gl-draw';

	export let map: mapboxgl.Map;
	export let draw: MapboxDraw;
	export let tools: GeoJSONTool[];
	export let selectedTool: GeoJSONTool | null;

	let fileInput: HTMLInputElement;
	let files: FileList;

	let selectModeEnabled = false;
	let selectedLayers: MapLayer<mapboxgl.Layer>[] = [];

	let options: any;
	let optionsCleanup: (() => void) | undefined;

	function updateOptions(opts: ToolSelectOptions, cleanup?: () => void) {
		console.log(opts);
		options = opts.args;
		optionsCleanup = cleanup;
		if (opts.layerSelection !== undefined && opts.layerSelection.length !== undefined) {
			selectedLayers = opts.layerSelection;
		}
	}

	function sortList(ev: any) {
		const { newList, from, to } = ev.detail;
		const movedLayerId = newList[to];
		mapLayers.set(newList);
		mapLayers.setNewLayerIndex({ layerId: movedLayerId, index: parseInt(to) });
	}

	function handleApplyTransformation() {
		if (!selectedTool?.geoProcessor?.validator(selectedLayers)) {
			return;
		}

		const result = selectedTool?.geoProcessor?.processor(selectedLayers, options);
		console.log(result);

		result &&
			addLayerWithTypeCheck(map, {
				id: selectedTool.name,
				geojson: {
					type: 'geojson',
					data: result
				}
			});

		selectedTool = null;
		selectedLayers = [];
		optionsCleanup && optionsCleanup();
	}

	function handleSelectedLayersUpdate(e: CustomEvent<MapLayer<mapboxgl.Layer>>) {
		const layer = e.detail;
		const layerIsInArray = selectedLayers.find((l) => l.id === layer.id) !== undefined;
		if (layerIsInArray) {
			selectedLayers = selectedLayers.filter((l) => l.id !== layer.id);
			return;
		}

		selectedLayers = [...selectedLayers, layer];
	}

	const dispatch = createEventDispatcher<{
		singleLayerSelect: { layer: MapLayer<mapboxgl.Layer> };
	}>();
	function handleSingleLayerSelect(e: CustomEvent<MapLayer<mapboxgl.Layer>>) {
		const layer = e.detail;
		if (selectedLayers.length === 1 && selectedLayers[0] === layer) {
			selectedLayers = [];
		} else {
			selectedLayers = [layer];
		}

		dispatch('singleLayerSelect', { layer });
	}

	async function handleFileChange(event: Event) {
		const inputElement = event.target as HTMLInputElement;
		if (inputElement.files && inputElement.files.length > 0) {
			files = inputElement.files;
			const geojsonSources = await readFiles(files);
			mapSources.add(geojsonSources);
			inputElement.value = '';
		}
	}

	onMount(() => {
		fileInput.addEventListener('change', handleFileChange);
	});
</script>

<div class="container pulsating-border">
	<div class="content">
		<span class="layer-title"
			><h2 style="margin: 0;">Layers</h2>
			<Icon class="material-icons">layers</Icon></span
		>
		<hr />
		{#if selectedTool}
			<span style="display: flex; align-items: center; justify-content: space-between; ">
				<h3>{selectedTool?.name.toUpperCase()}</h3>
				<Wrapper rich>
					<span
						style="display: flex; align-items: center; text-justify: center; padding-right: 12px;"
					>
						<Icon class="material-icons">info</Icon>
					</span>
					<Tooltip><Content>{selectedTool.tooltip}</Content></Tooltip>
				</Wrapper>
			</span>
			<svelte:component
				this={selectedTool.optionsComponent?.component}
				{...selectedTool.optionsComponent?.props}
				{updateOptions}
			/>
		{/if}
		<SortableList list={$mapLayers} key={null} on:sort={sortList} let:item>
			<ListItem
				layer={item}
				bind:selectModeEnabled
				bind:selectedTool
				bind:selectedLayers
				{map}
				on:toggled={handleSelectedLayersUpdate}
				on:singleSelect={handleSingleLayerSelect}
			/>
		</SortableList>
		<hr style="margin-top: auto" />
		<span class="file-action-row">
			<Wrapper>
				<IconButton class="material-icons" on:click={() => fileInput.click()}
					>upload_file</IconButton
				>
				<Tooltip>Upload layers</Tooltip>
			</Wrapper>
			<input bind:this={fileInput} id="file-upload" multiple type="file" style="display: none;" />
			<Wrapper>
				<IconButton class="material-icons">download</IconButton>
				<Tooltip>Download layer(s)</Tooltip>
			</Wrapper>
			<span style="margin-left: auto;">
				{#if selectedTool}
					<Button variant="unelevated" on:click={handleApplyTransformation}>
						<Label>Apply</Label>
					</Button>
					<Button variant="outlined" on:click={() => (selectedTool = null)}>
						<Label>Cancel</Label>
					</Button>
				{:else}
					<Wrapper>
						<IconButton
							class="material-icons"
							on:click={() => {
								selectModeEnabled = !selectModeEnabled;
							}}>{selectModeEnabled ? 'check' : 'rule'}</IconButton
						>
						<Tooltip>Select layers</Tooltip>
					</Wrapper>
				{/if}
			</span>
		</span>
	</div>
</div>

<style lang="scss">
	.file-action-row {
		display: flex;
		align-items: center;
		justify-content: center;

		:global(.material-icons) {
			background: none;
			border: none;
			cursor: pointer;
		}
	}

	.container {
		/* width: 350px; */
		width: 250px;
		height: 100%;
		@include transparent-background($secondary-color, 0.9);
		pointer-events: all;
		box-sizing: border-box;
	}

	.pulsating-border {
		border: 3px solid $secondary-color;
		animation: border-pulsate 1.5s infinite;
	}

	.layer-title {
		display: flex;
		gap: 5px;
		align-items: center;

		:global(.material-icons) {
			background: none;
			border: none;
		}
	}

	hr {
		border-style: solid;
		border-width: 1px;
		color: $background-gray-brighter;
		width: 100%;
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
