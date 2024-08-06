<script>
	import '../app.css';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher/ThemeSwitcher.svelte';
	let { children } = $props();
</script>

<ThemeSwitcher />
{@render children()}
