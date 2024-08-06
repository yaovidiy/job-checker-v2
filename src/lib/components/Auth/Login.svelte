<script lang="ts">
	import { goto } from '$app/navigation';
	import Input from '$lib/components/ui/Input/Input.svelte';
	import Button from '$lib/components/ui/Button/Button.svelte';

	const {
		hasGoogleAuth,
		hasGithubAuth,
		onEmailAuth,
		onGoogleAuth,
		onGithubAuth
	}: {
		hasGoogleAuth?: boolean;
		hasGithubAuth?: boolean;
		onEmailAuth?: () => void;
		onGoogleAuth?: () => void;
		onGithubAuth?: () => void;
	} = $props();
	let loginError = $state<string | null>(null);
	let username = $state('');
	let password = $state('');

	async function login() {
		const resp = await fetch('/api/auth/login', {
			method: 'POST',
			body: JSON.stringify({
				username,
				password
			})
		});

		if (!resp.ok) {
			const error = await resp.json();
			loginError = error.message;

			return;
		}

		const res = await resp.json();

		if (res.success) {
			goto('/');
		}
	}
</script>

{#snippet usernameSVG()}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 16 16"
		fill="currentColor"
		class="w-4 h-4 opacity-70"
		><path
			d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z"
		/></svg
	>
{/snippet}
{#snippet passwordSvg()}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 16 16"
		fill="currentColor"
		class="w-4 h-4 opacity-70"
		><path
			fill-rule="evenodd"
			d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
			clip-rule="evenodd"
		/></svg
	>
{/snippet}

<div class="flex flex-col items-center gap-5">
	<h3 class="text-xl font-bold text-center">Login</h3>
	<Input
		type="text"
		value={username}
		isError={loginError !== null}
		errorMessage={loginError ?? ''}
		icon={usernameSVG}
		placeholder="Username"
	/>
	<Input
		type="password"
		value={password}
		isError={loginError !== null}
		errorMessage={loginError ?? ''}
		icon={passwordSvg}
		placeholder="Password"
	/>

	<Button type="primary" onclick={() => (onEmailAuth && onEmailAuth()) || login()}>Login</Button>
</div>
