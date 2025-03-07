<script>
  import { exists, readFile, BaseDirectory } from "@tauri-apps/plugin-fs";

  import { getContext } from "svelte";
  import PlaybackMeta from "./PlaybackMeta.svelte";
  import PlaybackControl from "./PlaybackControl.svelte";
  import SeekBar from "./SeekBar.svelte";
  import VolumeIcon from "../icons/VolumeIcon.svelte";

  let { 
    currentPlayback,
    currentTrack,
    playingPlaylistData
  } = $props();

  let playlistsContext = getContext("playlists");
  let playbackContext = getContext("playback");
  let playingTrackContext = getContext("playingTrack");

  let url = $state(null);
  let fakeCurrentTime = $state(0); //Needed to prevent currentTime is being set twice on seeking
  let currentTime = $state(0);
  let currentVolume = $state(1);
  let duration = $state(0);

  let audioRef;

  $effect(() => {
    if (currentPlayback) {
      fakeCurrentTime = currentTime;
      playbackContext.setPlaybackTime(currentTime);
    }
  });

  $effect(() => {
    if (currentVolume) {
      playbackContext.setPlaybackVolume(currentVolume);
      if (audioRef) {
        audioRef.volume = currentVolume;
      }
    }
  });

  $effect(async () => {
    if (currentPlayback.isPlaying && !currentTrack.isReady) {
      try {
        console.log(currentTrack.path)
        let objectURL = await readFileFromDisk(
          currentTrack.path
        );
        playingTrackContext.setPlayingTrackUrl(objectURL);
        playingTrackContext.setPlayingTrackIsReady(true);
        playlistsContext.setPlaylistTrackAvailable(playingPlaylistData.id, currentTrack.id, true)
      } catch (error) {
        playlistsContext.setPlaylistTrackAvailable(playingPlaylistData.id, currentTrack.id, false)
        console.error(`Error reading file fron disk: ${error}`);
      }
    }
  });

  $effect(() => {
    console.log(`Loading audio`)
    if (currentTrack.isReady) {
      audioRef.src = currentTrack.url;
      audioRef.load();
    }
  });

  $effect(() => {
    if (currentTrack.isReady && currentPlayback.isPlaying) {
      audioRef.play();
    }
  });

  $effect(() => {
    if (currentPlayback.isPlaying) {
      playbackContext.setPlaybackTime(currentTime);
      playbackContext.setPlaybackDuration(duration)
    }
    
  });
  

  $effect(() => {
    if (!currentPlayback.isPlaying) {
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
    let nextTrack;
    let tracks = $state.snapshot(playingPlaylistData).tracks;
    tracks = tracks.filter((track) => track.available === true);

    let currentTrackIndex = $state.snapshot(currentTrack).index;
    let nextTrackIndex = currentTrackIndex + 1;

    if (nextTrackIndex === tracks.length) {
      nextTrack = tracks.find((obj) => obj.index === 0);
    } else {
      nextTrack = tracks.find(
        (obj) => obj.index === currentTrackIndex + 1,
      );
    }

    if (currentPlayback.isShuffle) {
      nextTrackIndex = getRandomIntInRange(0, tracks.length - 1);
      nextTrack = tracks.find((obj) => obj.index === nextTrackIndex);
    }

    if (currentPlayback.isRepeat) {
      nextTrackIndex = currentTrackIndex;
      nextTrack = tracks.find((obj) => obj.index === nextTrackIndex);
    }

    if (nextTrack) {
      playingTrackContext.setPlayingTrack(nextTrack);
    }
    
  }
</script>


<div class="playback">
    
  <div class="playback-header">
    
  <div class="playback-body">
    <PlaybackMeta
        name={
          currentTrack.name ? currentTrack.name : "-"
        }
    />
  </div>
    <PlaybackControl 
      currentPlayback={currentPlayback}
      currentTrack={currentTrack}
      playingPlaylistData={playingPlaylistData}
    />
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

  <audio
      src={currentTrack.url}
      bind:this={audioRef}
      bind:currentTime
      bind:duration
      bind:volume={currentVolume}
      onended={handlePlaybackEnded}
    >
  </audio>
</div>

<style>
  .playback {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 16px;
    border-radius: 8px;
    margin: 0px 16px 16px 16px;
    background-color: #fff;
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
    width: 250px;
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
