<script>
	let { item } = $props()

	let name = $state(item.name)

	function handleNameChange(argument) {
		// body...
	}
</script>

<div class="catalog">
	<input
		class="catalog-name"
        type="text"
        name="name"
        required
        minlength="4"
        maxlength="128"
        autocomplete="off"
        placeholder={name}
        bind:value={name}
        onchange={handleNameChange}
      />

	<span
		class="catalog-quantity"
	>
		Number of tracks: 	{ item.quantity }
	</span>
</div>

<style>
	.catalog {
		margin: 8px;
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 16px;
		border: 1px solid black;
		border-radius: 4px;
	}

	.catalog-name {
		font-size: 18px;
		font-weight: 500;
		margin: 0;
		padding: 0;
		border: none;
	}

	.catalog-quantity {
		font-weight: 200;
	}
</style>