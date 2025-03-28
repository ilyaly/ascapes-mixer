<script>
  import { getContext } from "svelte";
  import PlayIcon from "../icons/PlayIcon.svelte";
  import PauseIcon from "../icons/PauseIcon.svelte";
  import StopIcon from "../icons/StopIcon.svelte";
  import BackIcon from "../icons/BackIcon.svelte";
  import ForwardIcon from "../icons/ForwardIcon.svelte";

  import ShuffleIcon from "../icons/ShuffleIcon.svelte";
  import LoopIcon from "../icons/LoopIcon.svelte";

  let { 
    currentPlayback,
    currentTrack,
    openedPlaylistData,
    playingPlaylistData
  } = $props();

  let playlistsContext = getContext("playlists");
  let playbackContext = getContext("playback");
  let playingTrackContext = getContext("playingTrack");


  function handlePlay() {
    playbackContext.setPlaybackIsPlaying(true);
  }

  function handlePause() {
    playbackContext.setPlaybackIsPlaying(false);
  }

  function handleBack() {
    let nextTrack;
    let tempTracks = $state.snapshot(playingPlaylistData).tracks;

    let currentTrackIndex = $state.snapshot(currentTrack).index;
    let previousTrackIndex = currentTrackIndex - 1;

    const findAvailableTrack = (startIndex) => {
      let index = startIndex;
      while (index >= 0) {
        let track = tempTracks.find((obj) => obj.index === index);
        if (track && track.available) {
          return track;
        }
        index--;
      }
      return undefined;
    };

    if (previousTrackIndex === -1) {
      nextTrack = findAvailableTrack(tempTracks.length - 1);
    } else {
      nextTrack = findAvailableTrack(previousTrackIndex);
    }

    if (nextTrack) {
      playingTrackContext.setPlayingTrack(nextTrack);
    } else {
      playingTrackContext.resetPlayingTrack()
    }
  }

  function handleForward() {
    let nextTrack;
    let tempTracks = $state.snapshot(playingPlaylistData).tracks;
    let currentTrackIndex = $state.snapshot(currentTrack).index;
    let nextTrackIndex = currentTrackIndex + 1;

    const findAvailableTrack = (startIndex) => {
      let index = startIndex;
      while (index < tempTracks.length) {
        let track = tempTracks.find((obj) => obj.index === index);
        if (track && track.available) {
          return track;
        }
        index++;
      }
      return undefined;
    };

    if (nextTrackIndex === tempTracks.length) {
      nextTrack = findAvailableTrack(0);
    } else {
      nextTrack = findAvailableTrack(nextTrackIndex);
    }
    if (nextTrack) {
      playingTrackContext.setPlayingTrack(nextTrack);
    } else {
      playingTrackContext.resetPlayingTrack()
    }
  }


  function handleShuffle() {
    if (!currentPlayback.isShuffle) {
      playbackContext.setPlaybackIsShuffle(true);
    } else {
      playbackContext.setPlaybackIsShuffle(false);
    }
  }

  function handleRepeat() {
    if (!currentPlayback.isRepeat) {
      playbackContext.setPlaybackIsRepeat(true);
    } else {
      playbackContext.setPlaybackIsRepeat(false);
    }
  }

</script>

<div class="playback-controls">
  <button
    class="shuffle-button {currentPlayback.isShuffle
      ? 'active'
      : ''}"
    onclick={handleShuffle}
  >
    <ShuffleIcon />
  </button>
  <button 
    class="back-button {currentTrack.id
      ? ''
      : 'disabled'}"  
    onclick={handleBack}
  >
    <BackIcon />
  </button>
  {#if !currentPlayback.isPlaying}
    <button 
      class="play-button {currentTrack.id
      ? ''
      : 'disabled'}" 
      onclick={handlePlay}
    >
      <PlayIcon />
    </button>
  {:else}
    <button 
      class="pause-button {currentTrack.id
      ? ''
      : 'disabled'}"  
      onclick={handlePause}
    >
      <PauseIcon />
    </button>
  {/if}
  <button 
    class="forward-icon {currentTrack.id
      ? ''
      : 'disabled'}"  
    onclick={handleForward}
  >
    <ForwardIcon />
  </button>

  <button
    class="loop-button {currentPlayback.isRepeat
      ? 'active'
      : ''}"
    onclick={handleRepeat}
  >
    <LoopIcon />
  </button>
</div>

<style>
  .playback-controls {
    display: flex;
    flex-direction: row;
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

  button.disabled {
    pointer-events: none;
    cursor: not-allowed;
    opacity: 0.2;
  }

  button.active {
    fill: rgb(33 150 243 / 100%);
  }
</style>
