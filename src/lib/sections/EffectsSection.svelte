<script>
	import { onMount } from "svelte";
  	import { setContext, getContext } from "svelte";

  	import Catalog from "../catalog/Catalog.svelte";
  	import OneShotPlayer from "../oneshot/OneShotPlayer.svelte";

	let { label, dbName, dbState, storeName } = $props();

	let sectionState = $state({
		hasActiveCatalog: false,
		activeCatalogId: null,
		activeCatalogName: null
	});

	setContext("section", {
		getSectionState() {
			return sectionState;
		},
		setSectionState(state) {
			sectionState = state;
		},
	    getActiveCatalogId() {
	    	return sectionState.activeCatalogId;
	    },
	    setActiveCatalogId(id) {
	    	sectionState.activeCatalogId = id;
		},
		getActiveCatalogName() {
	    	return sectionState.activeCatalogName;
	    },
	    setActiveCatalogName(name) {
	    	sectionState.activeCatalogName = name;
		}
	});

</script>

<div>
	{#if !sectionState.hasActiveCatalog}
      <Catalog
        label={label}
        {dbName}
        {dbState}
        storeName={storeName}
      />
    {:else}
      <OneShotPlayer
        label={sectionState.activeCatalogName}
        {dbName}
        {dbState}
        storeName={storeName}
      />
    {/if}
</div>

<style>
	
</style>