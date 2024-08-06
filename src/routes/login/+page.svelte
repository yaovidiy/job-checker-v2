<!-- routes/login/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import Input from '$lib/components/ui/Input/Input.svelte';
	import Button from '$lib/components/ui/Button/Button.svelte';
	import { goto } from '$app/navigation';
	import { Github, Chrome } from 'lucide-svelte';
</script>

<div class="card m-auto bg-base-200 shadow-xl md:max-w-96">
	<div class="card-body">
		<h1 class="card-title justify-center text-center text-4xl">Sign In</h1>
		<form class="flex flex-col gap-3 items-center" method="post" use:enhance>
			<Input label="Username" extraClasses="max-w-xs" value="" placeholder="Username" type="text" />
			<Input label="Password" type="password" value="" placeholder="Password" />
			<Button type="primary" extraClasses="md:max-w-full">Login</Button>
		</form>

		<div class="flex flex-col mt-5 gap-5">
			<Button
				type="ghost"
				extraClasses="md:max-w-full"
				onclick={() => {
					goto('/signup');
				}}>Sign UP</Button
			>
			<Button
				type="ghost"
				extraClasses="md:max-w-full flex gap-2 items-center"
				onclick={() => {
					goto('/api/auth/github');
				}}
			>
				<Github size="24" />
				Sign in with GitHub
			</Button>
			<Button onclick={() => {
				goto('/api/auth/google');
			}} type="info" extraClasses="md:max-w-full flex gap-2 items-center">
				<Chrome />
				Sign in with Google
			</Button>
		</div>
	</div>
</div>
