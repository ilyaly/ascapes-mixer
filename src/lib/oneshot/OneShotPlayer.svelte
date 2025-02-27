<script>
  import { onMount } from "svelte";
  import { setContext, getContext } from "svelte";

  import PadsGrid from "../pads/PadsGrid.svelte";

  let { playlist } = $props();

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

</script>

<div class="one-shot-player">
  <PadsGrid
    playlist={playlist}
  />
</div>

<style>
  .one-shot-player {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: stretch;
    justify-content: start;
    flex-direction: column;
    overflow: scroll;
    scrollbar-width: none; /* For Firefox */
    -ms-overflow-style: none;  /* For Internet Explorer and Edge */
  }

  /* For WebKit browsers (Chrome, Safari) */
  .one-shot-player::-webkit-scrollbar {
    display: none;
  }
</style>
