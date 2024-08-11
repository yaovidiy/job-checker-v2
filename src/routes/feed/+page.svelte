<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Loader from '$lib/components/ui/Loader/Loader.svelte';

	let feedPromise: Promise<void> | null = $state(null);
	let { data } = $props();

	async function createFeed() {
		const resp = await fetch('/api/logic/feed', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ url: data.feedUrl })
		});

		if (!resp.ok) {
			throw new Error(
				`Failed to create feed page for the given link with error ${resp.statusText} and code ${resp.status}`
			);
		}

		const res = await resp.json();

		setTimeout(() => {
			goto(`/feed/${res.feedId}`);
		}, 2000);
	}

	onMount(async () => {
		feedPromise = createFeed();
	});
</script>

{#await feedPromise}
	<Loader type="spinner" size="lg" color="primary" />
{:then _}
	<h1 class="text-success text-center text-4xl">
		Feed have been create you will be redirected to the feed page in 2 seconds
	</h1>
{:catch error}
	<p class="text-danger text-center text-4xl">Failed to create feed page for the given link</p>
	<p class="text-danger text-center text-4xl">Error: {error.message ?? error}</p>
{/await}
