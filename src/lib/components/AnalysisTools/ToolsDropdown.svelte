<script lang="ts">
	import AnalysisElement from './AnalysisElement.svelte';
</script>

<div class="container">
	<AnalysisElement name="BBOX" iconPath="button-icons/bbox.png" />
	<AnalysisElement name="BUFFER" iconPath="button-icons/buffer.png" />
	<AnalysisElement name="CLIP" iconPath="button-icons/clip.png" />
	<AnalysisElement name="DIFFERENCE" iconPath="button-icons/difference.png" />
	<AnalysisElement name="INTERSECT" iconPath="button-icons/intersection.png" />
	<AnalysisElement name="UNION" iconPath="button-icons/union.png" />
	<AnalysisElement name="VORNOI" iconPath="button-icons/vornoi.png" />
</div>

<style lang="scss">
	.container {
		position: absolute;
		top: 0;
		right: 0;
		pointer-events: all;
		display: flex;
		flex-direction: column;
		gap: 7px;
		@include transparent-background($background-gray, 0.8);
		height: fit-content;
		align-items: center;
		opacity: 0.8;
	}

	.container:hover {
		opacity: 1;
	}
</style>
