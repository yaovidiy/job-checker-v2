<script lang="ts">
	import { onMount } from 'svelte';
	import Loader from '$lib/components/ui/Loader/Loader.svelte';
	import Card from '$lib/components/Feed/Card/Card.svelte';
	import { Prisma } from '@prisma/client';
	import { page } from '$app/stores';
	import Alert from '$lib/components/ui/Alert/Alert.svelte';

	type FeedWithItems = Prisma.FeedGetPayload<{
		include: { feedItems: true };
	}>;
	let { data } = $props();
	let feedDataPromise: Promise<FeedWithItems> | null = $state(null);

	async function fetchFeedData(): Promise<FeedWithItems> {
		const resp = await fetch(`/api/logic/feed?feedId=${data.feedId}`);
		if (!resp.ok) {
			throw new Error(
				`Failed to fetch feed data with error ${resp.statusText} and code ${resp.status}`
			);
		}

		return await resp.json();
	}

	onMount(async () => {
		feedDataPromise = fetchFeedData();
	});
</script>

{#await feedDataPromise}
	<Loader type="spinner" size="lg" color="primary" />
{:then feedData}
	{#if !data.username}
		<Alert
			alertType="error"
			alertText="You need to be logged in to see more then 1 page on the job vacancy"
			extraClasses="mb-5 max-w-lg mx-auto"
		/>
	{/if}
	{#if data.username && !data.userPreferences}
		<Alert
			alertType="warning"
			alertText="You need to set your preferences in order to get more info from this dashboard"
			extraClasses="mb-5 max-w-fit mx-auto"
		/>
	{/if}
	{#if feedData && feedData.feedItems.length > 0}
		<div class="grid gap-5 px-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-10">
			{#each feedData.feedItems as feed}
				<Card {...feed} />
			{/each}
		</div>
	{:else}
		<p class="text-center text-4xl">No feed data found</p>
	{/if}
{:catch error}
	<p class="text-danger text-center text-4xl">Failed to fetch feed data</p>
	<p class="text-danger text-center text-4xl">Error: {error.message ?? error}</p>
{/await}
