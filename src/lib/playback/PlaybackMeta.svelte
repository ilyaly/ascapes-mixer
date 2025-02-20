<script>
  import { getContext } from "svelte";

  let currentTrack = getContext("currentTrack");
</script>

<div class="audio-info">
  <span class="audio-name">{currentTrack.getCurrentTrackName()}</span>
</div>

<style>
  .audio-info {
    width: 100%;
    height: 64px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .audio-name {
    font-size: 14px;
  }

  .artist-name {
    font-size: 12px;
  }
</style>
