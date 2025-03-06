<script>
	import { onMount } from "svelte";
  import { setContext, getContext } from "svelte";

  import Catalog from "../catalog/Catalog.svelte";
  import CatalogNew from "../catalog/CatalogNew.svelte"
  import Player from "../player/Player.svelte";
  import OneShotPlayer from "../oneshot/OneShotPlayer.svelte";
  import Playback from "../playback/Playback.svelte";
  import OpenListIcon from "../icons/OpenListIcon.svelte"

  import {
	    registerStore,
	    writeData,
	    readData,
	    deleteData,
			clearStore,
	} from "../utils/indexeddb.js";

	let { label, type, dbName, storeName } = $props();

	let isReady = $state(false);

	let playlists = $state([]);

	onMount(async () => {
		let tempPlaylists = await readData(dbName, storeName);
		tempPlaylists = tempPlaylists.sort(
			(a, b) => a.index - b.index,
		);
		playlists = tempPlaylists;
		isReady = true;
	})
	
	setContext("playlists", {
	    getPlaylists() {
	    	return playlists;
	    },
	    setPlaylists(items) {
	    	playlists = items;
	    },
	    getPlaylist(playlistId) {
	    	return playlists.find(({ id }) => id === playlistId);
	    },
	    setPlaylist(updatedPlaylist) {
	    	playlists = items.map(playlist => 
				  playlist.id === updatedPlaylist.id ? updatedPlaylist : playlist
				);
	    },
	    setPlaylistIndex(playlistId, updatedIndex) {
	    	playlists = playlists.map(item => 
				  item.id === playlistId ? { ...item, index: updatedIndex } : item
				);
	    },
	    setPlaylistName(playlistId, updatedName) {
	    	playlists = playlists.map(item => 
				  item.id === playlistId ? { ...item, name: updatedName } : item
				);
	    },
	    setPlaylistDescription(playlistId, updatedDescription) {
	    	playlists = playlists.map(item => 
				  item.id === playlistId ? { ...item, description: updatedDescription } : item
				);
	    },
	    setPlaylistQuantity(playlistId, updatedQuantity) {
	    	playlists = playlists.map(item => 
				  item.id === playlistId ? { ...item, quantity: updatedQuantity } : item
				);
	    },
	    setPlaylistTracks(playlistId, updatedTracks) {
	    	playlists = playlists.map(item => 
				  item.id === playlistId ? { ...item, tracks: updatedTracks } : item
				);
	    },
	    setPlaylistIsOpened(playlistId, updatedIsOpened) {
	    	playlists = playlists.map(item => 
				  item.id === playlistId ? { ...item, isOpened: updatedIsOpened } : item
				);
	    },
	    setPlaylistIsActive(playlistId, updatedIsActive) {
	    	playlists = playlists.map(item => 
				  item.id === playlistId ? { ...item, isActive: updatedIsActive } : item
				);
	    },
	    getPlaylistTrack(playlistId, trackId) {
	    	let playlist = playlists.find(({ id }) => id === playlistId);
	    	return playlist.find(({ id }) => id === trackId);
	    },
	    setPlaylistTrack(playlistsId, updatedTrack) {
	    	let playlist = playlists.find(({ id }) => id === playlistId);
	    	playlist.tracks = items.map(item => 
				  item.id === updatedTrack.id ? updatedTrack : item
				);
	    },
	    getPlaylistTrackIndex(playlistId, trackId) {
	    	let playlist = playlists.find(({ id }) => id === playlistId);
	    	return playlist.find(({ id }) => id === trackId).index;
	    },
	    setPlaylistTrackIndex(playlistId, trackId, updatedIndex) {
	    	let playlist = playlists.find(({ id }) => id === playlistId);

	    	playlist.tracks = playlists.map(item => 
				  item.id === trackId ? { ...item, index: updatedIndex } : item
				);
	    },
	    getPlaylistTrackName(playlistId, trackId) {
	    	let playlist = playlists.find(({ id }) => id === playlistId);
	    	return playlist.find(({ id }) => id === trackId).name;
	    },
	    setPlaylistTrackName(playlistId, trackId, updatedName) {
	    	let playlist = playlists.find(({ id }) => id === playlistId);

	    	playlist.tracks = playlists.map(item => 
				  item.id === trackId ? { ...item, name: updatedName } : item
				);
	    },
	    getPlaylistTrackPath(playlistId, trackId) {
	    	let playlist = playlists.find(({ id }) => id === playlistId);
	    	return playlist.find(({ id }) => id === trackId).path;
	    },
	    setPlaylistTrackPath(playlistId, trackId, updatedPath) {
	    	let playlist = playlists.find(({ id }) => id === playlistId);

	    	playlist.tracks = playlists.map(item => 
				  item.id === trackId ? { ...item, path: updatedPath } : item
				);
	    },
	    getPlaylistTrackUrl(playlistId, trackId) {
	    	let playlist = playlists.find(({ id }) => id === playlistId);
	    	return playlist.find(({ id }) => id === trackId).url;
	    },
	    setPlaylistTrackUrl(playlistId, trackId, updatedUrl) {
	    	let playlist = playlists.find(({ id }) => id === playlistId);

	    	playlist.tracks = playlists.map(item => 
				  item.id === trackId ? { ...item, url: updatedUrl } : item
				);
	    }
	});

	let openedPlaylist = $state({
		id: null,
		name: null
	});

	setContext("openedPlaylist", {
	    getOpenedPlaylist() {
	    	return openedPlaylist;
	    },
	    setOpenedPlaylist(updatedPlaylist) {
	    	openedPlaylist = updatedPlaylist;
	    },
	    getOpenedPlaylistId() {
	    	return openedPlaylist.id;
	    },
	    setOpenedPlaylistId(updatedPlaylistId) {
	    	openedPlaylist.id = updatedPlaylistId;
	    },
	    getOpenedPlaylistName() {
	    	return openedPlaylist.name;
	    },
	    setOpenedPlaylistName(updatedPlaylistName) {
	    	openedPlaylist.name = updatedPlaylistName;
	    }
	});

	let playingPlaylist = $state({
		id: null,
		name: null
	});

	setContext("playingPlaylist", {
	    getPlayingPlaylist() {
	    	return playingPlaylist;
	    },
	    setPlayingPlaylist(updatedPlaylist) {
	    	playingPlaylist = updatedPlaylist;
	    },
	    getPlayingPlaylistId() {
	    	return playingPlaylist.id;
	    },
	    setPlayingPlaylistId(updatedPlaylistId) {
	    	playingPlaylist.id = updatedPlaylistId;
	    },
	    getPlayingPlaylistName() {
	    	return playingPlaylist.name;
	    },
	    setPlayingPlaylistName(updatedPlaylistName) {
	    	playingPlaylist.name = updatedPlaylistName;
	    }
	});

	let playingTrack = $state({
		id: null,
		index:null,
		name: null,
		path: null,
		url: null,
		isReady: false
	});

	setContext("playingTrack", {
	    getPlayingTrack() {
	    	return playingTrack;
	    },
	    setPlayingTrack(updatedTrack) {
	    	playingTrack = updatedTrack;
	    },
	    getPlayingTrackId() {
	    	return playingTrack.id;
	    },
	    setPlayingTrackId(updatedTrackId) {
	    	playingTrack.id = updatedTrackId;
	    },
	    getPlayingTrackIndex() {
	    	return playingTrack.index;
	    },
	    setPlayingTrackIndex(updatedTrackIndex) {
	    	playingTrack.index = updatedTrackIndex;
	    },
	    getPlayingTrackName() {
	    	return playingTrack.name;
	    },
	    setPlayingTrackName(updatedTrackName) {
	    	playingTrack.name = updatedTrackName;
	    },
	    getPlayingTrackPath() {
	    	return playingTrack.path;
	    },
	    setPlayingTrackPath(updatedTrackPath) {
	    	playingTrack.path = updatedTrackPath;
	    },
	    getPlayingTrackUrl() {
	    	return playingTrack.url;
	    },
	    setPlayingTrackUrl(updatedTrackUrl) {
	    	playingTrack.url = updatedTrackUrl;
	    },
	    getPlayingTrackIsReady() {
	    	return playingTrack.isReady;
	    },
	    setPlayingTrackIsReady(updatedTrackIsReady) {
	    	playingTrack.isReady = updatedTrackIsReady;
	    }
	});


  let playback = $state({
    duration: 0,
    time: 0,
    volume: 0,
    isPlaying: false,
    isShuffle: false,
    isRepeat: false
  });
  
  setContext("playback", {
    getPlayback() {
      return playback;
    },
    setPlayback(updatedPlayback) {
      playback = updatedPlayback;
    },
    getPlaybackDuration() {
      return playback.duration;
    },
    setPlaybackDuration(updatedDuration) {
      playback.duration = updatedDuration;
    },
    getPlaybackTime() {
      return playback.time;
    },
    setPlaybackTime(updatedTime) {
      playback.time = updatedTime;
    },
    getPlaybackVolume() {
      return playback.volume;
    },
    setPlaybackVolume(updatedVolume) {
      playback.volume = updatedVolume;
    },
    getPlaybackIsPlaying() {
      return playback.isPlaying;
    },
    setPlaybackIsPlaying(bool) {
      playback.isPlaying = bool;
    },
    getPlaybackIsShuffle() {
      return playback.isShuffle;
    },
    setPlaybackIsShuffle(bool) {
      playback.isShuffle = bool;
    },
    getPlaybackIsRepeat() {
      return playback.isRepeat;
    },
    setPlaybackIsRepeat(bool) {
      playback.isRepeat = bool;
    }
  });


	$effect(async () => {
	    try {
		      await writeData(
		        dbName,
		        storeName,
		        $state.snapshot(playlists),
		      );
		  } catch (error) {
		    	console.error(`Error writing the tracks to DB: ${error}`);
		  }
	});



