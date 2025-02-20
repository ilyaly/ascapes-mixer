<script>
  import {
    exists,
    readFile,
    remove,
    BaseDirectory,
  } from "@tauri-apps/plugin-fs";
  import { getContext } from "svelte";

  import DeleteIcon from "../icons/DeleteIcon.svelte";

  let { item } = $props();

  let playlist = getContext("playlist");

  let name = $state($state.snapshot(item.name));

  let isReady = $state(false);
  let isPlaying = $state(false);
  let url = $state();
  let currentTime = $state(0);
  let currentVolume = $state(1);
  let duration = $state(0);

  let audioRef;

  $effect(async () => {
    if (!isReady) {
      try {
        let objectURL = await readFileFromDisk(item.path);
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

  function handleClick() {
    if (!isPlaying) {
      handlePlay();
    } else {
      handleStop()
    }
  }

  function handlePlay() {
    isPlaying = true;
    audioRef.play();
  }

  function handleStop() {
    isPlaying = false;
    audioRef.pause();
    currentTime = 0.0;
  }

  function handleNameChange() {
    playlist.setPlaylistTrack({
      id: item.id,
      index: item.index,
      name: name,
      path: item.path,
      url: item.url,
    });
  }

  async function handleDelete() {
    let tempItems = $state.snapshot(playlist.getPlaylist());
    tempItems = tempItems.filter((track) => track.id !== item.id);

    for (let i = 0; i < tempItems.length; i++) {
      tempItems[i].index = i;
    }

    await remove(item.path, { baseDir: BaseDirectory.AppLocalData });

    playlist.setPlaylist(tempItems);
  }
</script>

<div class="pad">
  <div class="pad-header">
    <button
      class="button sample-button {isReady ? '' : 'disabled'} {isPlaying
        ? ''
        : ''}"
      onclick={handleClick}
    >
    </button>
    <div 
      class="progress" 
      style:width="{(currentTime / duration) * 100}%"
      onclick={handleClick}
    >
    </div>
  </div>
  <div class="pad-footer">
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
    border: 1px solid #bdbdbd;
    border-radius: 4px;
  }

  .pad:hover .pad-footer {
    background-color: #0000000d;
  }

  .pad-header {
    position: relative; /* Necessary for positioning child elements inside it */
    display: flex;
    background-color: #0088ff1a;
  }

  .pad-footer {
    display: flex;
    flex-direction: row;
    height: 80px;
    align-items: flex-start;
  }

  /* Progress bar */
  .progress {
    position: absolute; /* Position it absolutely within the parent */
    bottom: 0; /* Place it at the bottom of the parent div */
    left: 0; /* Start from the left */
    height: -webkit-fill-available; /* Set the height for the progress bar */
    border-radius: 0px 4px 4px 0px;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0.2) 0%,
      rgba(33, 150, 243, 0.2) 0%
    );
    /*transition: width 0.1s ease-in;  Smooth transition when updating the width */
  }

  .progress:hover {
    cursor: pointer;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0.2) 0%,
      rgba(150, 0, 0, 0.2) 0%
    );
  }

  .button {
    background: none;
    border: none;
  }

  .sample-button {
    width: 100%;
    background: none;
    height: 128px;
    border-radius: 4px;
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
