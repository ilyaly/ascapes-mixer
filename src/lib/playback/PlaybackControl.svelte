<script>
  import { getContext } from "svelte";
  import PlayIcon from "../icons/PlayIcon.svelte";
  import PauseIcon from "../icons/PauseIcon.svelte";
  import StopIcon from "../icons/StopIcon.svelte";
  import BackIcon from "../icons/BackIcon.svelte";
  import ForwardIcon from "../icons/ForwardIcon.svelte";

  import ShuffleIcon from "../icons/ShuffleIcon.svelte";
  import LoopIcon from "../icons/LoopIcon.svelte";

  let activePlaylistState = getContext("activePlaylist");
  let currentTrackState = getContext("currentTrack");
  let playbackState = getContext("playback");
  let playbackModeState = getContext("playbackMode");

  function handlePlay() {
    playbackState.setPlaybackPlaying(true);
  }

  function handlePause() {
    playbackState.setPlaybackPlaying(false);
  }

  function handleBack() {
    let currentTrackIndex = $state.snapshot(
      currentTrackState.getCurrentTrackIndex(),
    );

    let previousTrackIndex = currentTrackIndex - 1;

    let currentPlaylist = $state.snapshot(activePlaylistState.getActivePlaylist()).tracks;

    let nextTrack;

    if (previousTrackIndex === -1) {
      nextTrack = currentPlaylist.find(
        (obj) => obj.index === currentPlaylist.length - 1,
      );
    } else {
      nextTrack = currentPlaylist.find(
        (obj) => obj.index === currentTrackIndex - 1,
      );
    }

    if (nextTrack) {
      currentTrackState.setCurrentTrack(nextTrack);
    }
  }

  function handleForward() {
    let currentTrackIndex = currentTrackState.getCurrentTrackIndex();

    let nextTrackIndex = currentTrackIndex + 1;

    let currentPlaylist = $state.snapshot(activePlaylistState.getActivePlaylist()).tracks;

    let currentPlaylistLength = currentPlaylist.length;

    let nextTrack;

    if (nextTrackIndex === currentPlaylist.length) {
      nextTrack = currentPlaylist.find((obj) => obj.index === 0);
    } else {
      nextTrack = currentPlaylist.find(
        (obj) => obj.index === currentTrackIndex + 1,
      );
    }

    if (nextTrack) {
      currentTrackState.setCurrentTrack(nextTrack);
    }
  }

  function handleLoop() {
    if (!playbackModeState.getPlaybackModeIsRepeat()) {
      playbackModeState.setPlaybackModeIsRepeat(true);
    } else {
      playbackModeState.setPlaybackModeIsRepeat(false);
    }
  }

  function handleShuffle() {
    if (!playbackModeState.getPlaybackModeIsShuffle()) {
      playbackModeState.setPlaybackModeIsShuffle(true);
    } else {
      playbackModeState.setPlaybackModeIsShuffle(false);
    }
  }
</script>

<div class="playback-controls">
  <button
    class="shuffle-button {playbackModeState.getPlaybackModeIsShuffle()
      ? 'shuffle-active'
      : ''}"
    onclick={handleShuffle}
  >
    <ShuffleIcon />
  </button>
  <button class="back-button" onclick={handleBack}>
    <BackIcon />
  </button>
  {#if !playbackState.getPlayback().isPlaying}
    <button class="play-button" onclick={handlePlay}>
      <PlayIcon />
    </button>
  {:else}
    <button class="pause-button" onclick={handlePause}>
      <PauseIcon />
    </button>
  {/if}
  <button class="forward-icon" onclick={handleForward}>
    <ForwardIcon />
  </button>

  <button
    class="loop-button {playbackModeState.getPlaybackModeIsRepeat()
      ? 'loop-active'
      : ''}"
    onclick={handleLoop}
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

  .shuffle-active {
    fill: blue;
  }

  .loop-active {
    fill: blue;
  }

  .disabled {
    color: grey;
    cursor: not-allowed;
  }
</style>
