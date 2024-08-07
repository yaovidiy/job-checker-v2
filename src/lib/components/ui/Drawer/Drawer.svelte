<script lang="ts">
	import type { Snippet } from 'svelte';
	import { randomId } from '$lib/utils/randomId';

	let {
		content,
		trigger,
		isOpen = $bindable(false)
	}: {
		content?: Snippet;
		trigger?: Snippet;
		isOpen?: boolean;
	} = $props();

	const id = randomId(16);
</script>

<div class="drawer">
	<input {id} bind:checked={isOpen} type="checkbox" class="drawer-toggle" />
	<div class="drawer-content">
		{#if trigger}
			{@render trigger()}
		{:else}
			<label for={id} class="btn btn-primary drawer-button">Open drawer</label>
		{/if}
	</div>
	<div class="drawer-side">
		<label for={id} aria-label="close sidebar" class="drawer-overlay"></label>
		{#if content}
			{@render content()}
		{:else}
			<ul class="menu bg-base-200 text-base-content min-h-full w-80 p-4">
				<li>Sidebar Item 1</li>
				<li>Sidebar Item 2</li>
			</ul>
		{/if}
	</div>
</div>
