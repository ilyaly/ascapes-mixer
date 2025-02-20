<script>
  import { getContext } from "svelte";
  import { onMount } from "svelte";

  let { min, max, currentValue, onSeek, onSeekEnd } = $props();

  let { dragging, seekingValue } = $state({
    dragging: false,
    seekingValue: 0,
  });

  let seekBarRef;

  function updateProgressFromEvent(event) {
    if (!seekBarRef) return;

    const rect = seekBarRef.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const width = rect.width;
    seekingValue = Math.max(0, Math.min(100, (x / width) * 100));
  }

  function handleMouseDown(event) {
    dragging = true;
    updateProgressFromEvent(event);
    onSeek?.(seekingValue);
    /*
	        	This one may help: https://svelte.dev/tutorial/svelte/tweens
	        	onSeek?.(seekingValue);
	        	
	        	Following solution is not good as it locally mutates the prop, however it's simple to prevent several events.
	        */
    //currentValue = seekingValue;
  }

  function handleMouseMove(event) {
    if (!dragging) return;
    updateProgressFromEvent(event);
    onSeek?.(seekingValue);
    /*
	        	onSeek?.(seekingValue);
	        	
	        	Following solution is not good as it locally mutates the prop, however it's simple to prevent several events.
	        */
    //currentValue = seekingValue;
  }

  function handleMouseUp() {
    if (!dragging) return;
    dragging = false;

    onSeekEnd?.(seekingValue);
  }

  onMount(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  });
</script>

<div class="seek-bar" bind:this={seekBarRef} on:mousedown={handleMouseDown}>
  <div class="progress" style:width="{currentValue}%"></div>
  <div class="thumb" class:dragging style:left="{currentValue}%"></div>
</div>

<style>
  .seek-bar {
    position: relative;
    width: 100%;
    height: 6px;
    background: #e0e0e0;
    border-radius: 3px;
    cursor: pointer;
  }

  .seek-bar:hover {
    /* height: 8px; */
  }

  .progress {
    position: absolute;
    left: 0;
    height: 100%;
    background: #2196f3;
    border-radius: 3px;
    pointer-events: none;
  }

  .thumb {
    position: absolute;
    top: 50%;
    width: 12px;
    height: 12px;
    background: #2196f3;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: transform 0.1s ease;
    pointer-events: none;
    opacity: 0;
  }

  .seek-bar:hover .thumb {
    opacity: 1;
  }

  .seek-bar:hover .thumb:global(.dragging) {
    transform: translate(-50%, -50%) scale(1.2);
  }
</style>
