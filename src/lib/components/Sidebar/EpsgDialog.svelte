<script lang="ts">
	import Dialog, { Title, Content, Actions } from '@smui/dialog';
	import Button, { Label } from '@smui/button';
	import Textfield from '@smui/textfield';
	import { createEventDispatcher } from 'svelte';

	export let open: boolean;
	let epsg = '4326';

	const dispatch = createEventDispatcher<{ download: { epsg: string } }>();
	function handleDownload() {
		dispatch('download', { epsg });
	}
</script>

<Dialog bind:open>
	<Title>Choose <a href="https://epsg.io/">EPSG</a> for download:</Title>
	<Textfield bind:value={epsg} style="margin-inline: 20px;" />
	<Actions style="margin-block: 8px;">
		<Button variant="unelevated" on:click={handleDownload}>
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
	</Actions>
</Dialog>
