<script>
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

  let { playlistId, item, masterVolume } = $props();

  let playlistsContext = getContext("playlists");
  let playbackContext = getContext("playback");

  let name = $state($state.snapshot(item.name));

  let isReady = $state(false);
  let isPlaying = $state(false);
  let url = $state();
  let currentTime = $state(0);
  let currentVolume = $state(masterVolume);
  let duration = $state(0);

  let audioRef;

  $effect(() => {
    if (masterVolume) {
      currentVolume = masterVolume;
    }
  })


  $effect(async () => {
    if (!isReady) {
      try {
        let objectURL = await readFileFromDisk($state.snapshot(item.path));
        url = objectURL;
        isReady = true;
      } catch (error) {
        console.error(`Error reading file fron disk: ${error}`);
      }
    }
  });

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

    audioRef.play();
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
    let openedPlaylistId = openedPlaylistContext.getOpenedPlaylistId();

    let tempPlaylist = playlistsContext.getPlaylist(openedPlaylistId)

    let tempTracks = tempPlaylist.tracks;

    tempTracks = tempTracks.filter((track) => track.id !== item.id);

    for (let i = 0; i < tempTracks.length; i++) {
      tempTracks[i].index = i;
    }

    playlistsContext.setPlaylistTracks(openedPlaylistId, tempTracks)
    /*ToDo
      
      Need to implement playback stop if currently playing track was deleted.

    */

    await remove(item.path, { baseDir: BaseDirectory.AppLocalData });
  }
</script>

<div class="pad">
  <div class="pad-header">
    {#if !isPlaying}
      <button class="button play-button" onclick={handlePlay}>
        <PlayIcon size={50} />
      </button>
    {:else}
      <button class="button pause-button" onclick={handlePause}>
        <PauseIcon size={50}/>
      </button>
    {/if}
  </div>
  <div class="pad-footer">
    <div class="pad-footer-head">
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
      />
      <button class="button delete-button" onclick={handleDelete}>
        <DeleteIcon />
      </button>
    </div>
  </div>
  <div 
    class="progress" 
    style:width="{(currentTime / duration) * 100}%"
  >
  </div>
  {#if url}
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
    position: relative;
    border: 1px solid #0000004d;
    border-radius: 8px; 
  }

  .pad:hover {
    background-color: #f0f0ff;
  }


  .pad-header {

    
    display: flex;
    justify-content: center;
    min-height: 90px;
  }

  .pad-footer {
    display: flex;
    min-height: 80px;
    align-items: flex-start;
  }

  .pad-footer-head {
    display: flex;
    flex-direction: row;
    align-items: center;
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
