<script lang="ts">
	import Tooltip, { Wrapper } from '@smui/tooltip';
	import IconButton, { Icon } from '@smui/icon-button';
	import SortableList from 'svelte-sortable-list';
	import ListItem from './ListItem.svelte';
	import { onMount, createEventDispatcher } from 'svelte';

	let list = ['point', 'line', 'polygon'];
	const sortList = (ev: any) => {
		list = ev.detail;
	};

	let fileInput: HTMLInputElement;
	let files: FileList;
	const dispatch = createEventDispatcher();

	function handleFileChange(event: Event) {
		const inputElement = event.target as HTMLInputElement;
		if (inputElement.files && inputElement.files.length > 0) {
			files = inputElement.files;
			dispatch('filesSelected', files);
		}
	}

	onMount(() => {
		fileInput.addEventListener('change', handleFileChange);
	});
</script>

<div class="container">
	<div class="content">
		<span class="layer-title"
			><h2 style="margin: 0;">Layers</h2>
			<Icon class="material-icons">layers</Icon></span
		>
		<hr />
		<SortableList {list} key={null} on:sort={sortList} let:item let:index>
			<ListItem {item} {index} />
		</SortableList>
		<hr style="margin-top: auto" />
		<span class="file-action-row">
			<Wrapper>
				<IconButton class="material-icons" on:click={() => fileInput.click()}
					>upload_file</IconButton
				>
				<Tooltip>Upload layers</Tooltip>
			</Wrapper>
			<input bind:this={fileInput} id="file-upload" multiple type="file" style="display: none;" />
			<Wrapper>
				<IconButton class="material-icons">download</IconButton>
				<Tooltip>Download layer(s)</Tooltip>
			</Wrapper>
			<span style="margin-left: auto;">
				<Wrapper>
					<IconButton class="material-icons">rule</IconButton>
					<Tooltip>Select layers</Tooltip>
				</Wrapper>
			</span>
		</span>
		{#if files}
			{#each files as file}
				{file.name}
			{/each}
		{/if}
	</div>
</div>

<style lang="scss">
	.inputfile-box {
		position: relative;
	}

	.inputfile {
		display: none;
	}

	.container {
		display: inline-block;
		width: 100%;
	}

	.file-box {
		display: inline-block;
		width: 100%;
		border: 1px solid;
		padding: 5px 0px 5px 5px;
		box-sizing: border-box;
		height: calc(2rem - 2px);
	}

	.file-button {
		background: red;
		padding: 5px;
		position: absolute;
		border: 1px solid;
		top: 0px;
		right: 0px;
	}

	.file-action-row {
		/* margin-left: auto; */
		display: flex;
		align-items: center;
		justify-content: center;

		button {
			background: none;
			border: none;
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;
			font-size: medium;
		}

		:global(.material-icons) {
			background: none;
			border: none;
			cursor: pointer;
		}
	}

	.container {
		width: 250px;
		height: 100%;
		border-radius: 20px;
		@include transparent-background($secondary-color, 0.9);
		pointer-events: all;
		box-sizing: border-box;
	}

	.layer-title {
		display: flex;
		gap: 5px;
		align-items: center;

		:global(.material-icons) {
			background: none;
			border: none;
		}
	}

	hr {
		border-style: solid;
		border-width: 1px;
		color: $background-gray-brighter;
		width: 100%;
	}

	.content {
		padding: 20px;
		height: calc(100% - 40px);
		display: flex;
		flex-direction: column;

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
