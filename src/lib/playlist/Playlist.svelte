<script>
  import { writeFile, BaseDirectory } from "@tauri-apps/plugin-fs";

  /*

	When we adding a track to the list we have to make it data 
	like other with the isPlaying property.

	*/
  import { getContext } from "svelte";

  import { flip } from "svelte/animate";
  import { dndzone } from "svelte-dnd-action";

  import PlaylistItem from "./PlaylistItem.svelte";

  import PlayIcon from "../icons/PlayIcon.svelte";
  import PauseIcon from "../icons/PauseIcon.svelte";

  let { playlist } = $props();

  let items = $state([]);

  let activePlaylistState = getContext("activePlaylist");
  let playlistsState = getContext("playlists");
  let currentTrackState = getContext("currentTrack");

  $effect(() => {
    items = playlist.tracks;
  });

  //ToDo; So basically we pass only tracks here instead of passing the whole list of playlists
  function updateItems() {
      let itemsSnapshot = $state.snapshot(items);

      for (let i = 0; i < itemsSnapshot.length; i++) {
        itemsSnapshot[i].index = i;
      }


      items = itemsSnapshot;

      activePlaylistState.setActivePlaylist({
        id: playlist.id,
        name: playlist.name,
        description: playlist.description,
        index: playlist.index,
        isActive: playlist.isActive,
        quantity: items.length,
        tracks: items
      })

      playlistsState.setPlaylist({
        id: playlist.id,
        name: playlist.name,
        description: playlist.description,
        index: playlist.index,
        isActive: playlist.isActive,
        quantity: items.length,
        tracks: items
      })
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
<div
    class="drag-zone {isDragging ? 'highlight' : ''}"
    ondragover={preventDefault(handleDragOver)}
    ondragenter={preventDefault(handleDragEnter)}
    ondragleave={preventDefault(handleDragLeave)}
    ondrop={preventDefault(handleDrop)}
  >
    
    {#if items && items.length === 0}
    <span class="drag-zone-tip">Drop audio files here</span>
    {:else}
      <section
        class="playlist-zone"
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
            <PlaylistItem {item} />
          </div>
        {/each}
      </section>
    {/if}
  </div>
</div>

<style>
  .playlist {
    height: 100%;
    overflow: auto;
    scrollbar-width: none; /* Hides the scrollbar */
  }

  /* Hide scrollbar for webkit browsers (Chrome, Safari) */
  .playlist::-webkit-scrollbar {
    display: none;
  }

  .playlist-zone {
    border-radius: 8px;
    /*
		padding: 16px;
		margin: 8px;
		*/
    display: flex;
    flex-direction: column;
  }

  .playlist-item-wrapper {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .drag-zone {
    position: relative;
    height: -webkit-fill-available;
  }

  .drag-zone.highlight {
    background-color: #0000000d;
  }

  .drag-zone-tip {
    position: absolute;
    color: rgb(0 0 0 / 20%);
    display: flex;
    width: 100%;
    justify-content: center;
    height: -webkit-fill-available;
    align-items: center;
    font-size: 48px;
    font-weight: 100;
    z-index: -1;
  }
</style>
