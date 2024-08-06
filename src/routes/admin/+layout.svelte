<script lang="ts">
	import ToastContainer from '$lib/components/ui/Toasts/ToastContainer.svelte';

	const { children } = $props();
</script>

<ToastContainer />
{@render children()}
