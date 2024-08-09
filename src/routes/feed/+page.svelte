<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import type {Feed} from "@prisma/client";
	import { onMount } from "svelte";
	import Loader from "$lib/components/ui/Loader/Loader.svelte";

  let feedPromise: Promise<Feed[]> | null = null;

  onMount(async () => {
    feedPromise = fetch("/api/logic/feed")
      .then((res) => res.json())
      .catch((error) => {
        console.error(error);
        return [];
      });
  });
</script>

{#await feedPromise}
  <Loader type="spinner" size="lg" color="primary" />
{:then feedsData} 
  <p>dataLoaded</p>
{/await}