<script>
	import { getContext } from "svelte";

	import OpenListIcon from "../icons/OpenListIcon.svelte"
	import DeleteIcon from "../icons/DeleteIcon.svelte"
	import NoteIcon from "../icons/NoteIcon.svelte"

	import { remove, BaseDirectory } from "@tauri-apps/plugin-fs";

	let { item } = $props()

	let playlistsState = getContext("playlists");
	let activePlaylistState = getContext("activePlaylist");

	let name = $state(item.name);
	let description = $state(item.description);
	let isMouseOver = $state(false)

	function handleNameChange() {
		playlistsState.setPlaylist({
			id: item.id,
			name: name,
			description: item.description,
			quantity: item.quantity,
			tracks: item.tracks,
		})
	}

	function handleDescriptionChange() {
		playlistsState.setPlaylist({
			id: item.id,
			name: item.name,
			description: description,
			quantity: item.quantity,
			tracks: item.tracks,
		})
	}

	async function handleDelete() {
		let tempItems = $state.snapshot(playlistsState.getPlaylists());
	    tempItems = tempItems.filter((playlist) => playlist.id !== item.id);
	    for (let i = 0; i < tempItems.length; i++) {
	      tempItems[i].index = i;
	    }


	    let tempTracks = $state.snapshot(item).tracks;

	    if( tempTracks && tempTracks.length > 0 ) {
	    	for (let j = 0; j < tempTracks.length; j++) {
		    	let track = tempTracks[j];
		    	try {
		    		await remove(track.path, { baseDir: BaseDirectory.AppLocalData });
		    	} catch (error) {
		    		console.error(`Error deleting file from disk: ${error}`);
		    	}
		    }
	    }
	    

	    playlistsState.setPlaylists(tempItems);
	}

	function handleOpenPlaylist() {
		activePlaylistState.setActivePlaylist(item)
	}
</script>

<div class="playlist">
	<div class="playlist-header">
		<div class="playlist-meta">
			<input
				class="playlist-name"
		        type="text"
		        name="name"
		        required
		        minlength="128"
		        maxlength="128"
		        autocomplete="off"
		        placeholder="Enter playlist name"
		        bind:value={name}
		        onchange={handleNameChange}
		    />
		    <textarea 
				class="playlist-description" 
				name="description" 
				rows="2" 
				cols="33"
				bind:value={description}
				onchange={handleDescriptionChange}
				placeholder="Enter playlist description"
			>
			</textarea>
		</div>

		<button 
		   	class="button"
		   	onclick={handleOpenPlaylist} 
		>
			<OpenListIcon />
		</button>
	    
	</div>

	

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
		font-family: "Roboto", serif;
		height: fit-content;
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 16px;
		border: 1px solid #0000004d;
		border-radius: 4px;
		background-color: #fff;
		box-shadow: 0 0 8px 2px #0000001a;
	}

	.playlist:hover {
		background-color: #f0f0ff;
		
	}

	.playlist:hover button {
		visibility: visible;
	}


	.playlist-header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-start;
		gap: 16px;
	}

	.playlist-meta {
		display: flex;
    	flex-direction: column;
    	gap: 8px;
    	width: 100%;
	}

	.playlist-name {
		font-size: 18px;
		font-weight: 400;
		margin: 0;
		padding: 4px;
		border: none;
		border-radius: 4px;
		width: -webkit-fill-available;
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
		visibility: hidden;
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

	    text-overflow: ellipsis;
	    width: 50% /*-webkit-fill-available*/;
	    margin-block: 4px;
	    padding-block: 4px;
	    margin-inline: 4px;
	    padding-inline: 4px;
	    font-size: 16px;
	    background: none;
	    border: 0px solid grey; /* Green border on focus */
	    border-radius: 4px;
		outline: none; /* Remove default outline */
	}

	input:hover {
	    /*cursor: default;*/
	}

	textarea:hover {
	    /*cursor: default;*/
	}

	input:focus {
	    width: -webkit-fill-available;
	    border: 0px solid blue; /* Green border on focus */
	    background-color: #fff;
	    border-radius: 4px;
	    outline: none; /* Remove default outline */
	}

	textarea:focus {
	    width: -webkit-fill-available;
	    border: 0px solid blue; /* Green border on focus */
	    background-color: #fff;
	    border-radius: 4px;
	    outline: none; /* Remove default outline */
	}
</style>