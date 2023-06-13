<script lang="ts">
	import Snackbar, { Label } from '@smui/snackbar';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let message: string;
	export let timeout = 4000;

	let ref: Snackbar;
</script>

<Snackbar bind:this={ref} labelText={message} timeoutMs={timeout}>
	{message}
</Snackbar>
