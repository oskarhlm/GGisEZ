<script lang="ts">
	import DataTable, { Head, Body, Row, Cell, Pagination } from '@smui/data-table';
	import Select, { Option } from '@smui/select';
	import IconButton from '@smui/icon-button';
	import { Label } from '@smui/common';
	import Dialog from '@smui/dialog';

	export let open: boolean;
	export let geojson: any;

	let hashTable: { [key: string]: any[] } = {};

	$: {
		hashTable = {};
		if (open) {
			for (const feature of geojson.data.features) {
				for (const key in feature.properties) {
					if (hashTable[key]) {
						hashTable[key].push(feature.properties[key]);
					} else {
						hashTable[key] = [feature.properties[key]];
					}
				}
			}
		}
	}

	let rowsPerPage = 10;
	let currentPage = 0;

	$: start = currentPage * rowsPerPage;
	$: end = Math.min(start + rowsPerPage, geojson.data.features.length);
	$: slice = geojson.data.features.slice(start, end);
	$: lastPage = Math.max(Math.ceil(geojson.data.features.length / rowsPerPage) - 1, 0);

	$: if (currentPage > lastPage) {
		currentPage = lastPage;
	}
</script>

<Dialog bind:open fullscreen>
	<DataTable table$aria-label="Todo list" style="width: 100%;">
		<Head>
			<Row>
				{#each Object.keys(hashTable) as key}
					<Cell>{key}</Cell>
				{/each}
			</Row>
		</Head>
		<Body>
			{#each slice as feature}
				<Row>
					{#each Object.keys(hashTable) as key}
						<Cell>{feature.properties[key]}</Cell>
					{/each}
				</Row>
			{/each}
		</Body>

		<Pagination slot="paginate">
			<svelte:fragment slot="rowsPerPage">
				<Label>Rows Per Page</Label>
				<Select variant="outlined" bind:value={rowsPerPage} noLabel>
					<Option value={10}>10</Option>
					<Option value={25}>25</Option>
					<Option value={100}>100</Option>
				</Select>
			</svelte:fragment>
			<svelte:fragment slot="total">
				{start + 1}-{end} of {geojson.data.features.length}
			</svelte:fragment>

			<IconButton
				class="material-icons"
				action="first-page"
				title="First page"
				on:click={() => (currentPage = 0)}
				disabled={currentPage === 0}>first_page</IconButton
			>
			<IconButton
				class="material-icons"
				action="prev-page"
				title="Prev page"
				on:click={() => currentPage--}
				disabled={currentPage === 0}>chevron_left</IconButton
			>
			<IconButton
				class="material-icons"
				action="next-page"
				title="Next page"
				on:click={() => currentPage++}
				disabled={currentPage === lastPage}>chevron_right</IconButton
			>
			<IconButton
				class="material-icons"
				action="last-page"
				title="Last page"
				on:click={() => (currentPage = lastPage)}
				disabled={currentPage === lastPage}>last_page</IconButton
			>
		</Pagination>
	</DataTable>
</Dialog>
