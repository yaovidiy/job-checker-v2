<script lang="ts">
	import type { Snippet } from 'svelte';
	import Loader from '$lib/components/ui/Loader/Loader.svelte';

	let {
		children,
		type,
		isOutlined,
		extraClasses,
		isPending,
		isDisabled,
		onclick
	}: {
		children: Snippet;
		type: 'primary' | 'secondary' | 'ghost' | 'error' | 'success' | 'warning' | 'info';
		isOutlined?: boolean;
		isPending?: boolean;
		isDisabled?: boolean;
		extraClasses?: string;
		onclick?: () => void;
	} = $props();

	const buttonTypes = {
		primary: 'btn-primary',
		secondary: 'btn-secondary',
		ghost: 'btn-ghost',
		error: 'btn-error',
		success: 'btn-success',
		warning: 'btn-warning',
		info: 'btn-info'
	};

	let buttonClasses = `btn disabled:cursor-not-allowed text-base font-bold ${isOutlined ? 'btn-outline' : ''} ${buttonTypes[type]} min-h-[50px] md:max-w-[250px] w-full ${extraClasses ?? ''}`;
</script>

<button {onclick} disabled={isPending || isDisabled} class={buttonClasses} type="button">
	{#if isPending}
		<Loader type="spinner" size="lg" color="primary" />
	{:else}
		{@render children()}
	{/if}
</button>
