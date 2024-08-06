<script lang="ts">
	import type { Snippet } from 'svelte';

	const {
		onSwap,
		offSwap,
		type,
		classes
	}: {
		onSwap?: Snippet;
		offSwap?: Snippet;
		type: 'flip' | 'rotate';
		classes?: string;
	} = $props();

	const swapTypes = {
		flip: 'swap-flip',
		rotate: 'swap-rotate'
	};
</script>

<label class="swap {swapTypes[type]} {classes ?? ''}">
	<input type="checkbox" />

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
