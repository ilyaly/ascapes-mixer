<script>
	let { item } = $props()

	let name = $state(item.name);
	let description = $state(item.description);

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



	<textarea 
		class="catalog-description" 
		name="story" 
		rows="5" 
		cols="33"
		bind:value={description}
	>
	</textarea>

	<span
		class="catalog-quantity"
	>
		Number of tracks: 	{ item.quantity }
	</span>
</div>

<style>
	.catalog {
		height: 128px;
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

	.catalog-description {
		font-size: 16px;
		font-weight: 200;
		margin: 0;
		padding: 0;
		border: none;
		resize: none;
	}

	.catalog-quantity {
		font-size: 16px;
		font-weight: 200;
	}
</style>