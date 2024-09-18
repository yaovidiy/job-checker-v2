<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { Prisma } from '@prisma/client';
	import Button from '$lib/components/ui/Button/Button.svelte';
	import Tooltip from '$lib/components/ui/Tooltip/Tooltip.svelte';

	type Feed = Prisma.FeedGetPayload<{
		include: { feedItems: false };
	}>;
	let previousFeeds: Record<string, Feed[]> = $state({});
	let djinniQueryParams: string = $state('');

	onMount(async () => {
		if (!$page.data?.username) {
			return;
		}

		try {
			const res = await fetch('/api/logic/feed/all');
			const feeds = await res.json();
			previousFeeds = feeds;

			console.log(feeds);
		} catch (error) {
			console.error(error);
		}
	});
</script>

<section class="max-w-lg flex flex-col justify-center items-center mx-auto w-full px-5">
	<h1 class="text-2xl text-center mb-2 font-bold">
		Explore your offers on <a href="https://djinni.co" target="_blank">Djinni.co</a>
	</h1>
	<p class="text-sm text-center font-medium mb-1">
		Enter your search query below and click search to see the results.
	</p>
	<p class="text-sm text-center font-medium mb-10">
		For now you can only search job offers from Djinni.co. In the future we will add more sources.
	</p>
	<label class="input input-bordered mb-5 flex items-center gap-2">
		https://djinni.co/jobs/?
		<input
			bind:value={djinniQueryParams}
			type="text"
			placeholder="primary_keyword=JavaScript"
			class="grow"
		/>
	</label>
	{#if djinniQueryParams !== ''}
		<Button
			onclick={() => {
				goto(`/feed/${djinniQueryParams}`);
			}}
			type="primary"
			extraClasses="my-5 mx-auto"
		>
			Search
		</Button>
	{/if}
	{#if $page.data?.username}
		{#if !Object.keys(previousFeeds).length}
			<p class="text-lg text-center font-medium">No previous feeds found</p>
		{:else}
			<p class="text-lg text-center mb-3 font-medium">Click to see previous feed search</p>
			<ul>
				{#each Object.keys(previousFeeds) as feed}
					<li class="mb-5 relative">
						<div role="button" tabindex="0" class="collapse bg-neutral text-neutral-content">
							<input type="checkbox" />
							<div class="collapse-title text-base font-medium">
								{feed}
							</div>
							<div class="collapse-content">
								<div class="flex flex-col">
									{#each previousFeeds[feed] as item}
										<a href={`feed/${item.id}`} class="link">
											Page {item.feedPage}
										</a>
									{/each}
								</div>
							</div>
						</div>
						{#snippet PageToolTipTrigger()}
							<div
								class="badge w-5 h-5 rounded-full px-1 py-1 badge-primary text-primary-content badge-lg"
							>
								{previousFeeds[feed].length}
							</div>
						{/snippet}
						<Tooltip trigger={PageToolTipTrigger} type="primary" tooltip="Amount of pages" extraClasses={`absolute -top-3 right-2`} />							
					</li>
				{/each}
			</ul>
		{/if}
	{:else}
		<p class="text-lg text-center font-medium">
			Not regestered users can't save search and go above first page of the results.
		</p>
	{/if}
</section>
