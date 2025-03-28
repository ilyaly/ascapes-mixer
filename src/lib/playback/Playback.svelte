<script>
  import { v4 as uuidv4 } from 'uuid';

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
  let notificationsContext = getContext("notifications")

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
        let objectURL = await readFileFromDisk(
          currentTrack.path
        );
        playingTrackContext.setPlayingTrackUrl(objectURL);
        playingTrackContext.setPlayingTrackIsReady(true);
        playlistsContext.setPlaylistTrackAvailable(playingPlaylistData.id, currentTrack.id, true)
      } catch (error) {
        playbackContext.setPlaybackIsPlaying(false)
        playlistsContext.setPlaylistTrackAvailable(playingPlaylistData.id, currentTrack.id, false)
        addFileUnavailableNotification(currentTrack);
        playingTrackContext.resetPlayingTrack()
      }
    }
  });

  $effect(() => {
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

  function addFileUnavailableNotification(currentTrack) {
    let tempNotifications = $state.snapshot(notificationsContext.getNotifications());
    tempNotifications.push(
      {
        id: uuidv4(),
        text: `File associated with the "${currentTrack.name}" track  is unavailable. Please delete the track and re-import it.`
      } 
    )

    notificationsContext.setNotifications(tempNotifications);
  }

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

    if (currentPlayback.isShuffle) {
      nextTrackIndex = getRandomIntInRange(0, tracks.length - 1);
      nextTrack = tempTracks.find((obj) => obj.index === nextTrackIndex);
    }

    if (currentPlayback.isRepeat) {
      nextTrack = currentTrack
    }

    if (nextTrack) {
      playingTrackContext.setPlayingTrack(nextTrack);
      playbackContext.setPlaybackTime(0);
      audioRef.play();
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
    border-radius: 4px;
    margin: 0px 16px 8px 16px;
    background-color: #fff;
    box-shadow: 0 0 8px 2px #0000001a;
    border-top: 1px solid #0000001a;
    height: 100px;
    box-sizing: border-box;

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

  button {
    background: none;
    border: none;
  }

  button:hover {
    cursor: pointer;
    scale: 1.1;
  }
</style>
