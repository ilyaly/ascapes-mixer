<script>
  import { onMount } from "svelte";

  import MusicSection from "../lib/sections/MusicSection.svelte";
  import AmbientSection from "../lib/sections/AmbientSection.svelte";
  import EffectsSection from "../lib/sections/EffectsSection.svelte";

  import { deleteDatabase, registerStore } from "../lib/utils/indexeddb.js";
  import { exists, mkdir, BaseDirectory } from "@tauri-apps/plugin-fs";

  let dbName = "AscapesDataBase";

  let musicStoreName = "music-tracks";

  let ambientStoreName = "ambient-tracks";

  let effectsStoreName = "oneshot-tracks";

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
      await registerStore(dbName, effectsStoreName);
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
  let isAmbientCatalogsMode = $state(true);
  let isEffectsCatalogsMode = $state(true);


</script>


<div class="container">
  <div class="music">
    <MusicSection
      label={"Music"}
      {dbName}
      {dbState}
      storeName={musicStoreName}
    />
  </div>

  <div class="ambient">
    <AmbientSection
      label={"Ambient"}
      {dbName}
      {dbState}
      storeName={ambientStoreName}
    />
  </div>

  <div class="one-shots">
    <EffectsSection
      label={"Effects"}
      {dbName}
      {dbState}
      storeName={effectsStoreName}
    />
  </div>
  
  
  
</div>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap");

  /* Remove default margins */
  :global(body, html) {
    margin: 0;
    padding: 0;
    height: 100vh;
    overflow: auto; /* Prevents scroll */
    font-family: "Roboto", serif;
    font-optical-sizing: auto;
    font-weight: <weight>;
    font-style: normal;
    font-variation-settings: "wdth" 100;
  }

  /* Grid container */
  .container {
    font-family: "Roboto", serif;
    height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr; /* Two equal columns */
    grid-template-rows: 1fr 1fr; /* Two equal rows */
    gap: 8px; /* Adjust spacing */
  }

  /* Ensure all sections fit properly */
  .music,
  .ambient,
  .one-shots {
    border: 1px solid #bdbdbd;
    padding: 16px;
    overflow: hidden; /* Ensures no extra scroll */
  }

  /* Music section takes full height */
  .music {
    grid-column: 1 / 2;
    grid-row: 1 / 3; /* Spans two rows */
  }

  /* The right two sections */
  .one-shots {
    grid-column: 2 / 3;
    grid-row: 1 / 2;
  }

  .ambient {
    grid-column: 2 / 3;
    grid-row: 2 / 3;
  }


</style>
