<script>
	import { getContext } from "svelte";

	import NewListIcon from "../icons/NewListIcon.svelte"

	let { label } = $props()

	let playlistsState = getContext("playlists");

	function handleClick() {
		let playlistsSnapshot = $state.snapshot(playlistsState.getPlaylists());
		playlistsSnapshot.push(
			{
				id: crypto.randomUUID(),
				index: null,
				name: `${$state.snapshot(label)} playlist ${playlistsSnapshot.length}`,
				description: "",
				quantity: 0,
				tracks: [],
				isActive: false
			}
		);
		for (let i = 0; i < playlistsSnapshot.length; i++) {
	      playlistsSnapshot[i].index = i;
	    }
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