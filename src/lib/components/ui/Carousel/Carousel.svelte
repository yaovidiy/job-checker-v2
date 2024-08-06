<script lang="ts">
	import type { Snippet } from 'svelte';
	import { randomId } from '$lib/utils/randomId';

	let {
		backButton,
		nextButton,
		carouselItems
	}: {
		backButton?: Snippet;
		nextButton?: Snippet;
		carouselItems: { image: string }[];
	} = $props();

	let modifiedItems = $derived.by(() => {
		return carouselItems.map((item) => {
			return {
				...item,
				id: randomId(10)
			};
		});
	});
	let currentSlide = $state(0);
	let nextId = $derived.by(() => {
		return modifiedItems[(currentSlide + 1) % modifiedItems.length].id;
	});
	let prevId = $derived.by(() => {
		return modifiedItems[(currentSlide - 1 + modifiedItems.length) % modifiedItems.length].id;
	});

	function switchSlide(operation: 'next' | 'prev') {
		if (operation === 'next') {
			currentSlide = (currentSlide + 1) % modifiedItems.length;
		} else {
			currentSlide = (currentSlide - 1 + modifiedItems.length) % modifiedItems.length;
		}
	}
</script>

<div class="carousel max-h-[500px] w-full relative">
	<div class="absolute hidden left-5 right-5 top-1/2 -translate-y-1/2 transform justify-between">
		{#if backButton}
			{@render backButton()}
		{:else}
			<a href={`#${prevId}`} onclick={() => switchSlide('prev')} class="btn btn-circle">❮</a>
		{/if}

		{#if nextButton}
			{@render nextButton()}
		{:else}
			<a href={`#${nextId}`} onclick={() => switchSlide('next')} class="btn btn-circle">❯</a>
		{/if}
	</div>
	{#each modifiedItems as item, index (item.id)}
		<div id={item.id} class="carousel-item w-full">
			<img src={item.image} class="w-full ob" alt="carousel" />
		</div>
	{/each}
</div>
