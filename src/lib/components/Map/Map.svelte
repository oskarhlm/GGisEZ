<script>
	import Mapbox from './Mapbox.svelte';
</script>

<div id="wrapper">
	<Mapbox />
	<div id="overlay">
		<slot />
	</div>
</div>

<style>
	#wrapper {
		/* position: relative; */
	}

	#overlay {
		position: absolute;
		top: 0;
		left: 0;
		inset: 20px;
		pointer-events: none;
	}
</style>
