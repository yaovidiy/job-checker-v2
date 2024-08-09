<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Input from '$lib/components/ui/Input/Input.svelte';
	import type { Feed } from '@prisma/client';
	import Button from '$lib/components/ui/Button/Button.svelte';
	import { slide } from 'svelte/transition';

	let previousFeeds: Feed[] = $state([]);
	let djinniQueryParams: string = $state('');

	onMount(async () => {
		if (!$page.data?.username) {
			return;
		}

		try {
			const res = await fetch('/api/logic/feed');
			const feeds = await res.json();
			previousFeeds = feeds;
		} catch (error) {
			console.error(error);
		}
	});
</script>

<section class="max-w-lg flex flex-col justify-center items-center mx-auto w-full px-5">
	<h1 class="text-2xl text-center mb-10 font-bold">
		Explore your offers on <a href="https://djinni.co" target="_blank">Djinni.co</a>
	</h1>
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
			on:click={() => {
				goto(`/feed?${djinniQueryParams}`);
			}}
			type="primary"
			extraClasses="mt-5 mx-auto"
		>
			Search
		</Button>
	{/if}
	{#if $page.data?.username}
		{#if !previousFeeds.length}
			<p class="text-lg text-center font-medium">No previous feeds found</p>
		{:else}
			<p class="text-lg text-center font-medium">Click to see previous feed search</p>
			<ul>
				{#each previousFeeds as feed}
					<li>
						<a href="/feed/{feed.id}">{feed.feedUrl}</a>
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
