<script>
  import { getContext } from "svelte";
  import { remove, BaseDirectory } from "@tauri-apps/plugin-fs";

  import { flip } from "svelte/animate";

  import PlayIcon from "../icons/PlayIcon.svelte";
  import PauseIcon from "../icons/PauseIcon.svelte";
  import DeleteIcon from "../icons/DeleteIcon.svelte";

  let { item } = $props();

  let name = $state($state.snapshot(item.name));

  let isCurrentTrack = $state(false);
  let isFocus = $state(false);

  let activePlaylistState = getContext("activePlaylist");
  let currentTrackState = getContext("currentTrack");
  let playbackState = getContext("playback");

  $effect(() => {
    if (currentTrackState.getCurrentTrack().id === item.id) {
      isCurrentTrack = true;
    } else {
      isCurrentTrack = false;
    }
  });

  $effect(() => {
    if (item.index) {
      if (isCurrentTrack) {
        currentTrackState.setCurrentTrackIndex(item.index);
      }
    }
  })

  function handleNameChange() {
    activePlaylistState.setActivePlaylistTrack({
      id: item.id,
      index: item.index,
      name: name,
      path: item.path,
      url: item.url,
    });

    if (isCurrentTrack) {
      currentTrackState.setCurrentTrackName(name);
    }
  }

  function handlePlay() {
    currentTrackState.setCurrentTrack({
      id: item.id,
      index: item.index,
      name: item.name,
      path: item.path,
      url: item.url,
    });

    playbackState.setPlaybackPlaying(true);
    
  }

  function handlePause() {
    currentTrackState.setCurrentTrack({
      id: item.id,
      index: item.index,
      name: item.name,
      path: item.path,
      url: item.url,
    });

    playbackState.setPlaybackPlaying(false);
  }

  async function handleDelete() {
    let playlist = $state.snapshot(activePlaylistState.getActivePlaylist());
    let tempItems = playlist.tracks;

    tempItems = tempItems.filter((track) => track.id !== item.id);

    for (let i = 0; i < tempItems.length; i++) {
      tempItems[i].index = i;
    }

    console.log(tempItems)

    activePlaylistState.setActivePlaylist({
        id: playlist.id,
        name: playlist.name,
        description: playlist.description,
        index: playlist.index,
        isActive: playlist.isActive,
        quantity: tempItems.length,
        tracks: tempItems
    });

    playbackState.setPlaybackPlaying(false);

    await remove(item.path, { baseDir: BaseDirectory.AppLocalData });
  }
</script>

<div
  class="playlist-item {isCurrentTrack ? 'active' : ''}"
>
  <div class="playlist-item-info">
    {#if !isCurrentTrack || !playbackState.getPlayback().isPlaying}
      <button class="button play-button" onclick={handlePlay}>
        <PlayIcon />
      </button>
    {:else}
      <button class="button pause-button" onclick={handlePause}>
        <PauseIcon />
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
        placeholder={name}
        bind:value={name}
        onchange={handleNameChange}
        onmouseleave={() => {
          isFocus = false;
        }}
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
    width: -webkit-fill-available;
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
    background-color: #0000000d;
  }

  .active {
    background-color: #0000001a;
  }

  .playlist-item-info {
    width: -webkit-fill-available;
    display: flex;
    flex-direction: row;
    gap: 8px;
  }

  .active {
    background-color: #0000001a;
  }

  .playlist-item-meta {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 8px;
    width: -webkit-fill-available;
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

  .button {
    width: 48px;
    height: 48px;

    display: flex;
    align-items: center;
    justify-content: center;

    background: none;
    border: none;
  }

  .button:hover {
    cursor: pointer;
    fill: rgb(33 150 243 / 100%);
  }

  .delete-button {
    cursor: pointer;
  }

  .delete-button:hover {
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
