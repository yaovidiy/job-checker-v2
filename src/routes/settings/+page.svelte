<script lang="ts">
	import Alert from '$lib/components/ui/Alert/Alert.svelte';
	import Loader from '$lib/components/ui/Loader/Loader.svelte';
	import type { userPreferences, userScore } from '@prisma/client';
	import { onMount } from 'svelte';
	import Cookies from '$lib/components/Preferences/Cookies.svelte';
	import Scores from '$lib/components/Preferences/Scores.svelte';
	import toastStore from '$lib/stores/toasts.svelte';
	import { randomId } from '$lib/utils/randomId';

	let preferences = $state<Promise<userPreferences | null> | null>(null);
	let scores = $state<Promise<userScore[] | null> | null>(null);
	let isSavingScores = $state(false);

	async function loadPreferences(): Promise<userPreferences | null> {
		try {
			const resp = await fetch('/api/user/preferences');

			if (!resp.ok) {
				throw new Error(`Failed to load preferences with ${resp.status} code`);
			}

			const res = await resp.json();

			return res;
		} catch (err) {
			toastStore.addToast({
				id: randomId(16),
				type: 'error',
				message: 'Failed to load preferences'
			});
			console.error(err);
			return null;
		}
	}

	async function loadScores(): Promise<userScore[] | null> {
		try {
			const resp = await fetch('/api/user/score');

			if (!resp.ok) {
				throw new Error(`Failed to load scores with ${resp.status} code`);
			}

			const res = await resp.json();

			return res;
		} catch (err) {
			toastStore.addToast({ id: randomId(16), type: 'error', message: 'Failed to load scores' });
			console.error(err);
			return null;
		}
	}

	async function savePreferences(preferences: userPreferences) {
		try {
			const resp = await fetch('/api/user/preferences', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ preferences })
			});

			if (!resp.ok) {
				throw new Error(`Failed to save preferences with ${resp.status} code`);
			}

			toastStore.addToast({
				id: randomId(16),
				type: 'success',
				message: 'Preferences saved successfully'
			});
			return await resp.json();
		} catch (err) {
			toastStore.addToast({
				id: randomId(16),
				type: 'error',
				message: 'Failed to save preferences'
			});
			console.error(err);
		}
	}

	async function saveScores(scores: userScore[]) {
		try {
			isSavingScores = true;
			const resp = await fetch('/api/user/score', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ scores })
			});

			if (!resp.ok) {
				throw new Error(`Failed to save scores with ${resp.status} code`);
			}

			toastStore.addToast({
				id: randomId(16),
				type: 'success',
				message: 'Scores saved successfully'
			});
			return await resp.json();
		} catch (err) {
			toastStore.addToast({ id: randomId(16), type: 'error', message: 'Failed to save scores' });
			console.error(err);
		} finally {
			isSavingScores = false;
		}
	}

	onMount(() => {
		preferences = loadPreferences();
		scores = loadScores();
	});
</script>

{#await preferences}
	<Loader size="lg" type="spinner" color="accent" />
{:then data}
	<Cookies onsave={savePreferences} values={data} />
{:catch err}
	<Alert alertType="error" alertText={err.message ?? err} />
{/await}

{#await scores}
	<Loader size="lg" type="spinner" color="accent" />
{:then data}
	{#if data}
		<Scores values={data} onsave={saveScores} isSaving={isSavingScores} />
	{/if}
{:catch err}
	<Alert alertType="error" alertText={err.message ?? err} />
{/await}
