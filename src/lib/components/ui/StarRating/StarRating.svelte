<script lang="ts">
	const {
		onUpdate,
		initRating,
		colorClass
	}: { onUpdate: (rate: number) => void; initRating?: number; colorClass?: string } = $props();
	const scores = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
  let selected = $state<number>(initRating ?? 0);

  function handleUpdate(score: number) {
    selected = score;
    onUpdate(score);
  }

</script>

<div class="rating rating-lg rating-half">
	{#each scores as score}
		{#if score === 0}
			<input
				onclick={() => handleUpdate(score)}
				value={score}
				checked={score === selected}
				type="radio"
				name="starRating"
				class="rating-hidden"
			/>
		{:else if score % 1 !== 0}
			<input
				onclick={() => handleUpdate(score)}
				value={score}
				checked={score === selected}
				type="radio"
				name="starRating"
				class="mask mask-star-2 mask-half-1 {colorClass ?? 'bg-orange-500'}"
			/>
		{:else}
			<input
				onclick={() => handleUpdate(score)}
				value={score}
				checked={score === selected}
				type="radio"
				name="rating-10"
				class="mask mask-star-2 mask-half-2 {colorClass ?? 'bg-orange-500'}"
			/>
		{/if}
	{/each}
</div>
