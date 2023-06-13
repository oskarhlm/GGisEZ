<script lang="ts">
	import Dialog, { Title, Actions } from '@smui/dialog';
	import Button, { Label } from '@smui/button';
	import Textfield from '@smui/textfield';
	import { createEventDispatcher } from 'svelte';
	import { getProj4String } from '$lib/utils/fileUploader';

	export let open: boolean;
	export let problem: boolean;

	const defaultEpsg = '4326';
	let epsg = defaultEpsg;

	$: downLoadDisabled = !/^[0-9]+$/.test(epsg) || epsg.length === 0;

	const dispatch = createEventDispatcher<{ download: { epsg: string } }>();
	function handleDownload() {
		dispatch('download', { epsg });
	}
</script>

<!-- 
    @component
    Popup dialog that is display whenever the user presses the download button. 
    Allows for downloading with a specified map projection. 
 -->

<Dialog bind:open>
	<Title>Choose <a href="https://epsg.io/">EPSG</a> for download:</Title>
	<span class="epsg-row">
		<Textfield variant="outlined" bind:value={epsg} bind:invalid={problem} />
		<Button variant="outlined" on:click={() => (epsg = defaultEpsg)}>WGS84</Button>
	</span>
	<div class="btn-row">
		<Button variant="unelevated" on:click={handleDownload} bind:disabled={downLoadDisabled}>
			<Label>Download</Label>
		</Button>
		<Button
			variant="outlined"
			on:click={() => {
				open = false;
			}}
		>
			<Label>Cancel</Label>
		</Button>
	</div>
</Dialog>

<style lang="scss">
	.btn-row {
		margin-left: auto;
		margin-block: 16px;
		margin-right: 20px;
	}

	.epsg-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-inline: 20px;
		gap: 8px;
	}
</style>
