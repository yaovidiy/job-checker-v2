<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children, trigger }: { children: Snippet; trigger?: Snippet } = $props();
</script>

<div class="dropdown">
	{#if trigger}
		{@render trigger()}
	{:else}
		<div tabindex="0" role="button" class="btn m-1">Open dropdown</div>
	{/if}
	<div class="dropdown-content z-10">
		{@render children()}
	</div>
</div>
