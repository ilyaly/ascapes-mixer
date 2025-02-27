<script>
  import { appDataDir, join } from "@tauri-apps/api/path";
  import { convertFileSrc } from "@tauri-apps/api/core";

  import { getContext } from "svelte";
  import PlaybackMeta from "./PlaybackMeta.svelte";
  import PlaybackControl from "./PlaybackControl.svelte";
  import SeekBar from "./SeekBar.svelte";
  import VolumeIcon from "../icons/VolumeIcon.svelte";

  import { exists, readFile, BaseDirectory } from "@tauri-apps/plugin-fs";

  let activePlaylistState = getContext("activePlaylist");
  let currentTrackState = getContext("currentTrack");
  let playbackState = getContext("playback");
  let playbackModeState = getContext("playbackMode");

  let fakeCurrentTime = $state(0); //Needed to prevent currentTime is being set twice on seeking
  let currentTime = $state(0);
  let currentVolume = $state(1);
  let duration = $state(0);

  let audioRef;

  $effect(() => {
    playbackState.setPlaybackTime(currentTime);
    fakeCurrentTime = currentTime;
  });

  $effect(() => {
    playbackState.setPlaybackVolume(currentVolume);
    if (audioRef) {
      audioRef.volume = currentVolume;
    }
  });

  $effect(() => {
    //Update playbackReady when track is changed
    if (currentTrackState.getCurrentTrackPath()) {
      playbackState.setPlaybackReady(false);
    }
  });

  $effect(async () => {
    //Load and update playbackReady if not
    if (currentTrackState.getCurrentTrackPath() && !playbackState.getPlaybackReady()) {
      try {
        let objectURL = await readFileFromDisk(
          currentTrackState.getCurrentTrackPath(),
        );
        playbackState.setPlaybackUrl(objectURL);
        playbackState.setPlaybackReady(true);
      } catch (error) {
        console.error(`Error reading file fron disk: ${error}`);
      }
    }
  });

  

  $effect(() => {
    if (playbackState.getPlaybackReady()) {
      audioRef.src = playbackState.getPlaybackUrl();
      playbackState.setPlaybackTime(audioRef.currentTime);
      playbackState.setPlaybackDuration(audioRef.duration);
      audioRef.load();
    }
  });

  $effect(() => {
    if (playbackState.getPlaybackReady() && playbackState.getPlaybackPlaying()) {
      audioRef.play();
    }
  });

  $effect(() => {
    if (playbackState.getPlaybackReady() && !playbackState.getPlaybackPlaying()) {
      audioRef.pause();
    }
  });



  function getRandomIntInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async function readFileFromDisk(path) {
    const contents = await readFile(path, {
      baseDir: BaseDirectory.AppLocalData,
    });
    const audioBlob = new Blob([contents], { type: "audio/mpeg" });
    const objectURL = URL.createObjectURL(audioBlob);

    return objectURL;
  }

  function handlePlaybackSeek(progress) {
    fakeCurrentTime = (progress / 100) * duration;
  }

  function handlePlaybackSeekEnd(progress) {
    currentTime = (progress / 100) * duration;
    fakeCurrentTime = (progress / 100) * duration;
  }

  function handleVolumeSeek(progress) {
    currentVolume = progress / 100;
  }

  function handleVolumeSeekEnd(progress) {
    currentVolume = progress / 100;
  }

  function handlePlaybackEnded() {
    let currentTrackIndex = currentTrackState.getCurrentTrackIndex();


    let nextTrackIndex = currentTrackIndex + 1;
    console.log(`Next track index: ${nextTrackIndex}`)

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

    if (playbackModeState.getPlaybackModeIsShuffle()) {
      nextTrackIndex = getRandomIntInRange(0, currentPlaylistLength - 1);
      nextTrack = currentPlaylist[nextTrackIndex]
    }

    if (playbackModeState.getPlaybackModeIsRepeat()) {
      nextTrackIndex = currentTrackIndex;
      nextTrack = currentPlaylist[nextTrackIndex]
    }

    console.log(nextTrack)
    if (nextTrack) {
      currentTrackState.setCurrentTrack(nextTrack);
    }
    
  }
</script>

<div class="playback">
    
  <div class="playback-header">
    <PlaybackMeta
        name={
          currentTrackState.getCurrentTrack().name ? currentTrackState.getCurrentTrack().name : "-"
        }
    />
  </div>
  <div class="playback-body">
    
    <PlaybackControl />
    <div class="volume-control">
      <button>
        <VolumeIcon />
      </button>
      <SeekBar
        currentValue={currentVolume * 100}
        onSeek={handleVolumeSeek}
        onSeekEnd={handleVolumeSeekEnd}
        min={0}
        max={100}
      />
    </div>
  </div>

  <SeekBar
    currentValue={(currentTime / duration) * 100}
    onSeek={handlePlaybackSeek}
    onSeekEnd={handlePlaybackSeekEnd}
    min={0}
    max={100}
  />

  {#if playbackState.getPlaybackUrl()}
    <audio
      src={playbackState.getPlaybackUrl()}
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
  .playback {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    border: 1px solid grey;
    padding: 16px;
    border-radius: 8px;
  }

  .playback-header {
    min-height: 16px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .playback-body {
    display: flex;
    flex-direction: row;
    width: -webkit-fill-available;
    justify-content: space-between;
  }

  .volume-control {
    width: 30%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }

  .playback-controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 8px;
  }

  button {
    background: none;
    border: none;
  }

  button:hover {
    cursor: pointer;
    scale: 1.1;
  }
</style>
