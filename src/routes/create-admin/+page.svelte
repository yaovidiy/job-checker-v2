<script lang="ts">
	import SignUp from '$lib/components/Auth/SignUp.svelte';
	import type { signUpData } from '$lib/types';
	import { goto } from '$app/navigation';

	let error = $state('');
	let success = $state('');

	async function onEmailAuth(data: signUpData) {
		try {
			error = '';

			const resp = await fetch('/api/admin/create-admin', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});

			if (!resp.ok) {
				throw new Error('Failed to create admin');
			}

			const res = await resp.json();

			if (!res.success) {
				throw new Error(res.message);
			}

			goto('/admin');
		} catch (error) {
			console.error(error);
			error = 'Failed to create admin';
		}
	}
</script>

<SignUp {onEmailAuth} />

{#if error}
	<p class="text-red-500">{error}</p>
{/if}

{#if success}
	<p class="text-green-500">{success}</p>
{/if}
