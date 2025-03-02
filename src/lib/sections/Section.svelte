<script>
	import { onMount } from "svelte";
  import { setContext, getContext } from "svelte";

  import Catalog from "../catalog/Catalog.svelte";
  import CatalogNew from "../catalog/CatalogNew.svelte"
  import Player from "../player/Player.svelte";
  import OneShotPlayer from "../oneshot/OneShotPlayer.svelte";
  import OpenListIcon from "../icons/OpenListIcon.svelte"

  import {
	    registerStore,
	    writeData,
	    readData,
	    deleteData,
			clearStore,
	} from "../utils/indexeddb.js";

	let { label, type, dbName, dbState, storeName } = $props();

	let isReady = $state(false);

	let playlists = $state([]);
	
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
	    	console.log(item)
	    	playlists = playlists.map((obj) =>
	   			obj.id === item.id ? item : obj,
	    	);
	    }
	});

	let activePlaylist =$state(null);

	setContext("activePlaylist", {
		getActivePlaylist() {
			return activePlaylist;
		},
		setActivePlaylist(playlist) {
			activePlaylist = playlist;
			playlist.quantity = playlist.tracks.length;
			playlists = playlists.map((obj) => 
				obj.id === activePlaylist.id ? activePlaylist : obj
			);
		},
		getActivePlaylistTrack(id) {
      return activePlaylist.tracks.find(({ id }) => id === id);
    },
    setActivePlaylistTrack(track) {
    	//Update active playlist tracks
      activePlaylist.tracks = activePlaylist.tracks.map((obj) =>
        obj.id === track.id ? track : obj
      );
      //Update playlists respectively
      playlists = playlists.map((obj) => 
				obj.id === activePlaylist.id ? activePlaylist : obj
			);
    }
	});

	let currentTrackState = $state({
    id: null,
    index: null,
    name: null,
    author: null,
    path: null
  });
  
  setContext("currentTrack", {
    getCurrentTrack() {
      return currentTrackState;
    },
    getCurrentTrackId() {
      return currentTrackState.id;
    },
    getCurrentTrackIndex() {
      return currentTrackState.index;
    },
    getCurrentTrackName() {
      return currentTrackState.name;
    },
    getCurrentTrackAuthor() {
      return currentTrackState.author;
    },
    getCurrentTrackPath() {
      return currentTrackState.path;
    },
    setCurrentTrack(track) {
      currentTrackState = track;
    },
    setCurrentTrackId(id) {
      currentTrackState.id = id;
    },
    setCurrentTrackIndex(index) {
      currentTrackState.index = index;
    },
    setCurrentTrackName(name) {
      currentTrackState.name = name;
    },
    setCurrentTrackAuthor(author) {
      currentTrackState.author = author;
    },
    setCurrentTrackPath(path) {
      currentTrackState.path = path;
    },
  });
  
  let playbackState = $state({
    url: null,
    duration: 0,
    time: 0,
    volume: 0,
    isReady: false,
    isPlaying: false
  });
  
  

  setContext("playback", {
    getPlayback() {
      return playbackState;
    },
    getPlaybackUrl() {
      return playbackState.url;
    },
    getPlaybackDuration() {
      return playbackState.duration;
    },
    getPlaybackTime() {
      return playbackState.time;
    },
    getPlaybackVolume() {
      return playbackState.volume;
    },
    getPlaybackReady() {
      return playbackState.isReady;
    },
    getPlaybackPlaying() {
      return playbackState.isPlaying;
    },
    setPlayback(playback) {
      playbackState = playback;
    },
    setPlaybackUrl(url) {
      playbackState.url = url;
    },
    setPlaybackDuration(duration) {
      playbackState.duration = duration;
    },
    setPlaybackTime(time) {
      playbackState.time = time;
    },
    setPlaybackVolume(volume) {
      playbackState.volume = volume;
    },
    setPlaybackReady(bool) {
      playbackState.isReady = bool;
    },
    setPlaybackPlaying(bool) {
      playbackState.isPlaying = bool;
    },
  });

  let playbackModeState = $state({
    isRepeat: false,
    isShuffle: false
  });
  
  setContext("playbackMode", {
    getPlaybackMode() {
      return playbackModeState;
    },
    getPlaybackModeIsRepeat() {
      return playbackModeState.isRepeat;
    },
    getPlaybackModeIsShuffle() {
      return playbackModeState.isShuffle;
    },
    setPlaybackMode(playbackMode) {
      playbackModeState = playbackMode;
    },
    setPlaybackModeIsRepeat(bool) {
      playbackModeState.isRepeat = bool;
    },
    setPlaybackModeIsShuffle(bool) {
      playbackModeState.isShuffle = bool;
    },
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
		   	class="back-button"
		   	onclick={() => activePlaylist = null}
		  >
		   	{ label } 
			</button>
			<div class="section-header-label-text">
				/ { activePlaylist.name }
			</div>
		   	
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
  	{#if type === "playlist"}
	    <Player
      	playlist={activePlaylist}
    	/>
	  {:else}
	    <OneShotPlayer
	      playlist={activePlaylist}
	    />
	  {/if}
    
  {/if}
</div>

<style>

	.section {
		font-family: "Roboto", serif;
		height: 100%;
    max-height: 100%;
		display: flex;
		flex-direction: column;
		gap: 16px;

	}

	.section-header {
	  display: grid;
	  grid-template-columns: minmax(0, 1fr) auto; /* This is key */
	  gap: 16px;
	  padding-block: 0px;
	  width: 100%;
	}

	.section-header-label {
	  font-size: 32px;
	  font-weight: 600;
	  display: flex;
	  align-items: center;
	  max-width: 70%; /* Reduced from 80% */
	  min-width: 0; /* Critical for flex items with text overflow */
	  overflow: hidden;
	}


	.section-header-label-text {
	  white-space: nowrap;
	  overflow: hidden;
	  text-overflow: ellipsis;
	  min-width: 0; /* Important for text overflow to work in flex containers */
	}

	button {
		background: none;
		border: none;
	}

	.back-button {
		font-size: 32px;
		font-weight: 600;
		
	}

	.back-button:hover {
		cursor: pointer;
		color: #2196f3;
	}

	.back-button::before {
		content: "";
	}




	
</style>