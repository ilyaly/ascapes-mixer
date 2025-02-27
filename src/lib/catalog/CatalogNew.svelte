<script>
	import { getContext } from "svelte";

	import NewListIcon from "../icons/NewListIcon.svelte"

	let playlistsState = getContext("playlists");

	function handleClick() {
		let playlistsSnapshot = $state.snapshot(playlistsState.getPlaylists());
		playlistsSnapshot.push(
			{
				id: crypto.randomUUID(),
				name: `Playlist ${playlistsSnapshot.length}`,
				description: "",
				quantity: 0,
				tracks: [],
				isActive: false
			}
		);
		for (let i = 0; i < playlistsSnapshot.length; i++) {
	      playlistsSnapshot[i].index = i;
	    }
	    console.log(playlistsSnapshot)
		playlistsState.setPlaylists(playlistsSnapshot)
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