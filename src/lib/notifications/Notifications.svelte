<script>
	import Notification from "./Notification.svelte"

	let { notifications } = $props();
</script>

<div class="notifications">
	{#each notifications as notification, i}
      <Notification
      	id={notification.id}
        text={notification.text}
      /> 
    {/each}
</div>

<style>
	.notifications {
		position: absolute;
	    top: 0px;
	    z-index: 2;
	    width: 100%;
	    display: flex;
	    flex-direction: column;
	    justify-content: center;
	    gap: 8px;
	    margin-block: 16px;
	}
</style>