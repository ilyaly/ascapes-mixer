<script>
  import { writeFile, BaseDirectory } from "@tauri-apps/plugin-fs";
  import { getContext } from "svelte";

  import { flip } from "svelte/animate";
  import { dndzone } from "svelte-dnd-action";

  import Pad from "./Pad.svelte";

  let items = $state([]);

  let playlist = getContext("playlist");

  $effect(() => {
    items = playlist.getPlaylist();
  });

  const flipDurationMs = 100;
  const dropTargetStyle = {
    outline: "rgba(0, 0, 255, 0.0) solid 1px",
  };

  function handleDndConsider(e) {
    items = e.detail.items;
  }

  function handleDndFinalize(e) {
    items = e.detail.items;
  }

  function updateItems() {
    let itemsSnapshot = $state.snapshot(items);

    for (let i = 0; i < itemsSnapshot.length; i++) {
      itemsSnapshot[i].index = i;
    }
    items = itemsSnapshot;
    playlist.setPlaylist(items);
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
          await writeFile(`./audio/${file.name}`, uint8Array, {
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

<div
  class="drag-zone {isDragging ? 'highlight' : ''}"
  ondragover={preventDefault(handleDragOver)}
  ondragenter={preventDefault(handleDragEnter)}
  ondragleave={preventDefault(handleDragLeave)}
  ondrop={preventDefault(handleDrop)}
>
  <section
    class="samples"
    use:dndzone={{ items, flipDurationMs, dropTargetStyle }}
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
        <Pad {item} />
      </div>
    {/each}
  </section>
</div>

<!--
<div class="samples">
	{#each samples as sample}
		<button
			class="sample-button"
		>
			<span
				class="sample-name"
			>
				{sample}
			</span>
		</button>
		
	{/each}
</div>
-->

<style>
  .drag-zone {
    height: 100%;
  }

  .drag-zone.highlight {
    background-color: #0000000d;
  }

  .samples {
    display: grid;
    grid-template-columns: 33% 33% 33%;
    gap: 8px;
  }
</style>
