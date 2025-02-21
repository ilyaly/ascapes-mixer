<script>
	import { getContext } from "svelte";

	import OpenListIcon from "../icons/OpenListIcon.svelte"
	import DeleteIcon from "../icons/DeleteIcon.svelte"
	import NoteIcon from "../icons/NoteIcon.svelte"

	let { item } = $props()

	let playlistsState = getContext("playlists");
	let activePlaylistState = getContext("activePlaylist");

	let name = $state(item.name);
	let description = $state(item.description);

	function handleNameChange() {
		playlistsState.setPlaylist({
			id: item.id,
			name: name,
			description: item.description,
			quantity: item.quantity,
			tracks: [],
			isActive: false
		})
	}

	function handleDescriptionChange() {
		playlistsState.setPlaylist({
			id: item.id,
			name: item.name,
			description: description,
			quantity: item.quantity
		})
	}

	function handleDelete() {
		let tempItems = $state.snapshot(playlistsState.getPlaylists());
	    tempItems = tempItems.filter((playlist) => playlist.id !== item.id);
	    for (let i = 0; i < tempItems.length; i++) {
	      tempItems[i].index = i;
	    }
	    playlistsState.setPlaylists(tempItems);
	}

	function handleOpenPlaylist() {
		activePlaylistState.setActivePlaylist(item)
	}
</script>

<div class="playlist">
	<div class="playlist-header">
		<input
			class="playlist-name"
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

	    <button 
	    	class="button"
	    	onclick={handleOpenPlaylist} 
	    >
			<OpenListIcon />
		</button>
	</div>
	<textarea 
		class="playlist-description" 
		name="description" 
		rows="2" 
		cols="33"
		bind:value={description}
		onchange={handleDescriptionChange}
	>
	</textarea>

	<div class="playlist-footer">
		<span
			class="playlist-quantity"
		>
			<NoteIcon />
			{ item.quantity } tracks
		</span>
		<button
		class="delete-button"
			onclick={handleDelete}
		>
	    	<DeleteIcon />
	    </button>

	</div>
	
</div>

<style>
	.playlist {
		height: fit-content;
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 16px;
		border: 1px solid black;
		border-radius: 4px;
		background-color: #fff;
	}

	.playlist:hover {
		
	}

	.playlist-header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;

	}

	.playlist-name {
		font-size: 18px;
		font-weight: 400;
		margin: 0;
		padding: 4px;
		border: none;
		border-radius: 4px;
	}

	.playlist-name:hover {
		background-color: #0000000d;
	}

	.playlist-description {
		font-size: 16px;
		font-weight: 300;
		margin: 0;
		padding: 0;
		border: none;
		resize: none;
		padding: 4px;
		border-radius: 4px;
	}

	.playlist-footer {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.playlist-quantity {
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