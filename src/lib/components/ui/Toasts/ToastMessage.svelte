<script lang="ts">
	import { onMount, type Snippet } from 'svelte';

	let {
		message,
		type,
		content
	}: {
		message: string;
		type: 'success' | 'error' | 'warning' | 'info';
		content?: Snippet<[string]>;
	} = $props();

	let progress = $state(0);

	const alertClasses = {
		success: 'alert-success',
		error: 'alert-error',
		warning: 'alert-warning',
		info: 'alert-info'
	};

	const progressClasses = {
		success: 'progress-primary',
		error: 'progress-warning',
		warning: 'progress-error',
		info: 'progress-success'
	};

	onMount(() => {
		const interval = setInterval(() => {
			progress += 2;
			if (progress >= 100) {
				clearInterval(interval);
			}
		}, 100);

		return () => clearInterval(interval);
	});
</script>

<div class={`alert relative ${alertClasses[type]}`}>
	<progress class="progress h-1 absolute transition-all top-2 left-3 {progressClasses[type]} w-1/3" value={progress} max="100"></progress>
	{#if content}
		{@render content(message)}
	{:else}
		<span>{message}</span>
	{/if}
</div>
