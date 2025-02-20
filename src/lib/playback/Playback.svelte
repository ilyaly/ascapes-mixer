<script>
  import { appDataDir, join } from "@tauri-apps/api/path";
  import { convertFileSrc } from "@tauri-apps/api/core";

  import { getContext } from "svelte";
  import PlaybackMeta from "./PlaybackMeta.svelte";
  import PlaybackControl from "./PlaybackControl.svelte";
  import SeekBar from "./SeekBar.svelte";
  import VolumeIcon from "../icons/VolumeIcon.svelte";

  import { exists, readFile, BaseDirectory } from "@tauri-apps/plugin-fs";

  let playlist = getContext("playlist");
  let currentTrack = getContext("currentTrack");
  let playback = getContext("playback");
  let playbackMode = getContext("playbackMode");

  let fakeCurrentTime = $state(0); //Needed to prevent currentTime is being set twice on seeking
  let currentTime = $state(0);
  let currentVolume = $state(1);
  let duration = $state(0);

  let audioRef;

  $effect(() => {
    playback.setPlaybackTime(currentTime);
  });

  $effect(() => {
    playback.setPlaybackVolume(currentVolume);
    if (audioRef) {
      audioRef.volume = currentVolume;
    }
  });

  $effect(() => {
    //Update playbackReady when track is changed
    if (currentTrack.getCurrentTrackId()) {
      playback.setPlaybackReady(false);
    }
  });

  $effect(async () => {
    if (currentTrack.getCurrentTrackId() && !playback.getPlaybackReady()) {
      try {
        let objectURL = await readFileFromDisk(
          currentTrack.getCurrentTrackPath(),
        );
        playback.setPlaybackUrl(objectURL);
        playback.setPlaybackReady(true);
      } catch (error) {
        console.error(`Error reading file fron disk: ${error}`);
      }
    }
  });

  $effect(() => {
    if (playback.getPlaybackReady()) {
      audioRef.src = playback.getPlaybackUrl();
      playback.setPlaybackTime(audioRef.currentTime);
      playback.setPlaybackDuration(audioRef.duration);
      audioRef.load();
    }
  });

  $effect(() => {
    if (playback.getPlaybackReady() && playback.getPlaybackPlaying()) {
      audioRef.play();
    }
  });

  $effect(() => {
    if (playback.getPlaybackReady() && !playback.getPlaybackPlaying()) {
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
  }

  function handleVolumeSeek(progress) {
    currentVolume = progress / 100;
  }

  function handleVolumeSeekEnd(progress) {
    currentVolume = progress / 100;
  }

  function handlePlaybackEnded() {
    let currentTrackIndex = currentTrack.getCurrentTrackIndex();

    let currentPlaylist = $state.snapshot(playlist.getPlaylist());

    let currentPlaylistLength = currentPlaylist.length;

    let nextTrackIndex = currentTrackIndex + 1;
    if (nextTrackIndex === currentPlaylistLength) {
      nextTrackIndex = 0;
    }

    if (playbackMode.getPlaybackModeIsShuffle()) {
      nextTrackIndex = getRandomIntInRange(0, currentPlaylistLength - 1);
    }

    if (playbackMode.getPlaybackModeIsRepeat()) {
      nextTrackIndex = currentTrackIndex;
    }

    let nextTrack = $state
      .snapshot(playlist.getPlaylist())
      .find((obj) => obj.index === nextTrackIndex);

    if (nextTrack) {
      currentTrack.setCurrentTrack(nextTrack);
    }
  }
</script>

<div class="player">
  <div class="player-header">
    {#if currentTrack.getCurrentTrack().name}
      <PlaybackMeta />
    {/if}
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
    currentValue={(fakeCurrentTime / duration) * 100}
    onSeek={handlePlaybackSeek}
    onSeekEnd={handlePlaybackSeekEnd}
    min={0}
    max={100}
  />

  {#if playback.getPlaybackUrl()}
    <audio
      src={playback.getPlaybackUrl()}
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
  .player {
    min-height: 80px;

    margin-block: 8px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    border: 1px solid grey;
    border-radius: 8px;
  }

  .player-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
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
