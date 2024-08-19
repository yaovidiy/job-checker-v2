<script lang="ts">
	import { onMount } from 'svelte';
	import Card from '$lib/components/Feed/Card/Card.svelte';
	import { Prisma } from '@prisma/client';
	import Alert from '$lib/components/ui/Alert/Alert.svelte';
	import Button from '$lib/components/ui/Button/Button.svelte';
	import { ChevronsLeft, ChevronsRight, RefreshCw } from 'lucide-svelte';
	import toastStore from '$lib/stores/toasts.svelte.js';
	import { randomId } from '$lib/utils/randomId.js';
	import { goto } from '$app/navigation';

	type FeedWithItems = Prisma.FeedGetPayload<{
		include: { feedItems: true };
	}>;
	let { data } = $props();
	let feedDataPromise: Promise<FeedWithItems> | null = $state(null);
	let feedUrl = $state('');
	let feedPage = $state(1);
	let refetching = $state(false);
	let feedId = $state(data.feedId);
	let totalItemsAmount = $state(0);
	let amountOfPages = $derived.by(() => Math.ceil(totalItemsAmount / 15));

	async function fetchFeedData(): Promise<FeedWithItems> {
		const resp = await fetch(`/api/logic/feed?feedId=${feedId}`);
		if (!resp.ok) {
			throw new Error(
				`Failed to fetch feed data with error ${resp.statusText} and code ${resp.status}`
			);
		}

		const res: FeedWithItems = await resp.json();

		feedUrl = res.feedUrl;
		feedPage = res.feedPage;
		totalItemsAmount = res.totalItemsAmount ?? 0;

		return res;
	}

	async function fetchNextPage() {
		refetching = true;

		if (amountOfPages > feedPage + 1) {
			feedPage = feedPage + 1;
			const resp = await fetch(`/api/logic/feed`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ url: feedUrl, page: feedPage })
			});

			const res: { feedId: string } = await resp.json();

			feedId = res.feedId;
			feedDataPromise = fetchFeedData();

			goto(`/feed/${feedId}`);

			refetching = false;
			return;
		}

		toastStore.addToast({
			type: 'info',
			message: 'No more pages to load',
			id: randomId(16)
		});

		refetching = false;
	}

	async function fetchPreviousPage() {
		refetching = true;

		if (feedPage - 1 > 0) {
			feedPage = feedPage - 1;

			const resp = await fetch(`/api/logic/feed`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ url: feedUrl, page: feedPage })
			});

			const res: { feedId: string } = await resp.json();

			feedId = res.feedId;
			feedDataPromise = fetchFeedData();

			goto(`/feed/${feedId}`);

			refetching = false;
			return;
		}

		toastStore.addToast({
			type: 'info',
			message: 'No more pages to load',
			id: randomId(16)
		});

		refetching = false;
	}

	async function refetchFeedData() {
		try {
			refetching = true;
			const resp = await fetch(`/api/logic/feed`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ url: feedUrl, page: feedPage, forceUpdate: true })
			});

			if (!resp.ok) {
				throw new Error(
					`Failed to refetch feed data with error ${resp.statusText} and code ${resp.status}`
				);
			}

			feedDataPromise = fetchFeedData();
		} catch (error) {
			console.error(error);
			toastStore.addToast({
				type: 'error',
				message: 'Failed to refetch feed data',
				id: randomId(16)
			});
		} finally {
			refetching = false;
		}
	}

	onMount(async () => {
		feedDataPromise = fetchFeedData();
	});
</script>

{#await feedDataPromise}
	<div class="grid gap-5 px-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-10">
		{#each Array(6) as _}
			<div class="skeleton w-full min-h-32"></div>
		{/each}
	</div>
{:then feedData}
	{#if data.hasScores}
		<div
			class="flex flex-col lg:flex-row p-4 rounded-2xl bg-neutral text-neutral-content justify-center items-center max-w-fit mx-auto mb-10 gap-5"
		>
			<div class="flex gap-3 items-center">
				<span class="block w-5 h-5 bg-error"></span>
				-
				<p class="text-base">Score less than 30</p>
			</div>
			<div class="flex gap-3 items-center">
				<span class="block w-5 h-5 bg-warning"></span>
				-
				<p class="text-base">Score between 30 and 50</p>
			</div>
			<div class="flex gap-3 items-center">
				<span class="block w-5 h-5 bg-success"></span>
				-
				<p class="text-base">Score more than 50</p>
			</div>
		</div>
	{/if}
	{#if !data.username}
		<Alert
			alertType="error"
			alertText="You need to be logged in to see more then 1 page on the job vacancy"
			extraClasses="mb-5 max-w-lg mx-auto"
		/>
	{/if}
	{#if data.username && !data.userPreferences}
		{#snippet warningContent()}
			<h3 class="text-lg">
				You need to set your <a href="/settings" class="link link-neutral">preferences</a> in order to
				get more info from this dashboard
			</h3>
		{/snippet}
		<Alert
			alertType="warning"
			content={warningContent}
			alertText="You need to set your preferences in order to get more info from this dashboard"
			extraClasses="mb-5 max-w-fit mx-auto"
		/>
	{/if}
	{#if feedData && feedData.feedItems.length > 0}
		<Button onclick={refetchFeedData} type="ghost" extraClasses="mb-5">
			<RefreshCw class={refetching ? 'animate-spin' : ''} />
			Refetch feed items
		</Button>
		{#if feedData.totalItemsAmount}
			<h1 class="text-4xl text-center mb-5">
				Found {totalItemsAmount} results on djinni.co
			</h1>
		{/if}
		<div class="grid gap-5 px-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-10">
			{#each feedData.feedItems as feed}
				<Card {...feed} />
			{/each}
		</div>
		<div class="flex justify-center items-center">
			<div class="join">
				<Button
					isPending={refetching}
					type="ghost"
					onclick={fetchPreviousPage}
					extraClasses="join-item btn !w-fit"
				>
					<ChevronsLeft />
				</Button>
				<button class="join-item btn">Page {feedPage}</button>
				<Button
					isPending={refetching}
					type="ghost"
					onclick={fetchNextPage}
					extraClasses="join-item btn !w-fit"
				>
					<ChevronsRight />
				</Button>
			</div>
		</div>
	{:else}
		<p class="text-center text-4xl">No feed data found</p>
	{/if}
{:catch error}
	<p class="text-danger text-center text-4xl">Failed to fetch feed data</p>
	<p class="text-danger text-center text-4xl">Error: {error.message ?? error}</p>
{/await}
