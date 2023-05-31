<script lang="ts">
	export let name: string;
	export let iconPath: string;
</script>

<button>
	<img class="button-icon" alt="button" src={iconPath || 'button-icons/intersection.png'} />
	<p>{name}</p>
</button>

<style lang="scss">
	p {
		margin: 0;
		font-size: 12px;
		color: white;
	}

	button {
		border: none;
		appearance: none;
		background-color: rgba(0, 0, 0, 0);
		border-radius: 5px;
		padding: 0;
		cursor: inherit;
		width: 100%;
		padding-inline: 3px;
		padding-block: 8px;
	}

	button:hover {
		background-color: $background-gray-brighter;
	}

	.button-icon {
		width: 40px;
	}
</style>
