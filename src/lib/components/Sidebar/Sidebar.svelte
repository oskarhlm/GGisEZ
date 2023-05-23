<script lang="ts">
	import AnalysisElement from '../AnalysisTools/AnalysisElement.svelte';
	const elementNames = ['Buffer', 'Intersect', 'Dissolve'];
</script>

<div class="container">
	<div class="content">
		<h1 style="margin-top: 0;">Layers</h1>
		{#each elementNames as e}
			<!-- <AnalysisElement name={e} /> -->
		{/each}
	</div>
</div>

<style>
	.container {
		width: 250px;
		height: 100%;
		border-radius: 20px;
		background-color: var(--secondary-color);
		pointer-events: all;
	}

	.content {
		padding: 20px;
		/* background-color: red; */
	}
</style>
