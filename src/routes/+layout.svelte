<script>
	import '../app.css';
	import Header from '$lib/components/Header/Header.svelte';
	import Footer from '$lib/components/Footer/Footer.svelte';
	import ToastContainer from '$lib/components/ui/Toasts/ToastContainer.svelte';
	let { children } = $props();
</script>

<ToastContainer />
<Header />
<main class="min-h-screen pt-20 overflow-y-auto">
	{@render children()}
</main>
<Footer />
