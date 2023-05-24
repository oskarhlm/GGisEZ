<script>
	import Mapbox from './Mapbox.svelte';
</script>

<Mapbox />
<div id="overlay">
	<slot />
</div>

<style>
	#overlay {
		position: absolute;
		top: 0;
		left: 0;
		inset: 20px;
		pointer-events: none;
	}
</style>
