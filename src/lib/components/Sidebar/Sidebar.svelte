<script lang="ts">
	import SortableList from 'svelte-sortable-list';
	import ListItem from './ListItem.svelte';

	let list = ['point', 'line', 'polygon'];
	const sortList = (ev: any) => {
		list = ev.detail;
	};
</script>

<div class="container">
	<div class="content">
		<h1 style="margin-top: 0;">Layers</h1>
		<SortableList {list} key={null} on:sort={sortList} let:item let:index>
			<ListItem {item} {index} />
		</SortableList>
	</div>
</div>

<style lang="scss">
	.container {
		width: 250px;
		height: 100%;
		border-radius: 20px;
		@include transparent-background($secondary-color, 0.8);
		pointer-events: all;
	}

	.content {
		padding: 20px;

		/* :global(ul > li) {
			border: none;
			
		} */

		:global(ul) {
			:global(li) {
				border: none;
			}
		}
	}
</style>
