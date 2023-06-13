<script lang="ts" context="module">
	export type ToolSelectOptions = { args: any; layerSelection?: MapLayer<mapboxgl.Layer>[] };
</script>

<script lang="ts">
	import Tooltip, { Content, Wrapper } from '@smui/tooltip';
	import Button, { Label } from '@smui/button';
	import IconButton, { Icon } from '@smui/icon-button';
	import SortableList from '../../SortableList.svelte';
	import ListItem from './ListItem.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import { getProj4String, readFiles } from '../../utils/fileUploader';
	import { mapSources } from '../../../stores/mapSources';
	import { mapLayers } from '../../../stores/mapLayers';
	import _ from 'lodash';
	import type mapboxgl from 'mapbox-gl';
	import type { MapLayer } from '../../../stores/mapLayers';
	import type { GeoJSONSourceRaw } from 'mapbox-gl';
	import type { GeoJSONTool } from '../GeoJsonProcessing/types';
	import { addLayerWithTypeCheck, isValid, type LayerOptions } from '../Map/utils';
	import type {
		FeatureCollection,
		GeoJsonProperties,
		Geometry,
		Feature,
		GeometryCollection
	} from 'geojson';
	import type MapboxDraw from '@mapbox/mapbox-gl-draw';
	import { get } from 'svelte/store';
	import EpsgDialog from './EpsgDialog.svelte';
	import {
		convertGeometry,
		isFeature,
		isFeatureCollection,
		isGeometry,
		isGeometryCollection
	} from '$lib/utils/geojson';
	import proj4 from 'proj4';

	export let map: mapboxgl.Map;
	export let draw: MapboxDraw;
	export let tools: GeoJSONTool[];

	export let selectedTool: GeoJSONTool | null;
	$: applyIsDisabled = !selectedTool?.geoProcessor?.validator(selectedLayers, options);

	let fileInput: HTMLInputElement;
	let files: FileList;

	let selectModeEnabled = false;
	let selectedLayers: MapLayer<mapboxgl.Layer>[] = [];

	let options: any;
	let optionsCleanup: (() => void) | undefined;

	let epsgDialoagOpen = false;
	let epsgProblem = false;

	/**
	 * A function that is passed as a callback to all <Tool>Options.svelte components,
	 * so that they can update the options variable defined in the Sidebar.svelte file.
	 */
	function updateOptions(opts: ToolSelectOptions, cleanup?: () => void) {
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

	/**
	 * Applies the transformation specified by the currently selected tool to the selected layers.
	 */
	function handleApplyTransformation() {
		let result = selectedTool?.geoProcessor?.processor(selectedLayers, options);

		if (result && !Array.isArray(result)) {
			result = [result];
		}

		result?.forEach((r) =>
			addLayerWithTypeCheck(map, {
				id: selectedTool!.name,
				geojson: {
					type: 'geojson',
					data: r
				}
			})
		);

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
		singleLayerSelect: { layer: MapLayer<mapboxgl.Layer> | null };
	}>();

	function handleSingleLayerSelect(e: CustomEvent<MapLayer<mapboxgl.Layer>>) {
		const layer = e.detail;
		if (selectedLayers.length === 1 && selectedLayers[0] === layer) {
			selectedLayers = [];
			dispatch('singleLayerSelect', { layer: null });
		} else {
			selectedLayers = [layer];
			dispatch('singleLayerSelect', { layer });
		}
	}

	/**
	 * Adds a new source to the map whenever a new file is uploaded
	 */
	async function handleFileChange(event: Event) {
		const inputElement = event.target as HTMLInputElement;
		if (inputElement.files && inputElement.files.length > 0) {
			files = inputElement.files;
			const geojsonSources = await readFiles(files);
			mapSources.add(geojsonSources);
			inputElement.value = '';
		}
	}

	/**
	 * Downloads all files that are currently selected in the layer list,
	 * and converts them to a specified map projection using the ESPG number specified
	 * by the user.
	 */
	async function dowloadFiles(e: CustomEvent<{ epsg: string }>) {
		selectedLayers.forEach(async (l) => {
			const jsonData = (l.source as GeoJSONSourceRaw).data;
			if (!isValid(jsonData)) return;

			let outdata: any = jsonData;

			// Convert to other projection if different from Mapbox projection
			if (e.detail.epsg !== '4326') {
				const sourceProjection = await getProj4String('4326');
				const targetProjection = await getProj4String(e.detail.epsg);

				if (!targetProjection) {
					epsgProblem = true;
					return;
				} else {
					epsgProblem = false;
					epsgDialoagOpen = false;
				}

				const converter = proj4(sourceProjection!, targetProjection);

				// A bit messy, but for some reason deep copying didn't work
				if (isGeometryCollection(jsonData)) {
					outdata = {
						type: 'GeometryCollection',
						geometries: jsonData.geometries
					} satisfies GeometryCollection;
				} else if (isGeometry(jsonData)) {
					outdata = {
						type: jsonData.type,
						coordinates: jsonData.coordinates as any
					} satisfies Geometry;
				} else if (isFeature(jsonData)) {
					outdata = {
						type: 'Feature',
						geometry: convertGeometry(jsonData.geometry, converter),
						properties: jsonData.properties
					} satisfies Feature<Geometry, GeoJsonProperties>;
				} else if (isFeatureCollection(jsonData)) {
					console.log(outdata);
					outdata = {
						type: 'FeatureCollection',
						features: jsonData.features.map(
							(f) =>
								({
									type: 'Feature',
									geometry: convertGeometry(f.geometry, converter),
									properties: f.properties
								} satisfies Feature<Geometry, GeoJsonProperties>)
						)
					} satisfies FeatureCollection;
				}
			}

			const fileName = l.displayName + '.geojson';
			const contentType = 'application/json';
			const jsonBlob = new Blob([JSON.stringify(outdata)], { type: contentType });
			const url = URL.createObjectURL(jsonBlob);

			const link = document.createElement('a');
			link.href = url;
			link.download = fileName;
			link.click();

			URL.revokeObjectURL(url);
		});
	}

	$: allSelected = selectedLayers.length === get(mapLayers).length;

	function selectAll() {
		if (allSelected) selectedLayers = [];
		else selectedLayers = get(mapLayers);
	}

	onMount(() => {
		fileInput.addEventListener('change', handleFileChange);
	});
</script>

<!-- 
	@component
	Sidebar that includes a sortable list of layers, as well as buttons for upload/download of 
	new layers. 
 -->

<div class="container pulsating-border">
	<div class="content">
		<span class="layer-title"
			><h2 style="margin: 0;">Layers</h2>
			<Icon class="material-icons">layers</Icon>
			{#if selectModeEnabled}
				<span class="check-all-btn">
					<IconButton class="material-icons" on:click={selectAll}
						>{allSelected ? 'check_box' : 'check_box_outline_blank'}</IconButton
					>
				</span>
			{/if}
		</span>
		<hr />
		{#if selectedTool}
			<span style="display: flex; align-items: center; justify-content: space-between; ">
				<h3>{selectedTool?.name.toUpperCase()}</h3>
				<Wrapper rich>
					<span class="info-btn">
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
				<IconButton
					class="material-icons"
					disabled={selectedLayers.length === 0}
					on:click={() => {
						epsgDialoagOpen = true;
					}}>download</IconButton
				>
				<Tooltip>Download layer(s)</Tooltip>
			</Wrapper>
			<span style="margin-left: auto;">
				{#if selectedTool}
					<Button
						variant="unelevated"
						bind:disabled={applyIsDisabled}
						on:click={handleApplyTransformation}
					>
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
								if (!selectModeEnabled) {
									selectedLayers = [];
									dispatch('singleLayerSelect', { layer: null });
								}
							}}>{selectModeEnabled ? 'check' : 'rule'}</IconButton
						>
						<Tooltip>{selectModeEnabled ? 'Quit selection mode' : 'Select layers'}</Tooltip>
					</Wrapper>
					{#if selectModeEnabled}
						<IconButton
							class="material-icons"
							disabled={selectedLayers.length === 0}
							on:click={() => {
								selectedLayers.forEach((l) => {
									map.removeLayer(l.id);
									map.removeSource(l.id);
									mapLayers.deleteLayer(l.id);
								});
								selectModeEnabled = !selectModeEnabled;
							}}>delete_outline</IconButton
						>
					{/if}
				{/if}
			</span>
		</span>
	</div>
</div>

<EpsgDialog bind:open={epsgDialoagOpen} bind:problem={epsgProblem} on:epsgSet={dowloadFiles} />

<style lang="scss">
	.check-all-btn {
		margin-left: auto;
		margin-block: 0;
		align-items: center;
	}
	.info-btn {
		display: flex;
		align-items: center;
		text-justify: center;
		padding-right: 12px;
		cursor: default;
	}

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
		/* width: 250px; */
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
		/* padding-block: 6px; */

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