</script>

<div class="section">
	<div class="section-header">
		<div class="section-header-label">
		{#if !openedPlaylist.id && !openedPlaylist.name}
		 	{ label }
		{:else}
			<button
		   	class="back-button"
		   	onclick={() => {
		   		openedPlaylist.id = null;
		   		openedPlaylist.name = null;
		   	}}
		  >
		   	{ label } 
			</button>
			<div class="section-header-label-text">
				/ { playlists.find(({ id: playlistId }) => playlistId === openedPlaylist.id).name}
			</div>
		   	
		 {/if}
		</div>
		<div class="section-header-action">
		{#if !openedPlaylist.id && !openedPlaylist.name}
		 	<CatalogNew
		 		label={label}
		  />
		{/if}
		</div>
	</div>
	{#if !openedPlaylist.id && !openedPlaylist.name}
		{#if isReady}
    <Catalog
      playlists={playlists}
      label={label}
    />
    {/if}
  {:else}
  	{#if type === "playlist"}
	    <Player
	    	openedPlaylistData={playlists.find(({ id: playlistId }) => playlistId === openedPlaylist.id)}
	    	currentPlayback={playback}
	    	currentTrack={playingTrack}
    	/>
	  {:else}
	    <OneShotPlayer
	      playlist={playlists.find(({ id: playlistId }) => playlistId === openedPlaylist.id)}
	    />
	  {/if}   
  {/if}
  {#if type === "playlist"}
	  <Playback 
	    currentPlayback={playback}
	   	currentTrack={playingTrack}
	    openedPlaylistData={playlists.find(({ id: playlistId }) => playlistId === openedPlaylist.id)}
	    playingPlaylistData={playlists.find(({ id: playlistId }) => playlistId === playingPlaylist.id)}
		/>
	{/if}
  
</div>

<style>

	.section {
		height: 100%;
    max-height: 100%;
		display: flex;
		flex-direction: column;
		gap: 16px;

	}

	.section-header {
	  display: flex;
    align-items: center;
    gap: 16px;
    padding-block: 0px;
    padding-inline: 16px;
    width: auto;
    border-bottom: 2px solid grey;
    justify-content: space-between;
    min-height: 40px;
    max-height: 40px;
	}

	.section-header-label {
	  font-size: 24px;
	  font-weight: 600;
	  display: flex;
	  align-items: center;

	  overflow: hidden;
	}


	.section-header-label-text {
	  white-space: nowrap;
	  overflow: hidden;
	  text-overflow: ellipsis;
	  min-width: 0; /* Important for text overflow to work in flex containers */
	}

	.section-header-action {

	}

	button {
		background: none;
		border: none;
		margin: 0;
		padding: 0;
	}

	.back-button {
		font-size: 24px;
		font-weight: 600;
		font-style: normal;
		margin: 0;
		padding: 0;
		
	}

	.back-button:hover {
		cursor: pointer;
		color: #2196f3;
	}

	.back-button::before {
		content: "";
	}




	
</style>