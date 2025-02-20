<script>
  let { label } = $props();
</script>

<div class="playlist-header">
  <button class="playlist-header-back">⯬</button>
  <div class="playlist-header-label">
    {label}
  </div>
</div>

<style>
  .playlist-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
    position: sticky;
    position: -webkit-sticky;
    top: 0; /* required */
  }

  .playlist-header-back {
    background: none;
    border: none;
    font-size: 32px;
  }

  .playlist-header-back:hover {
    cursor: pointer;
  }

  .playlist-header-label {
    font-size: 32px;
  }
</style>
