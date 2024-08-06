<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		tooltip,
		isOpen,
		type,
		trigger
	}: {
		tooltip: string;
		isOpen?: boolean;
		type?: 'error' | 'success' | 'warning' | 'info' | 'primary' | 'secondary' | 'accent';
		trigger?: Snippet;
	} = $props();

	const tooltipClasses = {
		error: 'tooltip-error',
		success: 'tooltip-success',
		warning: 'tooltip-warning',
		info: 'tooltip-info',
		primary: 'tooltip-primary',
		secondary: 'tooltip-secondary',
		accent: 'tooltip-accent'
	};
</script>

<div
	class={`tooltip ${type ? tooltipClasses[type] : ''} ${isOpen ? 'tooltip-open' : ''}`}
	data-tip={tooltip}
>
	{#if trigger}
		{@render trigger()}
	{:else}
		<button class="btn btn-neutral">Hover me!</button>
	{/if}
</div>
