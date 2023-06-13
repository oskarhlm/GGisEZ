<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { snackbars } from '../../../stores/snackbars';
	import Snackbar from './Snackbar.svelte';
</script>

{#each $snackbars as snackbar (snackbar.message)}
	<Snackbar {...snackbar} on:snackbarClosed />
{/each}
