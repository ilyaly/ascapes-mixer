<script>
	import { onMount } from "svelte";
  import { setContext, getContext } from "svelte";

  import Catalog from "../catalog/Catalog.svelte";
  import CatalogNew from "../catalog/CatalogNew.svelte"
  import OneShotPlayer from "../oneshot/OneShotPlayer.svelte";

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
		    	/ { activePlaylist.name }
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
      <OneShotPlayer
      	playlist={activePlaylist}
      />
  {/if}
</div>

<style>

	.section {
		font-size: 24px;
		height: 100%;
		display: flex;
		flex-direction: column;
		gap: 32px;
	}

	.section-header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	button {
		background: none;
		border: none;
	}

	.back-button {
		font-size: 24px;
	}

	.back-button:hover {
		cursor: pointer;
		color: #2196f3;
	}

	.back-button::before {
		content: "< ";
	}
	
</style>