<script lang="ts">
	export let item: any;
	export let index: any;

	const featureTypeToIconPath = new Map<
		'point' | 'line' | 'polygon',
		{ description: string; iconPath: string }
	>([
		['point', { description: 'Point', iconPath: 'button-icons/point.png' }],
		['line', { description: 'Line', iconPath: 'button-icons/line.png' }],
		['polygon', { description: 'Polygon', iconPath: 'button-icons/polygon.png' }]
	]);
</script>

<!-- <p>{item} {index} boi</p> -->

<div class="item">
	<img class="icon" src={featureTypeToIconPath.get(item)?.iconPath} alt={item} />
	<p class="description">{featureTypeToIconPath.get(item)?.description}</p>
</div>

<style>
	.item {
		display: flex;
		align-items: center;
	}

	.icon {
		margin-right: 10px;
		width: 20px;
		/* Add styles for the icon, such as font-size, color, or background */
	}

	.description {
		/* Add styles for the description text */
	}
</style>
