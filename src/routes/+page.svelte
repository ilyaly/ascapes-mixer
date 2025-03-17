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
    isReady: false
  });

  let fsState = $state({
    isReady: false
  })

  onMount(async () => {
    initFs();
    initDb();

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
    });
  });

  async function initDb() {
    try {
      await registerStore(dbName, musicStoreName);
      await registerStore(dbName, ambientStoreName);
      await registerStore(dbName, effectsStoreName);
      dbState.isReady = true;

    } catch (error) {
      console.error("Database initialization error:", error)
    }
  }

  async function initFs() {
    try {
      let audio = await exists("audio", {
        baseDir: BaseDirectory.AppLocalData,
      });

      if (!audio) {
        await mkdir("audio", { baseDir: BaseDirectory.AppLocalData, recursive: true});
      };

      fsState.isReady = true;
    } catch (error) {
      console.error("File system initialization error:", error)
    }
  }

</script>


<div class="container">
  {#if dbState.isReady}
    <div class="music">
      <Section
        label={"🎹 music"}
        type={"playlist"}
        dbName={dbName}
        dbState={dbState}
        storeName={musicStoreName}
      />
    </div>

    <div class="ambient">
      <Section
        label={"🍃 ambiance"}
        type={"playlist"}
        dbName={dbName}
        dbState={dbState}
        storeName={ambientStoreName}
      />
    </div>

    <div class="one-shots">
      <Section
        label={"💥 effects"}
        type={"samples"}
        dbName={dbName}
        dbState={dbState}
        storeName={effectsStoreName}
      />
    </div>
  {/if}
  
  
  
  
</div>

<style>
  /* roboto-mono-100 - cyrillic_latin */
  @font-face {
    font-display: swap; /* Check https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display for other options. */
    font-family: 'Roboto Mono';
    font-style: normal;
    font-weight: 100;
    src: url('/fonts/roboto-mono-v23-cyrillic_latin-100.woff2') format('woff2'); /* Chrome 36+, Opera 23+, Firefox 39+, Safari 12+, iOS 10+ */
  }
  /* roboto-mono-100italic - cyrillic_latin */
  @font-face {
    font-display: swap; /* Check https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display for other options. */
    font-family: 'Roboto Mono';
    font-style: italic;
    font-weight: 100;
    src: url('/fonts/roboto-mono-v23-cyrillic_latin-100italic.woff2') format('woff2'); /* Chrome 36+, Opera 23+, Firefox 39+, Safari 12+, iOS 10+ */
  }
  /* roboto-mono-200 - cyrillic_latin */
  @font-face {
    font-display: swap; /* Check https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display for other options. */
    font-family: 'Roboto Mono';
    font-style: normal;
    font-weight: 200;
    src: url('/fonts/roboto-mono-v23-cyrillic_latin-200.woff2') format('woff2'); /* Chrome 36+, Opera 23+, Firefox 39+, Safari 12+, iOS 10+ */
  }
  /* roboto-mono-200italic - cyrillic_latin */
  @font-face {
    font-display: swap; /* Check https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display for other options. */
    font-family: 'Roboto Mono';
    font-style: italic;
    font-weight: 200;
    src: url('/fonts/roboto-mono-v23-cyrillic_latin-200italic.woff2') format('woff2'); /* Chrome 36+, Opera 23+, Firefox 39+, Safari 12+, iOS 10+ */
  }
  /* roboto-mono-300 - cyrillic_latin */
  @font-face {
    font-display: swap; /* Check https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display for other options. */
    font-family: 'Roboto Mono';
    font-style: normal;
    font-weight: 300;
    src: url('/fonts/roboto-mono-v23-cyrillic_latin-300.woff2') format('woff2'); /* Chrome 36+, Opera 23+, Firefox 39+, Safari 12+, iOS 10+ */
  }
  /* roboto-mono-300italic - cyrillic_latin */
  @font-face {
    font-display: swap; /* Check https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display for other options. */
    font-family: 'Roboto Mono';
    font-style: italic;
    font-weight: 300;
    src: url('/fonts/roboto-mono-v23-cyrillic_latin-300italic.woff2') format('woff2'); /* Chrome 36+, Opera 23+, Firefox 39+, Safari 12+, iOS 10+ */
  }
  /* roboto-mono-regular - cyrillic_latin */
  @font-face {
    font-display: swap; /* Check https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display for other options. */
    font-family: 'Roboto Mono';
    font-style: normal;
    font-weight: 400;
    src: url('/fonts/roboto-mono-v23-cyrillic_latin-regular.woff2') format('woff2'); /* Chrome 36+, Opera 23+, Firefox 39+, Safari 12+, iOS 10+ */
  }
  /* roboto-mono-italic - cyrillic_latin */
  @font-face {
    font-display: swap; /* Check https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display for other options. */
    font-family: 'Roboto Mono';
    font-style: italic;
    font-weight: 400;
    src: url('/fonts/roboto-mono-v23-cyrillic_latin-italic.woff2') format('woff2'); /* Chrome 36+, Opera 23+, Firefox 39+, Safari 12+, iOS 10+ */
  }
  /* roboto-mono-500 - cyrillic_latin */
  @font-face {
    font-display: swap; /* Check https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display for other options. */
    font-family: 'Roboto Mono';
    font-style: normal;
    font-weight: 500;
    src: url('/fonts/roboto-mono-v23-cyrillic_latin-500.woff2') format('woff2'); /* Chrome 36+, Opera 23+, Firefox 39+, Safari 12+, iOS 10+ */
  }
  /* roboto-mono-500italic - cyrillic_latin */
  @font-face {
    font-display: swap; /* Check https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display for other options. */
    font-family: 'Roboto Mono';
    font-style: italic;
    font-weight: 500;
    src: url('/fonts/roboto-mono-v23-cyrillic_latin-500italic.woff2') format('woff2'); /* Chrome 36+, Opera 23+, Firefox 39+, Safari 12+, iOS 10+ */
  }
  /* roboto-mono-600 - cyrillic_latin */
  @font-face {
    font-display: swap; /* Check https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display for other options. */
    font-family: 'Roboto Mono';
    font-style: normal;
    font-weight: 600;
    src: url('/fonts/roboto-mono-v23-cyrillic_latin-600.woff2') format('woff2'); /* Chrome 36+, Opera 23+, Firefox 39+, Safari 12+, iOS 10+ */
  }
  /* roboto-mono-600italic - cyrillic_latin */
  @font-face {
    font-display: swap; /* Check https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display for other options. */
    font-family: 'Roboto Mono';
    font-style: italic;
    font-weight: 600;
    src: url('/fonts/roboto-mono-v23-cyrillic_latin-600italic.woff2') format('woff2'); /* Chrome 36+, Opera 23+, Firefox 39+, Safari 12+, iOS 10+ */
  }
  /* roboto-mono-700 - cyrillic_latin */
  @font-face {
    font-display: swap; /* Check https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display for other options. */
    font-family: 'Roboto Mono';
    font-style: normal;
    font-weight: 700;
    src: url('/fonts/roboto-mono-v23-cyrillic_latin-700.woff2') format('woff2'); /* Chrome 36+, Opera 23+, Firefox 39+, Safari 12+, iOS 10+ */
  }
  /* roboto-mono-700italic - cyrillic_latin */
  @font-face {
    font-display: swap; /* Check https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display for other options. */
    font-family: 'Roboto Mono';
    font-style: italic;
    font-weight: 700;
    src: url('/fonts/roboto-mono-v23-cyrillic_latin-700italic.woff2') format('woff2'); /* Chrome 36+, Opera 23+, Firefox 39+, Safari 12+, iOS 10+ */
  }

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
    grid-template-rows: 60% 40%;
    
  }

  /* Ensure all sections fit properly */
  .music,
  .ambient,
  .one-shots {
    border: 0px solid black;
    overflow: hidden; /* Ensures no extra scroll */
  }

  /* Music section takes full height */
  .music {
    background-color: #EAF4FC;
  }

  .ambient {
    background-color: #EAF9F0;
  }

  /* The right two sections */
  .one-shots {
    background-color: #FFF5E6;
    grid-column: 1 / span 2; /* Span across both columns */
  }





</style>
