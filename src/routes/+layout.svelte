<script>
	import '../app.css';
	import Header from '$lib/components/Header/Header.svelte';
	import Footer from '$lib/components/Footer/Footer.svelte';
	let { children } = $props();
</script>

<Header />
<main class="min-h-screen overflow-y-auto">
	{@render children()}
</main>
<Footer />
