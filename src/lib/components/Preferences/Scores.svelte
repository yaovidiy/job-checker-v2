<script lang="ts">
	import Button from '$lib/components/ui/Button/Button.svelte';
	import type { userScore } from '@prisma/client';
	import { onMount } from 'svelte';
	import { randomId } from '$lib/utils/randomId';
	import { CirclePlus, SaveAll, Trash2 } from 'lucide-svelte';
	import { slide } from 'svelte/transition';

	const {
		onsave,
		onreset,
    isSaving,
		values
	}: {
		onsave?: (scores: userScore[]) => void;
		onreset?: () => void;
    isSaving: boolean;
		values: userScore[] | null;
	} = $props();

	let totalScore = $derived.by(() => {
		return scores.reduce((acc, score) => acc + score.score, 0);
	});
	let scores: userScore[] = $state([]);
	let isUpdated = $derived.by(() => {
		return values?.length !== scores.length;
	});

	function addNewScore() {
		scores = [...scores, { id: randomId(16), userId: '', searchValue: '', score: 0 }];
	}

	onMount(() => {
		if (values) {
			scores = [...values];
		}
	});
</script>

<h1 class="text-center text-5xl mb-2">Scores</h1>
<p class="text-base max-w-xl mx-auto mb-5 text-center">
	In order to hightlight vacancies that are interesting for you, you need to provide your scores for
	this services. Please remember that total score shouldn't be more than 100.
</p>
<h2 class="text-xl text-center mb-10">Your total score: {totalScore}</h2>
<div class="flex flex-col mx-auto w-full border-b-4 border-neutral pb-10 mb-10 gap-5">
	{#each scores as score, i}
		<div transition:slide class="flex gap-5 max-w-full md:max-w-2xl mx-auto">
			<label class="input max-w-3xl mx-auto text-nowrap input-bordered flex items-center gap-2">
				Search Value:
				<input type="text" class="" placeholder="Fornt end" bind:value={score.searchValue} />
			</label>
			<label class="input max-w-3xl mx-auto input-bordered flex items-center gap-2">
				Score:
				<input type="number" class="grow" placeholder="Set score value" bind:value={score.score} />
			</label>
			<Button
				extraClasses="max-w-3xl min-w-fit p-4 h-fit w-fit md:w-fit mx-auto"
				type="error"
				onclick={() => (scores = scores.filter((_, index) => index !== i))}
			>
				<Trash2 size={24} />
			</Button>
		</div>
	{/each}
	<div class="flex gap-2 justify-center">
		<Button
      onclick={() => onsave && onsave(scores)}
      isPending={isSaving}
			isDisabled={!isUpdated || totalScore > 100}
			type="success"
			extraClasses="max-w-3xl p-4 h-fit min-w-fit w-fit md:w-fit"><SaveAll /></Button
		>
		{#if totalScore < 100}
			<Button
				extraClasses="max-w-3xl p-4 h-fit min-w-fit w-fit md:w-fit"
				type="primary"
				onclick={addNewScore}
				isOutlined
			>
				<CirclePlus />
			</Button>
		{/if}
	</div>
</div>
