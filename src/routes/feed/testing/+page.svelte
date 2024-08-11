<script lang="ts">
	import { onMount } from 'svelte';
	let promise = $state<Promise<any> | null>(null);

	async function getScrappedData() {
		try {
			const response = await fetch('/api/logic/scrapper/feed', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					url: 'https://djinni.co/jobs/?primary_keyword=JavaScript'
				})
			});
			const data = await response.json();
			return data;
		} catch (err) {
			return err;
		}
	}
	onMount(() => {
		promise = getScrappedData();
	});
</script>

{#await promise}
  <p>Loading...</p>
{:then data}
  <pre>{JSON.stringify(data, null, 2)}</pre>
{:catch error}
  <p>{error.message ?? error}</p>
{/await}
