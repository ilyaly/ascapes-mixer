<script>
  import { onMount } from "svelte";
  import { setContext, getContext } from "svelte";

  import OneShotPlayerHeader from "./OneShotPlayerHeader.svelte";
  import PadsGrid from "../pads/PadsGrid.svelte";

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

  let playbackState = $state({
    volume: 0
  });

  setContext("playback", {
    getPlaybackVolume() {
      return playbackState.volume;
    },
    setPlaybackVolume(volume) {
      playbackState.volume = volume;
    }
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

<div class="one-shot-player">
  <div class="helpers">
    <OneShotPlayerHeader {label} />
    <!--
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
		-->
  </div>

  <PadsGrid />
</div>

<style>
  .one-shot-player {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .helpers {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
  }
</style>
