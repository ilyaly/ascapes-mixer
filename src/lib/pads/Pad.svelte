<script>
  import { v4 as uuidv4 } from 'uuid';

  import {
    exists,
    readFile,
    remove,
    BaseDirectory,
  } from "@tauri-apps/plugin-fs";
  import { getContext } from "svelte";

  import PlayIcon from "../icons/PlayIcon.svelte";
  import PauseIcon from "../icons/PauseIcon.svelte";
  import DeleteIcon from "../icons/DeleteIcon.svelte";

  let { openedPlaylistData, item, masterVolume } = $props();

  let playlistsContext = getContext("playlists");
  let playbackContext = getContext("playback");
  let openedPlaylistContext = getContext("openedPlaylist");
  let notificationsContext = getContext("notifications");

  let name = $state($state.snapshot(item.name));

  let isReady = $state(false);
  let isPlaying = $state(false);
  let url = $state(null);
  let currentTime = $state(0);
  let currentVolume = $state(masterVolume);
  let duration = $state(0);

  let audioRef = $state(null);

  $effect(() => {
    if (masterVolume) {
      currentVolume = masterVolume;
    }
  })

  $effect(async () => {
    if (isPlaying && !isReady) {
      try {
        let objectURL = await readFileFromDisk(
          $state.snapshot(item.path)
        );
        url = objectURL;
        isReady = true;
        playlistsContext.setPlaylistTrackAvailable(openedPlaylistData.id, item.id, true)
      } catch (error) {
        isReady = false;
        isPlaying = false;
        playlistsContext.setPlaylistTrackAvailable(openedPlaylistData.id, item.id, false)
        addFileUnavailableNotification(item);
      }
    }
  });

  $effect(() => {
    if (isPlaying && isReady) {
      audioRef.play();
    }
  });


  function addFileUnavailableNotification(track) {
    let tempNotifications = $state.snapshot(notificationsContext.getNotifications());
    tempNotifications.push(
      {
        id: uuidv4(),
        text: `File associated with the "${name}" track  is unavailable. Please delete the track and re-import it.`
      } 
    )
    notificationsContext.setNotifications(tempNotifications);
  }

  async function readFileFromDisk(path) {
    const contents = await readFile(path, {
      baseDir: BaseDirectory.AppLocalData,
    });
    const audioBlob = new Blob([contents], { type: "audio/mpeg" });
    const objectURL = URL.createObjectURL(audioBlob);

    return objectURL;
  }

  function handlePlaybackEnded() {
    isPlaying = false;
    currentTime = 0;
  }

  function handlePlay() {
    isPlaying = true;
  }

  function handlePause() {
    isPlaying = false;
    audioRef.pause();
    currentTime = 0.0;
  }

  function handleNameChange() {
    playlistsContext.setPlaylistTrackName(
      playlistId,
      item.id,
      item.name
    )
  }

  async function handleDelete() {
    let openedPlaylistId = $state.snapshot(openedPlaylistContext.getOpenedPlaylistId());

    let tempPlaylist =  $state.snapshot(playlistsContext.getPlaylist(openedPlaylistId));

    let tempTracks = tempPlaylist.tracks;

    tempTracks = tempTracks.filter((track) => track.id !== item.id);

    for (let i = 0; i < tempTracks.length; i++) {
      tempTracks[i].index = i;
    }

    playlistsContext.setPlaylistTracks(openedPlaylistId, tempTracks)
    playlistsContext.setPlaylistQuantity(openedPlaylistId, tempTracks.length);

    await remove(item.path, { baseDir: BaseDirectory.AppLocalData });
  }
</script>

<div class="pad {item.available ? '': 'error'}">
  <div class="pad-playback">
    {#if item.available}
      {#if !isPlaying}
        <button class="button play-button" onclick={handlePlay}>
          <PlayIcon size={50} />
        </button>
      {:else}
        <button class="button pause-button" onclick={handlePause}>
          <PauseIcon size={50}/>
        </button>
      {/if}
    {/if} 
  </div>
  <div class="pad-info">
    <div class="pad-name">
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
        disabled={!item.available}
      />
      {#if !item.available}
        <span class="pad-error">file&nbspunavailable</span>
      {/if}
    </div>
    
    <button class="button delete-button" onclick={handleDelete}>
      <DeleteIcon />
    </button>
  </div>
  <div 
    class="progress" 
    style:width="{(currentTime / duration) * 100}%"
  >
  </div>
  {#if item.available && url}
    <audio
      src={url}
      bind:this={audioRef}
      bind:currentTime
      bind:duration
      bind:volume={currentVolume}
      onended={handlePlaybackEnded}
    >
    </audio>
  {/if}
</div>

<style>
  .pad {
    display: flex;
    justify-content: center;
    align-content: center;
    position: relative;
    border: 1px solid #0000004d;
    border-radius: 8px; 
    padding: 16px;
  }

  .pad:hover {
    background-color: #ffffff;
  }

  .pad-playback {
    display: flex;
    justify-content: center;
    min-height: 90px;
  }

  .pad-info {
    display: flex;
    flex-direction: row;
  }

  .pad-name {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .pad-error {
    font-size: 12px;
    font-style: italic;
    color: #fff;
    background: rgba(255, 0, 0, 0.50);
    padding: 4px;
    border-radius: 5px;
    position: absolute;
    top: 0px;
    right: 0px;
    margin: 4px;
  }

  .error input {
    color: grey;
  }


  /* Progress bar */
  .progress {
    position: absolute;
    bottom: 0;
    left: 0;
    height: -webkit-fill-available;
    border-radius: 8px;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0.2) 0%,
      rgba(33, 150, 243, 0.2) 0%
    );
    z-index: 1; /* Add this line to explicitly set a low z-index */
    box-sizing: border-box;
  }

  .button {
    background: none;
    border: none;
    position: relative; /* Add this line */
    z-index: 2; /* Add this line to ensure buttons are above the progress bar */
  }

  .sample-button {
    width: 100%;
    background: none;
    height: 128px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 8px;

  }

  .pad:hover .delete-button {
    visibility: visible;
  }

  .delete-button {
    visibility: hidden;
    background: none;
    border: none;
  }

  .disabled {
    cursor: not-allowed;
    background-color: grey;
  }

  .playing {
    background-color: red;
  }

  .sample-button:hover {
    cursor: pointer;
    background-color: #0088ff1a;
  }

  .delete-button:hover {
    cursor: pointer;
    fill: red;
  }

  button:hover {
    cursor: pointer;
    fill: rgb(33 150 243 / 100%);
  }

  input {
    text-overflow: ellipsis;
    width: 100% /*-webkit-fill-available*/;
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
    /*width: -webkit-fill-available;*/
    border: 0px solid blue; /* Green border on focus */
    background-color: #fff;
    border-radius: 4px;
    outline: none; /* Remove default outline */
  }
</style>
