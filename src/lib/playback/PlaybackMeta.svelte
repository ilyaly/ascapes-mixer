<script>
  import { getContext } from "svelte";

  let { name } = $props();

</script>

<div class="audio-info">
  <span class="audio-name">{name}</span>
</div>

<style>
  .audio-info {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
    height: 24px;
  }

  .audio-name {
    font-size: 16px;
    font-style: italic;
    font-weight: 400;
    max-width: 420px;
    text-overflow: ellipsis;
    overflow: hidden;
  }

</style>
