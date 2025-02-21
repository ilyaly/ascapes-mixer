<script>
	import { onMount } from "svelte";
  	import { setContext, getContext } from "svelte";

  	import Catalog from "../catalog/Catalog.svelte";
  	import CatalogNew from "../catalog/CatalogNew.svelte"
  	import Player from "../player/Player.svelte";

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
		getActivePlaylistId() {
			return activePlaylist;
		},
		setActivePlaylist(playlist) {
			activePlaylist = playlist;
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
		    		onclick={() => activePlaylist = null}
		    	>
		    		Back
				</button>
		    	{ activePlaylist.name }
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
		font-size: 24px;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.section-header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	
</style>