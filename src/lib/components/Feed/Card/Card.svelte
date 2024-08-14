<script lang="ts">
	import type { FeedItem } from '@prisma/client';

	let {
		title,
		link,
		feedId,
		companyName,
		shortDescription,
		description,
		postDate,
		pubSalaryMin,
		reviewCount,
		appliesCount,
		isApplied,
		location,
		typeOfJob,
		experience,
		englishLevel,
		score
	}: FeedItem = $props();

	function setBackGroundColor() {
		const colors = {
			error: 'bg-error text-error-content',
			success: 'bg-success text-success-content',
			warning: 'bg-warning text-warning-content',
			default: 'bg-neutral text-neutral-content'
		};

		let colorKey: 'error' | 'success' | 'warning' | 'default' = 'default';

		if (!score || score <= 0) {
			return colors.default;
		}

		if (score >= 50) {
			colorKey = 'success';
		} else if (score >= 30) {
			colorKey = 'warning';
		} else {
			colorKey = 'error';
		}

		return colors[colorKey];
	}
</script>

<div class="card card-compact py-5 {setBackGroundColor()} card-bordered w-full shadow-xl">
	<div class="card-title px-4 flex justify-between items-center">
		<a href={`https://djinni.co${link}`} target="_blank" class="text-lg link font-bold">{title}</a>
		<p class="text-xs">{companyName}</p>
	</div>
	<div class="text-sm px-4 opacity-70">
		{#if reviewCount}
			<span>{reviewCount} reviews</span>
			<span class="w-1 h-1 rounded-full">|</span>
		{/if}
		{#if appliesCount}
			<span>{appliesCount} applies</span>
			<span class="w-1 h-1 rounded-full">|</span>
		{/if}
		{#if appliesCount && reviewCount}
			<span class="font-bold">{((appliesCount / reviewCount) * 100).toFixed(2)}% applied</span>
			<span class="w-1 h-1 rounded-full">|</span>
		{/if}
		<span>{location}</span>
		<span class="w-1 h-1 rounded-full">|</span>
		<span>{typeOfJob}</span>
		<span class="w-1 h-1 rounded-full">|</span>
		{#if experience !== 'Not found'}
			<span>{experience} years experience</span>
			<span class="w-1 h-1 rounded-full">|</span>
		{/if}
		<span>{englishLevel}</span>

		{#if pubSalaryMin}
			<span class="w-1 h-1 rounded-full">|</span>
			<span>${pubSalaryMin}</span>
		{/if}
	</div>
	<div class="card-body">
		<p class="text-sm font-medium">{shortDescription}</p>
	</div>
</div>
