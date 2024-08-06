<script lang="ts">
	import toastStore from '$lib/stores/toasts.svelte';
	import ToastMessage from './ToastMessage.svelte';
</script>

<div class="toast toast-end">
	{#each toastStore.toasts as toast}
		<ToastMessage {...toast} />
	{/each}
</div>
