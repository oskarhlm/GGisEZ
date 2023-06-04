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
	import type { LayerActionType } from './ListItem.svelte';
	import type mapboxgl from 'mapbox-gl';
	import Select, { Option } from '@smui/select';
	import type { MapLayer } from '../../../stores/mapLayers';
	import type { GeoJSONSourceRaw } from 'mapbox-gl';
	import type { GeoJSONTool } from '../GeoJsonProcessing/types';
	import { addLayerWithTypeCheck } from '../Map/utils';
	import { BufferProcessor } from '../GeoJsonProcessing';
	import type { GeoJSON } from 'geojson';
	import BufferOptions from './ToolOptions/BufferOptions.svelte';

	export let map: mapboxgl.Map;
	export let selectedTool: GeoJSONTool | null;

	const sortList = (ev: any) => {
		const { newList, from, to } = ev.detail;
		const movedLayerId = newList[to];
		mapLayers.set(newList);
		mapLayers.setNewLayerIndex({ layerId: movedLayerId, index: parseInt(to) });
	};

	let fileInput: HTMLInputElement;
	let files: FileList;

	let selectedLayers: MapLayer<mapboxgl.Layer>[] = [];
	let options: any;

	function updateOptions(newOptions: any) {
		options = newOptions;
	}

	function handleApplyTransformation() {
		if (!selectedTool?.geoProcessor?.validator(selectedLayers)) return;
		const [poly1, poly2] = _.map(selectedLayers, (l) => {
			const source = l.source as GeoJSONSourceRaw;
			return source.data;
		});

		console.log(poly1, poly2);
		const newLayer = selectedTool?.geoProcessor?.processor(selectedLayers, options);
		newLayer &&
			addLayerWithTypeCheck(map, {
				id: 'test_buffer',
				geojson: {
					type: 'geojson',
					data: newLayer
				}
			});
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
			<ListItem layer={item} {selectedTool} {map} on:toggled={handleSelectedLayersUpdate} />
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
				<Button variant="unelevated" on:click={handleApplyTransformation}>
					<Label>Apply</Label>
				</Button>
				<!-- <Wrapper>
					<IconButton
						class="material-icons"
						on:click={() => {
							selectModeEnabled = !selectModeEnabled;
						}}>{selectModeEnabled ? 'check' : 'rule'}</IconButton
					>
					<Tooltip>Select layers</Tooltip>
				</Wrapper> -->
			</span>
		</span>
	</div>
</div>

<style lang="scss">
	.file-action-row {
		/* margin-left: auto; */
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
		width: 300px;
		height: 100%;
		/* border-radius: 20px; */
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

		:global(ul) {
			margin-block: 0;

			:global(li) {
				border: none;
			}
		}
	}
</style>
