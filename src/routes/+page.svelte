<script lang="ts">
	import Tooltip, { Wrapper } from '@smui/tooltip';

	import { Map, Sidebar } from '$lib/components';
	import ToolsDropdown from '$lib/components/AnalysisTools/ToolsDropdown.svelte';
</script>

<Map>
	<div class="wrapper">
		<Sidebar />
		<ToolsDropdown />
	</div>
</Map>

<style lang="scss">
	.wrapper {
		height: 100%;
	}
</style>
