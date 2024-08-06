<script lang="ts">
	import type { Snippet } from 'svelte';

	let { article }: { article: Snippet } = $props();
</script>

<article class="prose lg:prose-lg prose-slate mx-auto">
	{@render article()}
</article>
