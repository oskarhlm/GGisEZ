<script lang="ts" context="module">
	export type ToolSelectOptions = { args: any; layerSelection?: MapLayer<mapboxgl.Layer>[] };
	// export type ToolSelectCallback = (args: any, layerSelection?: MapLayer<mapboxgl.Layer>[]) => void;
</script>

<script lang="ts">
	import Tooltip, { Wrapper } from '@smui/tooltip';
	import Button, { Label } from '@smui/button';
	import IconButton, { Icon } from '@smui/icon-button';
	import SortableList from '../../SortableList.svelte';
	import ListItem from './ListItem.svelte';
	import { onMount } from 'svelte';
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

	export let map: mapboxgl.Map;
	export let selectedTool: GeoJSONTool | null;

	let fileInput: HTMLInputElement;
	let files: FileList;

	let selectModeEnabled = false;
	let selectedLayers: MapLayer<mapboxgl.Layer>[] = [];

	let options: any;

	function updateOptions(options: ToolSelectOptions) {
		options = options.args;
		if (options.layerSelection !== undefined && options.layerSelection.length !== undefined) {
			selectedLayers = options.layerSelection;
		}
	}

	function sortList(ev: any) {
		const { newList, from, to } = ev.detail;
		const movedLayerId = newList[to];
		mapLayers.set(newList);
		mapLayers.setNewLayerIndex({ layerId: movedLayerId, index: parseInt(to) });
	}

	function handleApplyTransformation() {
		console.log(selectedTool);
		if (!selectedTool?.geoProcessor?.validator(selectedLayers)) {
			return;
		}

		// const result = selectedTool?.geoProcessor?.processor(selectedLayers, options);
		const result = selectedTool?.geoProcessor?.processor(
			selectedLayers,
			options
		) as FeatureCollection<Polygon, GeoJsonProperties>;

		// result.features.forEach((f) => {
		// 	addLayerWithTypeCheck(map, {
		// 		id: selectedTool!.name,
		// 		geojson: {
		// 			type: 'geojson',
		// 			data: f
		// 		}
		// 	});
		// });

		result &&
			addLayerWithTypeCheck(
				map,
				{
					id: selectedTool.name,
					geojson: {
						type: 'geojson',
						data: result
					}
				},
				{
					border: {
						'line-width': 3
					}
				} satisfies LayerOptions<mapboxgl.LineLayer>
			);

		selectedTool = null;
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
			<h3>{selectedTool?.name.toUpperCase()}</h3>
			<svelte:component this={selectedTool.optionsComponent} {updateOptions} />
		{/if}
		<SortableList list={$mapLayers} key={null} on:sort={sortList} let:item>
			<ListItem
				layer={item}
				bind:selectModeEnabled
				bind:selectedTool
				bind:selectedLayers
				{map}
				on:toggled={handleSelectedLayersUpdate}
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
		width: 350px;
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

		/* :global(ul > li) {
			border: none;
		} */

		:global(::-webkit-scrollbar) {
			width: 10px;
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
