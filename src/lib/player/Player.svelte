<script>
  import { onMount } from "svelte";
  import { setContext, getContext } from "svelte";
  import Playlist from "../playlist/Playlist.svelte";
  import Playback from "../playback/Playback.svelte";

  let { openedPlaylist, openedPlaylistData } = $props();

  
</script>

<div class="player">
  <div class="playlist-container">
    <Playlist
      openedPlaylist={openedPlaylist}
      openedPlaylistData={openedPlaylistData}
    />
  </div>
  <div class="playback-container">
    
  </div>
</div>

<style>
  .player {
    display: flex;
    flex-direction: column;
    height: 100%;
    max-height: 100%;
    overflow: hidden; /* Prevent scrolling */
    box-sizing: border-box;
  }
  
  .playlist-container {
    flex: 1; /* Take up available space */
    min-height: 0; /* Allow flex container to shrink below content size */
    overflow: auto; /* Add scrolling to playlist only */
  }
  
  .playback-container {
    flex-shrink: 0; /* Prevent playback from shrinking */
  }
</style>