<script lang="ts">
	import SortableList from 'svelte-sortable-list';
	import ListItem from './ListItem.svelte';
	const elementNames = ['Buffer', 'Intersect', 'Dissolve'];
	let list = ['First Item', 'Second Item', 'Third Item'];
	const sortList = (ev: any) => {
		list = ev.detail;
	};
</script>

<div class="container">
	<div class="content">
		<h1 style="margin-top: 0;">Layers</h1>
		<SortableList {list} key={null} on:sort={sortList}>
			<ListItem />
		</SortableList>
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
