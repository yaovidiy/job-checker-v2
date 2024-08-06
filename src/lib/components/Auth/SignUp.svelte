<script lang="ts">
	import Input from '$lib/components/ui/Input/Input.svelte';
	import Button from '$lib/components/ui/Button/Button.svelte';
	import { validateEmail, validatePassword } from '$lib/utils/general';
	import { type signUpData } from '$lib/types';

	const {
		hasGithubAuth,
		hasGoogleAuth,
		isPending,
		onEmailAuth,
		onGithubAuth,
		onGoogleAuth
	}: {
		hasGoogleAuth?: boolean;
		hasGithubAuth?: boolean;
		isPending?: boolean;
		onEmailAuth?: (data: signUpData) => void;
		onGoogleAuth?: () => void;
		onGithubAuth?: () => void;
	} = $props();

	let isEmailError = $state(false);
	let isPasswordError = $state(false);
	let isRepeatPasswordError = $state(false);
	let emailErrorText = $state('');
	let passwordErrorText = $state('');
	let repeatPasswordErrorText = $state('');

	let emailValue = $state('');
	let passwordValue = $state('');
	let repeatPasswordValue = $state('');

	function isEmailValid(value: string) {
		isEmailError = !validateEmail(value);
		emailValue = value;

		if (isEmailError) {
			emailErrorText = 'Invalid email';
		} else {
			emailErrorText = '';
		}
	}

	function isPasswordValid(value: string) {
		isPasswordError = !validatePassword(value);
		passwordValue = value;

		if (isPasswordError) {
			passwordErrorText = 'Password must be at least 8 characters long';
		} else {
			passwordErrorText = '';
		}
	}

	function isRepeatPasswordValid(value: string) {
		isRepeatPasswordError = passwordValue !== value;
		repeatPasswordValue = value;

		if (isRepeatPasswordError) {
			repeatPasswordErrorText = 'Passwords do not match';
		} else {
			repeatPasswordErrorText = '';
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

<div class="flex items-center mx-auto max-w-xs flex-col gap-5">
	<h2 class="text-xl font-bold text-center">Sign Up</h2>

	<Input
		extraClasses="max-w-xs"
		value={emailValue}
		isError={isEmailError}
		errorMessage={emailErrorText}
		icon={usernameSVG}
		placeholder="Username"
		type="text"
		onBlur={(value) => isEmailValid(value)}
	/>
	<Input
		extraClasses="max-w-xs"
		value={passwordValue}
		isError={isPasswordError}
		errorMessage={passwordErrorText}
		icon={passwordSvg}
		placeholder="Password"
		type="password"
		onBlur={(value) => isPasswordValid(value)}
	/>
	<Input
		extraClasses="max-w-xs"
		value={repeatPasswordValue}
		isError={isRepeatPasswordError}
		errorMessage={repeatPasswordErrorText}
		icon={passwordSvg}
		placeholder="Repeat Password"
		type="password"
		onInput={(value) => isRepeatPasswordValid(value)}
	/>

	<Button
		extraClasses="md:max-w-full"
		type="primary"
		{isPending}
		onclick={() =>
			onEmailAuth &&
			onEmailAuth({
				email: emailValue,
				password: passwordValue,
				repeatPassword: repeatPasswordValue
			})}>Sign Up</Button
	>
</div>
