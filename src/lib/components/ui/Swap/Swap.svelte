<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		onSwap,
		offSwap,
		isOn = $bindable(false),
		type,
		classes
	}: {
		onSwap?: Snippet;
		offSwap?: Snippet;
		isOn?: boolean;
		type: 'flip' | 'rotate';
		classes?: string;
	} = $props();

	const swapTypes = {
		flip: 'swap-flip',
		rotate: 'swap-rotate'
	};
</script>

<label class="swap {swapTypes[type]} {classes ?? ''}">
	<input type="checkbox" bind:checked={isOn} />

	<div class="swap-on">
		{#if onSwap}
			{@render onSwap()}
		{:else}
			😈
		{/if}
	</div>
	<div class="swap-off">
		{#if offSwap}
			{@render offSwap()}
		{:else}
			😇
		{/if}
	</div>
</label>
