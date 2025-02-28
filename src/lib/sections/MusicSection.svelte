<script>
	import { onMount } from "svelte";
  	import { setContext, getContext } from "svelte";

  	import Catalog from "../catalog/Catalog.svelte";
  	import CatalogNew from "../catalog/CatalogNew.svelte"
  	import Player from "../player/Player.svelte";
  	import OpenListIcon from "../icons/OpenListIcon.svelte"

  	import {
	    registerStore,
	    writeData,
	    readData,
	    deleteData,
			clearStore,
	} from "../utils/indexeddb.js";

	let { label, dbName, dbState, storeName } = $props();

	let isReady = $state(false);
	let playlists = $state([]);
	let activePlaylist =$state(null);

	$inspect(playlists)
  
	setContext("playlists", {
	    getPlaylists() {
	    	return playlists;
	    },
	    setPlaylists(items) {
	    	playlists = items;
	    },
	    getPlaylist(id) {
	    	return playlists.find(({ id }) => id === id);
	    },
	    setPlaylist(item) {
	    	console.log(item)
	    	playlists = playlists.map((obj) =>
	   			obj.id === item.id ? item : obj,
	    	);
	    }
	});

	setContext("activePlaylist", {
		getActivePlaylist() {
			return activePlaylist;
		},
		setActivePlaylist(playlist) {
			activePlaylist = playlist;
			playlist.quantity = playlist.tracks.length;
			playlists = playlists.map((obj) => 
				obj.id === activePlaylist.id ? activePlaylist : obj
			);
		},
		getActivePlaylistTrack(id) {
      return activePlaylist.tracks.find(({ id }) => id === id);
    },
    setActivePlaylistTrack(track) {
    	//Update active playlist tracks
      activePlaylist.tracks = activePlaylist.tracks.map((obj) =>
        obj.id === track.id ? track : obj
      );
      //Update playlists respectively
      playlists = playlists.map((obj) => 
				obj.id === activePlaylist.id ? activePlaylist : obj
			);
    }
	});


	$effect(async () => {
	    if (dbState.isReady) {
	      playlists = await readData(dbName, storeName);

	      playlists = playlists.sort(
	        (a, b) => a.index - b.index,
	      );
	      isReady = true;
	    }
	});

	$effect(async () => {
	    if (isReady) {
	    	try {
		        await writeData(
		          dbName,
		          storeName,
		          $state.snapshot(playlists),
		        );
		    } catch (error) {
		    	console.error(`Error writing the tracks to DB: ${error}`);
		    }
	    }
	});



</script>

<div class="section">
	<div class="section-header">
		<div class="section-header-label">
		{#if !activePlaylist}
		 	{ label }
		{:else}
			<button
		   	class="back-button"
		   	onclick={() => activePlaylist = null}
		  >
		   	{ label } 
			</button>
			<div class="section-header-label-text">
				/ { activePlaylist.name }
			</div>
		   	
		 {/if}
		</div>
		<div class="section-header-action">
		{#if !activePlaylist}
		 	<CatalogNew />
		{/if}
			
		</div>
	</div>
	{#if !activePlaylist}
    <Catalog
      playlists={playlists}
    />
  {:else}
    <Player
      playlist={activePlaylist}
    />
  {/if}
</div>

<style>

	.section {
		font-family: "Roboto", serif;
		height: 100%;
    max-height: 100%;
		display: flex;
		flex-direction: column;
		gap: 16px;

	}

	.section-header {
	  display: grid;
	  grid-template-columns: minmax(0, 1fr) auto; /* This is key */
	  gap: 16px;
	  padding-block: 0px;
	  width: 100%;
	}

	.section-header-label {
	  font-size: 32px;
	  font-weight: 600;
	  display: flex;
	  align-items: center;
	  max-width: 70%; /* Reduced from 80% */
	  min-width: 0; /* Critical for flex items with text overflow */
	  overflow: hidden;
	}


	.section-header-label-text {
	  white-space: nowrap;
	  overflow: hidden;
	  text-overflow: ellipsis;
	  min-width: 0; /* Important for text overflow to work in flex containers */
	}

	button {
		background: none;
		border: none;
	}

	.back-button {
		font-size: 32px;
		font-weight: 600;
		
	}

	.back-button:hover {
		cursor: pointer;
		color: #2196f3;
	}

	.back-button::before {
		content: "";
	}




	
</style>