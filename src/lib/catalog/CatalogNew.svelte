<script>
	import { getContext } from "svelte";

	import NewListIcon from "../icons/NewListIcon.svelte"

	let catalog = getContext("catalog");

	function handleClick() {
		let catalogPlaylistsSnapshot = $state.snapshot(catalog.getCatalogPlaylists());
		catalogPlaylistsSnapshot.push(
			{
				id: crypto.randomUUID(),
				name: `Playlist ${catalogPlaylistsSnapshot.length}`,
				description: "",
				quantity: 0,
				tracks: [],
				isActive: false
			}
		);
		for (let i = 0; i < catalogPlaylistsSnapshot.length; i++) {
	      catalogPlaylistsSnapshot[i].index = i;
	    }
		catalog.setCatalogPlaylists(catalogPlaylistsSnapshot)
	}
</script>


<button
	onclick={handleClick}
>
	<NewListIcon />
</button>

<style>
	button {
		margin: 0;
		padding: 0;
		background: none;
		border: none;
	}

	button:hover {
	    cursor: pointer;
		fill: rgb(33 150 243 / 100%);
	}
</style>