<script>
	import { getContext } from "svelte";
	import DeleteIcon from "../icons/DeleteIcon.svelte";

	let { id, text } = $props();

	let notificationsContext = getContext("notifications")

	function handleDelete() {
		let tempNotifications = $state.snapshot(notificationsContext.getNotifications());
		tempNotifications = tempNotifications.filter(notification => notification.id !== id);

		notificationsContext.setNotifications(tempNotifications);
	}
</script>

<div class="notification">
	<div class="notification-content">
		<div class="notification-text">{ text }</div>
		<button 
			class="notification-close"
			onclick={handleDelete} 
		>
			<DeleteIcon
				size={32}
			/>
		</button>
	</div>
</div>

<style>
	.notification {
	    top: 0px;
	    z-index: 2;
	    width: 100%;
	    display: flex;
	    justify-content: center;
		
	}

	.notification-content {
		width: 100%;
		border-radius: 5px;
		padding-inline: 8px;
		margin-inline: 8px;	
		background: #fff;
		color: rgba(255, 0, 0, 0.90);
		font-size: 16px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	    align-items: center;
	    box-shadow: 0 0 2px 0px rgba(255, 0, 0, 0.70);
	}

	.notification-close-button {
		
		background-color: red;
		color: #fff;
		border: 1px solid #000;
		border-radius: 5px;
	}


	button {
		background: none;
		border: none;
		color: #000;
		font-style: bold;
		display: flex;
		fill: rgba(255, 0, 0, 0.70);
	}

	button:hover {
		cursor: pointer;
		fill: rgba(255, 0, 0, 1.00);
	}
</style>