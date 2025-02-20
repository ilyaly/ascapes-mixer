<script>
  import { getContext } from "svelte";
  import PlayIcon from "../icons/PlayIcon.svelte";
  import PauseIcon from "../icons/PauseIcon.svelte";
  import StopIcon from "../icons/StopIcon.svelte";
  import BackIcon from "../icons/BackIcon.svelte";
  import ForwardIcon from "../icons/ForwardIcon.svelte";

  import ShuffleIcon from "../icons/ShuffleIcon.svelte";
  import LoopIcon from "../icons/LoopIcon.svelte";

  let playlist = getContext("playlist");
  let currentTrack = getContext("currentTrack");
  let playback = getContext("playback");
  let playbackMode = getContext("playbackMode");

  function handlePlay() {
    playback.setPlaybackPlaying(true);
  }

  function handlePause() {
    playback.setPlaybackPlaying(false);
  }

  function handleBack() {
    let currentTrackIndex = $state.snapshot(
      currentTrack.getCurrentTrackIndex(),
    );

    let previousTrackIndex = currentTrackIndex - 1;

    let currentPlaylist = $state.snapshot(playlist.getPlaylist());

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
      currentTrack.setCurrentTrack(nextTrack);
    }
  }

  function handleForward() {
    let currentTrackIndex = $state.snapshot(
      currentTrack.getCurrentTrackIndex(),
    );

    let nextTrackIndex = currentTrackIndex + 1;

    let currentPlaylist = $state.snapshot(playlist.getPlaylist());

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
      currentTrack.setCurrentTrack(nextTrack);
    }
  }

  function handleLoop() {
    if (!playbackMode.getPlaybackModeIsRepeat()) {
      playbackMode.setPlaybackModeIsRepeat(true);
    } else {
      playbackMode.setPlaybackModeIsRepeat(false);
    }
  }

  function handleShuffle() {
    if (!playbackMode.getPlaybackModeIsShuffle()) {
      playbackMode.setPlaybackModeIsShuffle(true);
    } else {
      playbackMode.setPlaybackModeIsShuffle(false);
    }
  }
</script>

<div class="playback-controls">
  <button
    class="shuffle-button {playbackMode.getPlaybackModeIsShuffle()
      ? 'shuffle-active'
      : ''}"
    onclick={handleShuffle}
  >
    <ShuffleIcon />
  </button>
  <button class="back-button" onclick={handleBack}>
    <BackIcon />
  </button>
  {#if !playback.getPlayback().isPlaying}
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
    class="loop-button {playbackMode.getPlaybackModeIsRepeat()
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
