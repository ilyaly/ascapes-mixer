<script>
	import { onMount } from "svelte";
  	import { setContext, getContext } from "svelte";

	import CatalogItem from "./CatalogItem.svelte"
	import CatalogNew from "../catalog/CatalogNew.svelte"

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
	    console.log(items)

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
			<div class="catalog-empty-tip">
				<span>Create new playlist</span>
				<CatalogNew />
			</div>
			
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
		scrollbar-width: none; /* For Firefox */
    	-ms-overflow-style: none;  /* For Internet Explorer and Edge */
	}

	/* For WebKit browsers (Chrome, Safari) */
	.catalog::-webkit-scrollbar {
		display: none;
	}


	.catalog-list {
		position: relative;
    	height: 100%;
    	width: 100%;
		display: flex;
		flex-direction: row;
	}

	.catalog-zone {
		display: flex;
	    flex-direction: row;
	    gap: 16px;
	    width: 100%;
	    flex-wrap: wrap;
	    align-content: flex-start;
	    justify-content: center;
	}

	.catalog-empty-tip {
		display: flex;
		flex-direction: column;
		gap: 8px;
	    width: 100%; /* Changed from -webkit-fill-available */
	    justify-content: center;
	    align-items: center;
	    position: absolute;
	    top: 50%;
	    left: 50%;
	    transform: translate(-50%, -50%);
	    /*pointer-events: none;  Allow clicks to pass through */
	    color: rgb(0 0 0 / 20%);
	    font-size: 32px;
	    font-weight: 200;
	}


</style>