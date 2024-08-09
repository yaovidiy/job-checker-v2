<script lang="ts">
	import { Menu, X } from 'lucide-svelte';
	import Swap from '$lib/components/ui/Swap/Swap.svelte';
	import Drawer from '$lib/components/ui/Drawer/Drawer.svelte';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher/ThemeSwitcher.svelte';
	import Button from '$lib/components/ui/Button/Button.svelte';
	import Dropdown from '$lib/components/ui/Dropdown/Dropdown.svelte';
	import Modal from '$lib/components/Modal/Modal.svelte';
	import Login from '$lib/components/Auth/Login.svelte';
	import SignUp from '../Auth/SignUp.svelte';
	import { page } from '$app/stores';

	async function login(username: string, password: string, modal: HTMLDialogElement | null) {
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
			modal?.close();
			window.location.reload();
		}
	}

	let isDrawerOpen = $state<boolean>(false);
	let loginError = $state<string | null>(null);
</script>

{#snippet drawerTrigger()}
	{#snippet off()}
		<Menu />
	{/snippet}
	{#snippet on()}
		<X />
	{/snippet}
	<Swap onSwap={on} offSwap={off} bind:isOn={isDrawerOpen} type="rotate" classes="text-4xl" />
{/snippet}

{#snippet dropdownTrigger()}
	<Button type="ghost">{$page.data?.user?.username ?? 'Profile'}</Button>
{/snippet}

{#snippet drawerContent()}
	<ul class="menu menu-lg bg-base-200 z-50 text-base-content min-h-full w-80 p-4">
		<li><a href="/">lg item 1</a></li>
		<li><a href="/">lg item 2</a></li>
	</ul>
{/snippet}

{#snippet modalSignUpTrigger(modal: HTMLDialogElement | null)}
	<Button type="accent" extraClasses="!w-auto" onclick={() => modal?.showModal()}>Sign up</Button>
{/snippet}

{#snippet modalSignInContent(modal: HTMLDialogElement | null)}
	<Login {loginError} onEmailAuth={(username, password) => login(username, password, modal)} />
{/snippet}

{#snippet modalEmptyFooter()}
	<span class="hidden"></span>
{/snippet}

{#snippet modalEmptyHeader(modal: HTMLDialogElement | null)}
	<Button
		type="ghost"
		onclick={() => modal?.close()}
		extraClasses="absolute top-0 right-4 !w-[48px] !min-h-[40px] !p-0"><X size={24} /></Button
	>
	<span class="hidden"></span>
{/snippet}

{#snippet modalSignUpContent()}
	<SignUp />
{/snippet}

{#snippet modalSignInTrigger(modal: HTMLDialogElement | null)}
	<Button type="accent" onclick={() => modal?.showModal()} isOutlined extraClasses="!w-auto"
		>Sign in</Button
	>
{/snippet}

<header class="navbar px-5 bg-base-200 w-screen">
	<div class="navbar-start items-center gap-2">
		<span class="hidden items-center justify-center">
			<Drawer trigger={drawerTrigger} content={drawerContent} bind:isOpen={isDrawerOpen} />
		</span>
		<a href="/" class="text-2xl font-bold"><span class="text-accent">Ch</span>ecker</a>
	</div>
	<div class="navbar-center hidden">
		<ul class="menu bg-base-200 lg:menu-horizontal rounded-box">
			<li><a href="/">lg item 1</a></li>
			<li><a href="/">lg item 2</a></li>
		</ul>
	</div>
	<div class="navbar-end gap-2">
		<span class="hidden lg:inline">
			<ThemeSwitcher />
		</span>

		{#if !$page.data?.username}
			<Modal
				trigger={modalSignInTrigger}
				content={modalSignInContent}
				footer={modalEmptyFooter}
				header={modalEmptyHeader}
			/>

			<Modal
				trigger={modalSignUpTrigger}
				content={modalSignUpContent}
				footer={modalEmptyFooter}
				header={modalEmptyHeader}
			/>
		{:else}
			<Dropdown trigger={dropdownTrigger}>
				<ul class="menu z-50 bg-base-200 w-56 p-0 [&_li>*]:rounded-none">
					<li><a href="/logout">Log out</a></li>
				</ul>
			</Dropdown>
		{/if}
	</div>
</header>
