<script>
  import { getVersion } from '@tauri-apps/api/app';
  import { Menu } from '@tauri-apps/api/menu';
  import { message } from '@tauri-apps/plugin-dialog';
  import { confirm } from '@tauri-apps/plugin-dialog';


  import { onMount } from "svelte";

  import Section from "../lib/sections/Section.svelte";

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

    const menu = await Menu.new({
        items: [
          {
            id: 'about',
            text: 'About',
            action: async () => {
              const appVersion = await getVersion();
              await message(
                `Ascapes Mixer\n\nVersion ${appVersion}\n\nAn audio player and mixer for tabletop role-playing games.\n\nCopyright (c) 2025 Ilya Shevelev\n\nSource code: https://github.com/ilyaly/ascapes-mixer\n\nMIT license`,
                { 
                  title: 'About',
                  kind: 'info',
                  okLabel: "Ok" 
                }
              );
              //window.open("https://github.com/ilyaly/ascapes-mixer");
            },
          },
          {
            id: 'releases',
            text: 'Releases',
            action: async () => {

              const confirmation = await confirm(
                `Open the application's releases webpage?`,
                { 
                  title: 'Releases',
                  kind: 'info'
                }
              );

              if (confirmation) {
                window.open("https://github.com/ilyaly/ascapes-mixer/releases");
              }
            },
          }
        ],
    });

    menu.setAsAppMenu().then((res) => {
        console.log('menu set success', res);
    });
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
    <Section
      label={"Music"}
      type={"playlist"}
      dbName={dbName}
      dbState={dbState}
      storeName={musicStoreName}
    />
  </div>

  <div class="ambient">
    <Section
      label={"Ambient"}
      type={"playlist"}
      dbName={dbName}
      dbState={dbState}
      storeName={ambientStoreName}
    />
  </div>

  <div class="one-shots">
    <Section
      label={"Effects"}
      type={"samples"}
      dbName={dbName}
      dbState={dbState}
      storeName={effectsStoreName}
    />
  </div>
  
  
  
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap');

  /* Remove default margins */
  :global(body, html) {
    margin: 0;
    padding: 0;
    height: 100vh;
    overflow: auto; /* Prevents scroll */
    
  }

  :global(body, html, button, input, textarea) {
    font-family: "Roboto Mono", serif;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
    font-variation-settings: "wdth" 100;
  }

  /* Grid container */
  .container {
    font-size: 48px;
    height: 100vh;
    display: grid;
    grid-template-columns: 50% 50%;
    grid-template-rows: 70% 30%;
    
  }

  /* Ensure all sections fit properly */
  .music,
  .ambient,
  .one-shots {
    border: 2px solid #bdbdbd;
    overflow: hidden; /* Ensures no extra scroll */
  }

  /* Music section takes full height */
  .music {

  }

  .ambient {

  }

  /* The right two sections */
  .one-shots {
    grid-column: 1 / span 2; /* Span across both columns */
  }





</style>
