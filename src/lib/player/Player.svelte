<script>
  import { onMount } from "svelte";
  import { setContext, getContext } from "svelte";

  import PlayerHeader from "./PlayerHeader.svelte";
  import Playlist from "../playlist/Playlist.svelte";
  import Playback from "../playback/Playback.svelte";

  import {
    registerStore,
    writeData,
    readData,
    deleteData,
    clearStore,
  } from "../utils/indexeddb.js";

  let { label, dbName, dbState, storeName } = $props();

  let playListStoreUuid = crypto.randomUUID();

  let playlistState = $state({
    isReady: false,
    tracks: [],
  });

  let currentTrackState = $state({
    id: null,
    index: null,
    name: null,
    author: null,
    path: null,
  });

  let playbackState = $state({
    url: null,
    duration: 0,
    time: 0,
    volume: 0,
    isReady: false,
    isPlaying: false,
  });

  let playbackModeState = $state({
    isRepeat: false,
    isShuffle: false,
  });

  setContext("playlist", {
    getPlaylistReady() {
      return playbackState.isReady;
    },
    setPlaylistReady(bool) {
      playbackState.isReady = bool;
    },
    getPlaylist() {
      return playlistState.tracks;
    },
    setPlaylist(playlist) {
      playlistState.tracks = playlist;
    },
    getPlaylistTrack(id) {
      return playlistState.tracks.find(({ id }) => id === id);
    },
    setPlaylistTrack(track) {
      playlistState.tracks = playlistState.tracks.map((obj) =>
        obj.id === track.id ? track : obj,
      );
    },
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
      playlistState.tracks = await readData(dbName, storeName);

      playlistState.tracks = playlistState.tracks.sort(
        (a, b) => a.index - b.index,
      );
      playlistState.isReady = true;
    }
  });

  $effect(async () => {
    if (playlistState.isReady) {
      try {
        await writeData(
          dbName,
          storeName,
          $state.snapshot(playlistState.tracks),
        );
      } catch (error) {
        console.error(`Error writing the tracks to DB: ${error}`);
      }
    }
  });

  async function handleWriteDataToDB() {
    try {
        await writeData(
          dbName,
          storeName,
          $state.snapshot(playlistState.tracks),
        );
    } catch (error) {
      console.error(`Error writing the tracks to DB: ${error}`);
    }
  }

  async function handleReadDataFromDB() {
    try {
      const data = await readData(dbName, storeName);
      console.log(`Read data from ${storeName}`);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handlDeleteAllDataFromDB() {
    try {
      await clearStore(dbName, storeName); // Clear all entries from the store
      playlistState.tracks = [];
    } catch (error) {
      console.error(error);
    }
  }
</script>

<div class="player">
  <div class="helpers">
    <PlayerHeader {label} />
    
		<button
			onclick={handleReadDataFromDB}
		>
			Read data from DB
		</button>
		<button
			onclick={handlDeleteAllDataFromDB}
		>
			Delete all data from DB
		</button>
  </div>

  <Playlist />
  <Playback />
</div>

<style>
  .player {
    height: 100%;
    width: -webkit-fill-available;
    display: flex;
    align-items: stretch;
    justify-content: start;
    flex-direction: column;
  }

  .helpers {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
  }
</style>
