<script lang="ts">
	import { Map, Sidebar } from '$lib/components';
	import ToolsDropdown from '$lib/components/AnalysisTools/ToolsDropdown.svelte';
</script>

<Map on:variableUpdated />
<div id="overlay">
	<Sidebar />
	<ToolsDropdown />
</div>

<style lang="scss">
	#overlay {
		position: absolute;
		top: 0;
		left: 0;
		inset: 20px;
		pointer-events: none;
	}
</style>
