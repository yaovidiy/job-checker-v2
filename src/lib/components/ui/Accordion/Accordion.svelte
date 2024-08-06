<script lang="ts">
	import { randomId } from '$lib/utils/randomId';
	// import { sanitizeHTML } from '$lib/utils/sanitizeHtml';

	let { accordionItems }: { accordionItems: { title: string; content: string }[] } = $props();

	const id = randomId(10);
</script>

<div class="join join-vertical w-full">
	{#each accordionItems as item, index (item.title)}
		<div class="collapse collapse-plus join-item border-base-300 border">
			<input type="radio" name={id} checked={index === 0 ? true : false} />
			<div class="collapse-title text-xl font-medium">{item.title}</div>
			<div class="collapse-content">
				{@html item.content}
			</div>
		</div>
	{/each}
</div>
