<script lang="ts">
	import type { Snippet } from 'svelte';
	let {
		alertText,
		alertType,
		extraClasses,
		content
	}: {
		alertText: string;
		alertType: 'success' | 'error' | 'warning' | 'info';
		extraClasses?: string;
		content?: Snippet<[string]>;
	} = $props();
	const alertClasses = {
		success: 'alert-success',
		error: 'alert-error',
		warning: 'alert-warning',
		info: 'alert-info'
	};
</script>

<div role="alert" class={`alert ${alertClasses[alertType]} ${extraClasses}`}>
	{#if content}
		{@render content(alertText)}
	{:else}
		<span>{alertText}</span>
	{/if}
</div>
