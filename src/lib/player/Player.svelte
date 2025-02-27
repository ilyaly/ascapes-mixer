<script>
  import { onMount } from "svelte";
  import { setContext, getContext } from "svelte";
  import Playlist from "../playlist/Playlist.svelte";
  import Playback from "../playback/Playback.svelte";
  
  let { playlist } = $props();
  
  let currentTrackState = $state({
    id: null,
    index: null,
    name: null,
    author: null,
    path: null
  });
  
  let playbackState = $state({
    url: null,
    duration: 0,
    time: 0,
    volume: 0,
    isReady: false,
    isPlaying: false
  });
  
  let playbackModeState = $state({
    isRepeat: false,
    isShuffle: false
  });
  
  setContext("currentTrack", {
    getCurrentTrack() {
      return currentTrackState;
    },
    getCurrentTrackId() {
      return currentTrackState.id;
    },
    getCurrentTrackIndex() {
      return currentTrackState.index;
    },
    getCurrentTrackName() {
      return currentTrackState.name;
    },
    getCurrentTrackAuthor() {
      return currentTrackState.author;
    },
    getCurrentTrackPath() {
      return currentTrackState.path;
    },
    setCurrentTrack(track) {
      currentTrackState = track;
    },
    setCurrentTrackId(id) {
      currentTrackState.id = id;
    },
    setCurrentTrackIndex(index) {
      currentTrackState.index = index;
    },
    setCurrentTrackName(name) {
      currentTrackState.name = name;
    },
    setCurrentTrackAuthor(author) {
      currentTrackState.author = author;
    },
    setCurrentTrackPath(path) {
      currentTrackState.path = path;
    },
  });
  
  setContext("playback", {
    getPlayback() {
      return playbackState;
    },
    getPlaybackUrl() {
      return playbackState.url;
    },
    getPlaybackDuration() {
      return playbackState.duration;
    },
    getPlaybackTime() {
      return playbackState.time;
    },
    getPlaybackVolume() {
      return playbackState.volume;
    },
    getPlaybackReady() {
      return playbackState.isReady;
    },
    getPlaybackPlaying() {
      return playbackState.isPlaying;
    },
    setPlayback(playback) {
      playbackState = playback;
    },
    setPlaybackUrl(url) {
      playbackState.url = url;
    },
    setPlaybackDuration(duration) {
      playbackState.duration = duration;
    },
    setPlaybackTime(time) {
      playbackState.time = time;
    },
    setPlaybackVolume(volume) {
      playbackState.volume = volume;
    },
    setPlaybackReady(bool) {
      playbackState.isReady = bool;
    },
    setPlaybackPlaying(bool) {
      playbackState.isPlaying = bool;
    },
  });
  
  setContext("playbackMode", {
    getPlaybackMode() {
      return playbackModeState;
    },
    getPlaybackModeIsRepeat() {
      return playbackModeState.isRepeat;
    },
    getPlaybackModeIsShuffle() {
      return playbackModeState.isShuffle;
    },
    setPlaybackMode(playbackMode) {
      playbackModeState = playbackMode;
    },
    setPlaybackModeIsRepeat(bool) {
      playbackModeState.isRepeat = bool;
    },
    setPlaybackModeIsShuffle(bool) {
      playbackModeState.isShuffle = bool;
    },
  });
</script>

<div class="player">
  <div class="playlist-container">
    <Playlist playlist={playlist} />
  </div>
  <div class="playback-container">
    <Playback />
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