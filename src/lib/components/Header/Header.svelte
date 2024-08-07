<script lang="ts">
	import { Menu, X } from 'lucide-svelte';
	import Swap from '$lib/components/ui/Swap/Swap.svelte';
	import Drawer from '$lib/components/ui/Drawer/Drawer.svelte';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher/ThemeSwitcher.svelte';
	import Button from '$lib/components/ui/Button/Button.svelte';
	import Dropdown from '$lib/components/ui/Dropdown/Dropdown.svelte';
	import { page } from '$app/stores';

	let isDrawerOpen = $state<boolean>(false);
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
	<ul class="menu bg-base-200 text-base-content min-h-full w-80 p-4">
		<li><a href="/">lg item 1</a></li>
		<li><a href="/">lg item 2</a></li>
	</ul>
{/snippet}

<header class="navbar bg-base-200 w-screen">
	<div class="navbar-start">
		<span class="lg:hidden">
			<Drawer trigger={drawerTrigger} content={drawerContent} bind:isOpen={isDrawerOpen} />
		</span>
	</div>
	<div class="navbar-center hidden lg:flex">
		<ul class="menu bg-base-200 lg:menu-horizontal rounded-box">
			<li><a href="/">lg item 1</a></li>
			<li><a href="/">lg item 2</a></li>
		</ul>
	</div>
	<div class="navbar-end gap-2">
		<ThemeSwitcher />

		{#if !$page.data?.user}
			<Button type="primary" isOutlined>Sign in</Button>
			<Button type="primary">Sign up</Button>
		{:else}
			<Dropdown>
				<ul class="menu bg-base-200 w-56 p-0 [&_li>*]:rounded-none">
					<li><a href="/">Item 1</a></li>
					<li><a href="/">Item 2</a></li>
					<li><a href="/">Item 3</a></li>
				</ul>
			</Dropdown>
		{/if}
	</div>
</header>
