<script>
  import { getContext } from "svelte";
  import { remove, BaseDirectory } from "@tauri-apps/plugin-fs";

  import { flip } from "svelte/animate";

  import PlayIcon from "../icons/PlayIcon.svelte";
  import PauseIcon from "../icons/PauseIcon.svelte";
  import DeleteIcon from "../icons/DeleteIcon.svelte";

  let { playlistId, item } = $props();

  let playlistsContext = getContext("playlists");
  let playbackContext = getContext("playback");
  let playingTrackContext = getContext("playingTrack");
  let openedPlaylistContext = getContext("openedPlaylist");
  let playingPlaylistContext = getContext("playingPlaylist");

  let track = $state(
    $state.snapshot(item)
  );

  let isCurrentTrack = $state(track.id === playingTrackContext.getPlayingTrackId());
  let isFocus = $state(false);

  $effect(() => {
    track = $state.snapshot(item);
  });

  $effect(() => {
    isCurrentTrack = track.id === playingTrackContext.getPlayingTrackId();
  });

  function handleNameChange() {
    playlistsContext.setPlaylistTrackName(
      playlistId,
      track.id,
      track.name
    )
  }

  function handlePlay() {
    playingPlaylistContext.setPlayingPlaylistId(
      openedPlaylistContext.getOpenedPlaylistId()
    );

    playingPlaylistContext.setPlayingPlaylistName(
      openedPlaylistContext.getOpenedPlaylistId()
    );
    playingTrackContext.setPlayingTrack($state.snapshot(item));

    playbackContext.setPlaybackIsPlaying(true);
  }

  function handlePause() {
    playbackContext.setPlaybackIsPlaying(false);
  }

  async function handleDelete() {
    let openedPlaylistId = openedPlaylistContext.getOpenedPlaylistId();

    let tempPlaylist = playlistsContext.getPlaylist(openedPlaylistId)

    let tempTracks = tempPlaylist.tracks;

    tempTracks = tempTracks.filter((track) => track.id !== item.id);

    for (let i = 0; i < tempTracks.length; i++) {
      tempTracks[i].index = i;
    }

    playlistsContext.setPlaylistTracks(openedPlaylistId, tempTracks)
    playlistsContext.setPlaylistQuantity(openedPlaylistId, tempTracks.length);
    /*ToDo
      
      Need to implement playback stop if currently playing track was deleted.

    */

    await remove(item.path, { baseDir: BaseDirectory.AppLocalData });
  }

  
</script>


<div
  class="playlist-item {isCurrentTrack ? 'active' : ''}"
>
  <div class="playlist-item-info {item.available ? '': 'error'}">


    {#if !isCurrentTrack || !playbackContext.getPlayback().isPlaying}
      <button 
        class="play-button"
        onclick={handlePlay}
        disabled={!item.available}
      >
      <PlayIcon
        disabled={!item.available}
      />
      </button>
    {:else}
      <button class="pause-button" onclick={handlePause}>
        <PauseIcon
          disabled={!item.available}
      />
      </button>
    {/if}

    

    <div class="playlist-item-meta">
      <input
        type="text"
        name="name"
        required
        minlength="4"
        maxlength="128"
        autocomplete="off"
        placeholder={item.id}
        bind:value={item.name}
        onchange={handleNameChange}
        onmouseleave={() => {
          isFocus = false;
        }}
        disabled={!item.available}
      />
    </div>
  </div>

  <div class="playlist-item-actions">
    <button class="button delete-button" onclick={handleDelete}>
        <DeleteIcon />
      </button>
  </div>
</div>



<style>
  
  .playlist-item {
    width: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 4px;
    background-color: #fff;
    border-radius: 8px;
    margin: 4px;
    padding: 4px;
  }

  .playlist-item:hover {
    background-color: #f0f0ff;
  }

  .playlist-item:hover .delete-button {
    visibility: visible;
  }

  .playlist-item-info {
    width: 100%;;
    display: flex;
    flex-direction: row;
    gap: 8px;
  }

  .active {
    background-color: #f0f0ff80;
  }

  .playlist-item-meta {
    width: 100%;;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 8px;
  }

  .playlist-item-name-container {
    width: 100%;
    height: 24px;
  }
  .playlist-item-track-name {
    font-size: 16px;

    padding-block: 8px;
  }

  .playlist-item-author-name {
    font-size: 14px;
  }

  .playlist-item-actions {
    width: auto;
  }

  .error input {
    color: red;
  }

  button {

    width: 48px;
    height: 48px;

    display: flex;
    align-items: center;
    justify-content: center;

    background: none;
    border: none;
  }

  button:hover {
    cursor: pointer;
    fill: rgb(33 150 243 / 100%);
  }

  .delete-button {
    visibility: hidden;
    cursor: pointer;
  }

  .delete-button:hover {
    fill: red;
  }

  .error button {
    fill: red;
  }

  .error button:hover {
    cursor: not-allowed;
    fill: red;
  }

  input {
    text-overflow: ellipsis;
    width: 50% /*-webkit-fill-available*/;
    margin-block: 4px;
    padding-block: 4px;
    margin-inline: 4px;
    padding-inline: 4px;
    font-size: 16px;
    background: none;
    border: 0px solid grey; /* Green border on focus */
    border-radius: 4px;
    outline: none; /* Remove default outline */
  }

  input:hover {
    /*cursor: default;*/
  }

  input:focus {
    width: -webkit-fill-available;
    border: 0px solid blue; /* Green border on focus */
    background-color: #fff;
    border-radius: 4px;
    outline: none; /* Remove default outline */
  }
</style>
