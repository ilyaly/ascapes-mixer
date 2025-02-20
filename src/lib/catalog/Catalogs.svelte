<script>
	import CatalogsHeader from "./CatalogsHeader.svelte"
	import CatalogItem from "./CatalogItem.svelte"


	const items = $state([
		{
			"name" : "SampleCatalogName1",
			"quantity" : 10
		},
		{
			"name" : "SampleCatalogName2",
			"quantity" : 5
		},
		{
			"name" : "SampleCatalogName3",
			"quantity" : 99
		},
		{
			"name" : "SampleCatalogName4",
			"quantity" : 199
		},
		{
			"name" : "SampleCatalogName5",
			"quantity" : 999
		}
	])

	function handleOnAddNew() {
		items.push(
			{
			"name" : "SampleCatalogNameX",
				"quantity" : 999999
			}
		)
	}
</script>


<div class="catalogs">
	<CatalogsHeader
		label="Music playlists"
		onAddNew={handleOnAddNew}
	/>
	<div class="catalogs-list">
		{#each items as item, i}
			<CatalogItem 
				item={item}
			/>
		{/each}
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
		display: flex;
		flex-direction: column;
	}


</style>