<script>
	import OpenListIcon from "../icons/OpenListIcon.svelte"
	import DeleteIcon from "../icons/DeleteIcon.svelte"
	import NoteIcon from "../icons/NoteIcon.svelte"

	let { item } = $props()

	let name = $state(item.name);
	let description = $state(item.description);

	function handleNameChange(argument) {
		// body...
	}
</script>

<div class="catalog">
	<div class="catalog-header">
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

	    <button class="button">
			<OpenListIcon />
		</button>

	    
		
	</div>
	



	<textarea 
		class="catalog-description" 
		name="description" 
		rows="4" 
		cols="33"
		bind:value={description}
	>
	</textarea>

	<div class="catalog-footer">
		<span
			class="catalog-quantity"
		>
			<NoteIcon />
			{ item.quantity } tracks
		</span>
		<button class="delete-button">
	    	<DeleteIcon />
	    </button>

	</div>
	
</div>

<style>
	.catalog {
		height: fit-content;
		margin: 8px;
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 16px;
		border: 1px solid black;
		border-radius: 4px;


	}

	.catalog:hover {
		background-color: #0000000d;
	}

	.catalog-header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;

	}

	.catalog-name {
		font-size: 18px;
		font-weight: 400;
		margin: 0;
		padding: 4px;
		border: none;
		border-radius: 4px;
	}

	.catalog-description {
		font-size: 16px;
		font-weight: 300;
		margin: 0;
		padding: 0;
		border: none;
		resize: none;
		padding: 4px;
		border-radius: 4px;
	}

	.catalog-footer {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.catalog-quantity {
		display: flex;
	    gap: 8px;
	    align-items: center;
		font-size: 16px;
		font-weight: 200;
		padding: 2px;
	}

	button {
		margin: 0;
		padding: 0;
		background: none;
		border: none;
	}

	button:hover {
	    cursor: pointer;
		fill: rgb(33 150 243 / 100%);
	}

	.delete-button {
		cursor: pointer;
	}

	.delete-button:hover {
	    fill: red;
	}

	input, textarea {
		font-family: "Roboto", serif;
	    font-optical-sizing: auto;
	    font-weight: <weight>;
	    font-style: normal;
	    font-variation-settings: "wdth" 100;
	}
</style>