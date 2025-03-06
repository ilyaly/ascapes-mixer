<script>
  import { writeFile, BaseDirectory } from "@tauri-apps/plugin-fs";

  import { onMount } from "svelte";
  import { getContext } from "svelte";

  import { flip } from "svelte/animate";
  import { dndzone } from "svelte-dnd-action";

  import PlaylistItem from "./PlaylistItem.svelte";

  import PlayIcon from "../icons/PlayIcon.svelte";
  import PauseIcon from "../icons/PauseIcon.svelte";

  let { openedPlaylistData } = $props();

  let playlistsContext = getContext("playlists");
  let openedPlaylistContext = getContext("openedPlaylist");

  let id = $state(
    $state.snapshot(openedPlaylistData.id)
  );

  let items = $state(
    $state.snapshot(openedPlaylistData.tracks)
  );

  $effect(() => {
    if (openedPlaylistData) {
      id = $state.snapshot(openedPlaylistData.id)
      items = $state.snapshot(openedPlaylistData.tracks)
    }
  });

  function updateItems() {
      let itemsSnapshot = $state.snapshot(items);

      for (let i = 0; i < itemsSnapshot.length; i++) {
        itemsSnapshot[i].index = i;
      };
      items = itemsSnapshot;
      playlistsContext.setPlaylistTracks(id, items);
      playlistsContext.setPlaylistQuantity(id, itemsSnapshot.length);
  };

  const dropFromOthersDisabled = true;
  const flipDurationMs = 100;
  const dropTargetStyle = {
    outline: "rgba(0, 0, 255, 0.0) solid 1px",
  };

  function handleDndConsider(e) {
    items = e.detail.items;
  }

  function handleDndFinalize(e) {
    items = e.detail.items;
    updateItems();
  }

  async function handleFilesDrop(files) {
    if (files) {
      let tempItems = [];

      for (let i = 0; i < files.length; i++) {
        let file = files[i];
        let uuid = crypto.randomUUID();

        // Wrap the FileReader in a Promise
        const dataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();

          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = (e) => reject(e);

          reader.readAsDataURL(file);
        });
        tempItems.push({
          id: uuid,
          index: null,
          name: file.name,
          path: `./audio/${file.name}`,
          url: null,
          isPlaying: false,
        });
      }

      tempItems = $state.snapshot(items).concat(tempItems);

      items = tempItems;
      updateItems();
    }
  }


  let files = $state([]);

  let isDragging = $state(false);

  async function readFileAsUint8Array(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(new Uint8Array(reader.result));
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  // Prevent default behavior and call provided handler
  function preventDefault(fn) {
    return (event) => {
      event.preventDefault();
      fn(event);
    };
  }

  // Handle the dragenter event to add styles
  function handleDragEnter(event) {
    isDragging = true;
  }

  // Allow drop to happen
  function handleDragOver(event) {
    isDragging = true;
  }

  // Handle the dragleave event to remove styles
  function handleDragLeave(event) {
    isDragging = false;
  }

  // Handle the drop event (optional)
  async function handleDrop(event) {
    isDragging = false;
    const droppedFiles = [];

    // Handle dropped files
    [...event.dataTransfer.items].forEach(async (item) => {
      if (item.type.startsWith("audio/")) {
        const file = item.getAsFile();
        droppedFiles.push(file);

        try {
          const uint8Array = await readFileAsUint8Array(file);
          await writeFile(`audio/${file.name}`, uint8Array, {
            baseDir: BaseDirectory.AppLocalData,
          });
        } catch (error) {
          console.error("Error reading file", error);
        }
      } else {
        console.error(`Rejected: ${item.name} (not an audio file)`);
      }
    });

    // Notify parent component with the dropped files
    handleFilesDrop(droppedFiles);
    isDragging = false;
  }

</script>




<div class="playlist">
  {#if items && items.length === 0}
    <span class="playlist-empty-tip">Drop audio files here</span>
  {/if}
  <div
    class="playlist-drag-zone {isDragging ? 'highlight' : ''}"
    ondragover={preventDefault(handleDragOver)}
    ondragenter={preventDefault(handleDragEnter)}
    ondragleave={preventDefault(handleDragLeave)}
    ondrop={preventDefault(handleDrop)}
  >
    
  {#if items }
    <section
      class="playlist-items-zone"
      use:dndzone={{ items, flipDurationMs, dropTargetStyle, dropFromOthersDisabled }}
      onconsider={handleDndConsider}
      onfinalize={handleDndFinalize}
    >
      {#each items as item, index (item.id)}
        <div
          class="playlist-item-wrapper"
          animate:flip={{
            duration: flipDurationMs,
            css: "rgba(0, 255, 255, 0.2) solid 10px",
          }}
        >
          <PlaylistItem 
            playlistId={id} 
            item={item}
          />
        </div>
      {/each}
    </section>
  {/if}
  </div>
</div>

<style>
  .playlist {
    display: flex;
    flex-direction: column; /* Ensure items stack vertically */
    height: 100%; /* Changed from -webkit-fill-available */
    box-sizing: border-box;
    overflow-y: auto; /* Changed from scroll to auto */
    position: relative; /* Add positioning context */
    scrollbar-width: none; /* For Firefox */
    -ms-overflow-style: none;  /* For Internet Explorer and Edge */
  }

  /* For WebKit browsers (Chrome, Safari) */
  .playlist::-webkit-scrollbar {
    display: none;
  }

  .playlist-empty-tip {
    display: flex;
    width: 100%; /* Changed from -webkit-fill-available */
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none; /* Allow clicks to pass through */
    color: rgb(0 0 0 / 20%);
    font-size: 32px;
    font-weight: 200;
  }

  .playlist-drag-zone {
    width: 100%; /* Changed from -webkit-fill-available */
    height: 100%; /* Changed from -webkit-fill-available */
    display: flex;
    flex-direction: column;
  }

  .playlist-items-zone {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .playlist-item-wrapper {
  }

  /* Styling for the highlight state during drag */
  .highlight {
    background-color: rgba(0, 0, 255, 0.05);
    border: 2px dashed rgba(0, 0, 255, 0.2);
  }
</style>