<script>
  import { onMount } from "svelte";
  import Catalogs from "../lib/catalog/Catalogs.svelte";
  import Player from "../lib/player/Player.svelte";
  import OneShotPlayer from "../lib/oneshot/OneShotPlayer.svelte";
  import { deleteDatabase, registerStore } from "../lib/utils/indexeddb.js";
  import { exists, mkdir, BaseDirectory } from "@tauri-apps/plugin-fs";

  let dbName = "AscapesDataBase";

  let musicStoreName = "music-tracks";

  let ambientStoreName = "ambient-tracks";

  let oneShotsStoreName = "oneshot-tracks";

  let dbState = $state({
    isReady: false,
  });

  onMount(async () => {
    initApp();
  });

  async function initApp() {
    try {
      await registerStore(dbName, musicStoreName);
      await registerStore(dbName, ambientStoreName);
      await registerStore(dbName, oneShotsStoreName);
      dbState.isReady = true;

      let audioDir = await exists("audio", {
        baseDir: BaseDirectory.AppLocalData,
      });
      if (!audioDir) {
        await mkdir("audio", { baseDir: BaseDirectory.AppLocalData });
      }
    } catch (error) {
      console.error("Error opening the database:", error);
    }
  }


  let isMusicCatalogsMode = $state(true);
  let isAmbientCatalogsMode = $state(false);
  let isEffectsCatalogsMode = $state(false);

</script>

<!--
<button
		onclick={ () => { deleteDatabase(dbName) }}
	>
		DELETE DATABSE
</button>
-->
<div class="container">
  <div class="music">
    {#if isMusicCatalogsMode}

      <Catalogs />
    {:else}
      <Player
        label={"Music"}
        {dbName}
        {dbState}
        storeName={musicStoreName}
      />
    {/if}
  </div>

  <div class="ambient">
    {#if isAmbientCatalogsMode}
      <Catalogs />
    {:else}
        <Player
          label={"Ambient"}
          {dbName}
          {dbState}
          storeName={ambientStoreName} 
        />
    {/if}
  </div>

  <div class="one-shots">
    {#if isEffectsCatalogsMode}
      <Catalogs />
    {:else}
      
        <OneShotPlayer
          label={"Sound effects"}
          {dbName}
          {dbState}
          storeName={oneShotsStoreName}
        />
    {/if}
  </div>
  
  
  
</div>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap");

  :global(body) {
    /* applies to <body> */
    margin: 0;
    font-family: "Roboto", serif;
    font-optical-sizing: auto;
    font-weight: <weight>;
    font-style: normal;
    font-variation-settings: "wdth" 100;
  }

  .container {
    height: 100vh;
    display: grid;
    grid-template-columns: 1fr 0fr 1fr;
    grid-template-rows: 0.3fr 0.3fr 1fr;
    gap: 8px 8px;
    grid-template-areas:
      "music . one-shots"
      "music . one-shots"
      "music . ambient";
  }


  .container .music,
  .container .ambient {
    /* Allow scrolling within these containers if the content overflows */
    overflow-y: auto; /* Enables vertical scrolling */
    -ms-overflow-style: none; /* For Internet Explorer 10+ */
    scrollbar-width: none; /* For Firefox */
  }

  .container .music {
    grid-area: music;
    /* Style the first container */
    width: -webkit-fill-available;
    border: 1px solid #bdbdbd;
    border-radius: 8px;
    padding: 8px;
  }

  .container .ambient {
    grid-area: ambient;
    /* Style the first container */
    width: -webkit-fill-available;
    border: 1px solid #bdbdbd;
    border-radius: 8px;
    padding: 8px;
  }

  .container .one-shots {
    grid-area: one-shots;
    overflow-y: auto; /* Allow scrolling if content overflows in the bottom container */
    /* You can also apply height if necessary to control the height of the bottom container */

    /* Style the bottom container */
    height: -webkit-fill-available;
    width: -webkit-fill-available;
    border: 1px solid #bdbdbd;
    border-radius: 8px;
    padding: 8px;
  }
</style>
