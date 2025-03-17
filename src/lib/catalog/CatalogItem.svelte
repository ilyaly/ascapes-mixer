<script>
	import { getContext } from "svelte";

	import OpenListIcon from "../icons/OpenListIcon.svelte"
	import DeleteIcon from "../icons/DeleteIcon.svelte"
	import NoteIcon from "../icons/NoteIcon.svelte"

	import { remove, BaseDirectory } from "@tauri-apps/plugin-fs";

	let { item } = $props()

	let playlistsContext = getContext("playlists");
	let playingPlaylistContext = getContext("playingPlaylist");
	let openedPlaylistContext = getContext("openedPlaylist")

	let name = $state(item.name);
	let description = $state(item.description);
	let isMouseOver = $state(false);
	let isPlaying = $state(false);

	$effect(() => {
		if (playingPlaylistContext.getPlayingPlaylist().id === item.id) {
			isPlaying = true;
		} else {
			isPlaying = false;
		}
	})

	function handleNameChange() {
		playlistsContext.setPlaylistName(item.id, name)
	}

	function handleDescriptionChange() {
		playlistsContext.setPlaylistDescription(item.id, description)
	}

	async function handleDelete() {
		let tempItems = $state.snapshot(playlistsContext.getPlaylists());
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
	    playlistsContext.setPlaylists(tempItems);
	}

	function handleOpenPlaylist() {
		openedPlaylistContext.setOpenedPlaylistId(item.id)
	}
</script>

<div class="catalog {isPlaying ? 'playing' : ''}">
	<div class="catalog-header">
		<div class="catalog-meta">
			<input
				class="catalog-name"
		        type="text"
		        name="name"
		        required
		        minlength="128"
		        maxlength="128"
		        autocomplete="off"
		        placeholder="Enter catalog name"
		        bind:value={name}
		        onchange={handleNameChange}
		    />
		    <textarea 
				class="catalog-description" 
				name="description" 
				rows="2" 
				cols="33"
				bind:value={description}
				onchange={handleDescriptionChange}
				placeholder="Enter catalog description"
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

	

	<div class="catalog-footer">
		<span
			class="catalog-quantity"
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
	.catalog {
		height: fit-content;
		padding: 8px;
		display: flex;
		flex-direction: column;
		border: 1px solid #0000004d;
		border-radius: 4px;
		background-color: #fff;
	}

	.playing {
		-webkit-animation: shadow-drop-center 1s ease-in-out infinite alternate-reverse both;
	    animation: shadow-drop-center 1s ease-in-out infinite alternate-reverse both;
	}

	.catalog:hover {
		background-color: #f0f0ff;
		
	}

	.catalog:hover button {
		visibility: visible;
	}


	.catalog-header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-start;
		gap: 16px;
	}

	.catalog-meta {
		display: flex;
    	flex-direction: column;
    	gap: 8px;
    	width: 100%;
	}

	.catalog-name {
		font-size: 18px;
		font-weight: 400;
		margin: 0;
		padding: 4px;
		border: none;
		border-radius: 4px;
		width: -webkit-fill-available;
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
		overflow: hidden;
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


	@-webkit-keyframes shadow-drop-center {
	  0% {
	    -webkit-box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
	            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
	  }
	  100% {
	    -webkit-box-shadow: 0 0 10px 0px rgba(0, 0, 0, 0.30);
	            box-shadow: 0 0 10px 0px rgba(0, 0, 0, 0.30);
	  }
	}
	@keyframes shadow-drop-center {
	  0% {
	    -webkit-box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
	            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
	  }
	  100% {
	    -webkit-box-shadow: 0 0 10px 0px rgba(0, 0, 0, 0.30);
	            box-shadow: 0 0 10px 0px rgba(0, 0, 0, 0.30);
	  }
	}



</style>