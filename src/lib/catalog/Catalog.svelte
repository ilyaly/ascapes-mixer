<script>
	import { onMount } from "svelte";
  	import { setContext, getContext } from "svelte";

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

	let { playlists } = $props()

	let items = $state([]);
	let isReady = $state(false);

	let playlistsState = getContext("playlists");

	$effect(() => {
		items = playlists;
	})

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
	    playlistsState.setPlaylists(items)
	};

	function handleDndConsider(e) {
	    items = e.detail.items;
	};

	function handleDndFinalize(e) {
	    items = e.detail.items;
	    updateItems();
	};

</script>


<div class="catalog">
	<div class="catalog-list">
		
		{#if items.length === 0}
			<span class="zone-tip">Create new playlist</span>
		{:else}
			<section
		        class="catalog-zone"
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

	.catalog {
		height: 100%;
		width: -webkit-fill-available;
		display: flex;
		align-items: stretch;
		justify-content: start;
		flex-direction: column;
		overflow-y: scroll;
	}

	.catalog-list {
		position: relative;
    	height: 100%;
		display: flex;
		flex-direction: column;
	}

	.catalog-zone {
		display: flex;
		flex-direction: column;
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
	    font-size: 48px;
	    font-weight: 100;
		z-index: -1;
	}


</style>