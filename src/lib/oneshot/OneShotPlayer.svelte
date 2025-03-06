<script>
  import { onMount } from "svelte";
  import { setContext, getContext } from "svelte";

  import PadsGrid from "../pads/PadsGrid.svelte";

  let { openedPlaylistData, masterVolume } = $props();

</script>

<div class="one-shot-player">
  <PadsGrid
    openedPlaylistData={openedPlaylistData}
    masterVolume={masterVolume}
  />
</div>

<style>
  .one-shot-player {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: stretch;
    justify-content: start;
    flex-direction: column;
    overflow: scroll;
    scrollbar-width: none; /* For Firefox */
    -ms-overflow-style: none;  /* For Internet Explorer and Edge */
  }

  /* For WebKit browsers (Chrome, Safari) */
  .one-shot-player::-webkit-scrollbar {
    display: none;
  }
</style>
