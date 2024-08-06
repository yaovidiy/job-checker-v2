<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from '$lib/components/ui/Button/Button.svelte';

	let {
		trigger,
		header,
		content,
		footer,
		closeOnClickOutside
	}: {
		trigger?: Snippet<[HTMLDialogElement | null]>;
		header?: Snippet;
		content?: Snippet;
		footer?: Snippet<[HTMLDialogElement | null]>;
		closeOnClickOutside?: boolean;
	} = $props();

	let modal: HTMLDialogElement | null = $state(null);
</script>

{#if trigger}
	{@render trigger(modal)}
{:else}
	<Button
		extraClasses="max-w-[150xp] btn-outline"
		onclick={() => {
			modal?.showModal();
		}}
		type="primary">Open modal</Button
	>
{/if}

<dialog bind:this={modal} class="modal">
	<div class="modal-box">
		<div class="modal-header">
			{#if header}
				{@render header()}
			{:else}
				<h2 class="text-xl">New modal</h2>
			{/if}
		</div>
		<div class="modal-content">
			{#if content}
				{@render content()}
			{:else}
				<p class="text-base">New modal base content</p>
			{/if}
		</div>
		{#if footer}
			{@render footer(modal)}
		{/if}
		{#if !closeOnClickOutside && !footer}
			<div class="modal-action">
				<form method="dialog">
					<button class="btn btn-ghost">Close</button>
				</form>
			</div>
		{/if}
	</div>
	{#if closeOnClickOutside}
		<form method="dialog" class="modal-backdrop">
			<button>close</button>
		</form>
	{/if}
</dialog>
