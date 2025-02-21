<script>
	import { onMount } from "svelte";
  	import { setContext, getContext } from "svelte";

	import CatalogsHeader from "./CatalogsHeader.svelte"
	import CatalogItem from "./CatalogItem.svelte"

	import { flip } from "svelte/animate";
  	import { dndzone } from "svelte-dnd-action";

  	import {
	    registerStore,
	    writeData,
	    readData,
	    deleteData,
	    clearStore,
	} from "../utils/indexeddb.js";

	let { label, dbName, dbState, storeName } = $props();

	let items = $state([]);

	let catalogState = $state({
	    isReady: false,
	    isActive: false,
	    playlists: []
	});

	setContext("catalog", {
	    getCatalogReady() {
	      return catalogState.isReady;
	    },
	    setCatalogReady(bool) {
	    	catalogState.isReady = bool;
	    },
	    getCatalogPlaylists() {
	    	return catalogState.playlists;
	    },
	    setCatalogPlaylists(playlists) {
	    	catalogState.playlists = playlists;
	    },
	    getCatalogPlaylist(id) {
	    	return catalogState.playlists.find(({ id }) => id === id);
	    },
	    setCatalogPlaylist(playlist) {
	    	catalogState.playlists = catalogState.playlists.map((obj) =>
	   			obj.id === playlist.id ? playlist : obj,
	    	);
	    },
	});

	const dropFromOthersDisabled = true;
	const flipDurationMs = 100;
	const dropTargetStyle = {
		outline: "rgba(0, 0, 255, 0.0) solid 1px",
	};

	function updateItems() {
	    let itemsSnapshot = $state.snapshot(items);

	    for (let i = 0; i < itemsSnapshot.length; i++) {
	      itemsSnapshot[i].index = i;
	    }
	    items = itemsSnapshot;
	    catalogState.playlists = items;
	};

	function handleDndConsider(e) {
	    items = e.detail.items;
	};

	function handleDndFinalize(e) {
	    items = e.detail.items;
	    updateItems();
	};

	$effect(() => {
		items = catalogState.playlists;
	})

	$effect(async () => {
	    if (dbState.isReady) {
	      catalogState.playlists = await readData(dbName, storeName);

	      catalogState.playlists = catalogState.playlists.sort(
	        (a, b) => a.index - b.index,
	      );
	      catalogState.isReady = true;
	    }
	});

	$effect(async () => {
	    if (catalogState.isReady) {
	    	try {
		        await writeData(
		          dbName,
		          storeName,
		          $state.snapshot(catalogState.playlists),
		        );
		    } catch (error) {
		    	console.error(`Error writing the tracks to DB: ${error}`);
		    }
	    }
	});

	async function handleWriteDataToDB() {
	    try {
	        await writeData(
	          dbName,
	          storeName,
	          $state.snapshot(catalogState.playlists),
	        );
	    } catch (error) {
	      console.error(`Error writing the tracks to DB: ${error}`);
	    };
	};

	async function handleReadDataFromDB() {
	    try {
	      const data = await readData(dbName, storeName);
	      console.log(`Read data from ${storeName}`);
	      console.log(data);
	    } catch (error) {
	      console.error(error);
	    };
	};

	async function handlDeleteAllDataFromDB() {
	    try {
	      await clearStore(dbName, storeName); // Clear all entries from the store
	      catalogState.playlists = [];
	    } catch (error) {
	      console.error(error);
	    };
	};

</script>


<div class="catalogs">
	<div class="helpers">
	    <CatalogsHeader
			label={label}
		/>
    
		<button
			onclick={handleReadDataFromDB}
		>
			Read data from DB
		</button>
		<button
			onclick={handlDeleteAllDataFromDB}
		>
			Delete all data from DB
		</button>
  	</div>
	

	<div class="catalogs-list">
		<span class="zone-tip">Create new playlist</span>
		{#if items.length === 0}
		{:else}
			<section
		        class="playlist-zone"
		        use:dndzone={{ items, flipDurationMs, dropTargetStyle, dropFromOthersDisabled }}
		        onconsider={handleDndConsider}
		        onfinalize={handleDndFinalize}
		    >
		    	{#each items as item, index (item.id)}
		        	<div
		            	class="playlist-item-wrapper"
		            	animate:flip={{
		              		duration: flipDurationMs,
		              		css: "rgba(0, 255, 255, 0.2) solid 10px",
		            	}}
		          	>
		            <CatalogItem 
						item={item}
					/>
		        	</div>
		        {/each}
		    </section>
		{/if}
	</div>
</div>

<style>

	.catalogs {
		height: 100%;
		width: -webkit-fill-available;
		display: flex;
		align-items: stretch;
		justify-content: start;
		flex-direction: column;
		margin: 8px;
	}

	.catalogs-list {
		position: relative;
    	height: 100%;
		display: flex;
		flex-direction: column;
	}

	.helpers {
	    display: flex;
	    flex-direction: row;
	    align-items: center;
	    gap: 16px;
	}

	.zone-tip {
	    position: absolute;
	    color: rgb(0 0 0 / 20%);
	    display: flex;
	    width: 100%;
	    justify-content: center;
	    height: -webkit-fill-available;
	    align-items: center;
	    font-size: 24px;
		z-index: -1;
	}


</style>