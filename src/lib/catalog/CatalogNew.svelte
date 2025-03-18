<script>
	import { v4 as uuidv4 } from 'uuid';

	import { getContext } from "svelte";

	import NewListIcon from "../icons/NewListIcon.svelte"

	let { label } = $props()

	let playlistsState = getContext("playlists");


	const emojis = [
	    // Music
	    "🎵", "🎼", "🎤", "🎸", "🎧", "🎹", "🎻", "🎺", "🎷", "🥁",
	    "🪕", "🪘", "🎙️", "🎛️", "🎚️", "🎭", "🪇", "🎮", "📻", "🔉",
	    "📯", "🪗", "🪈", "🎨", "🎬", "🎪", "🎟️", "🪩", "🎝", "🎞️",
	    
	    // Ambient
	    "🌿", "🌄", "🌙", "🍃", "🌅", "🌈", "🌾", "🌺", "🌬️", "🍂", 
	    "🌊", "🌲", "🪷", "🌦️", "🌧️", "☁️", "🪨", "🔥", "❄️", "⛰️",
	    "🏞️", "🌃", "🏙️", "🌌", "🦗", "🦢", "🐋", "🪶", "☔", "🌇",
	    
	    // SFX
	    "🔊", "🎶", "💥", "📢", "🔔", "🎚️", "💡", "🎯", "🎛️", "⚡",
	    "🔈", "📣", "🚨", "💫", "✨", "💨", "📱", "⏰", "🔨", "👣",
	    "🚿", "🌩️", "🔥", "💦", "🎭", "🚪", "📞", "🔗", "🎮", "🔮"
	];

	function getRandomFromArray(array) {
	  const randomIndex = Math.floor(Math.random() * array.length);
	  return array[randomIndex];
	}

	function handleClick() {
		let playlistsSnapshot = $state.snapshot(playlistsState.getPlaylists());
		let uuid = uuidv4();
		playlistsSnapshot.push(
			{
				id: uuid,
				index: null,
				name: `${getRandomFromArray(emojis)} playlist ${playlistsSnapshot.length}`,
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