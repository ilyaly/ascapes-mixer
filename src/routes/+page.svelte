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
    height:100vh;
    max-height:100vh;
    display: grid;
    grid-template-columns: 1fr 0fr 1fr;
    grid-template-rows: 0.45fr 0.45fr 1fr;
    gap: 24px 8px;
    grid-template-areas:
      "music . one-shots"
      "music . one-shots"
      "music . ambient";
  }


  .container .music,
  .container .ambient {

    /* Allow scrolling within these containers if the content overflows 
    overflow-y: auto; /* Enables vertical scrolling */
    /*-ms-overflow-style: none; /* For Internet Explorer 10+ */
    /*scrollbar-width: none; /* For Firefox */
  }

  .container .music {
    grid-area: music;
    /* Style the first container */
    width: -webkit-fill-available;
    border: 1px solid #bdbdbd;
    border-radius: 0px;
    padding: 16px;
  }

  .container .ambient {
    grid-area: ambient;
    /* Style the first container */
    width: -webkit-fill-available;
    border: 1px solid #bdbdbd;
    border-radius: 0px;
    padding: 16px;
  }

  .container .one-shots {
    grid-area: one-shots;
    /* Style the bottom container */
    height: -webkit-fill-available;
    width: -webkit-fill-available;
    border: 1px solid #bdbdbd;
    border-radius: 0px;
    padding: 16px;
  }
</style>
