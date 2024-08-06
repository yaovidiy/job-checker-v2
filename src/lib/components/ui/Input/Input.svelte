<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputTypeAttribute } from 'svelte/elements';
	import { slide } from 'svelte/transition';
	let {
		extraClasses,
		isError,
		errorMessage,
		icon,
		disabled,
		readonly,
		placeholder,
		type,
		value,
		label,
		onInput,
		onBlur
	}: {
		extraClasses?: string;
		isError?: boolean;
		errorMessage?: string;
		icon?: Snippet;
		placeholder?: string;
		type: HTMLInputTypeAttribute;
		value: string;
		label?: string;
		disabled?: boolean;
		readonly?: boolean;
		onInput?: (value: string) => void;
		onBlur?: (value: string) => void;
	} = $props();
</script>

<label class={`form-control w-full max-w-xs ${extraClasses}`}>
	{#if label}
		<div class="label">
			<span class="label-text">{label}</span>
		</div>
	{/if}
	<div class={`input ${isError ? 'input-error' : ''} input-bordered flex items-center gap-2`}>
		{#if icon}
			{@render icon()}
		{/if}
		<input
			onblur={(e) => onBlur && onBlur(value)}
			oninput={(e) => onInput && onInput(value)}
			bind:value
			{type}
			{placeholder}
			{disabled}
			{readonly}
			class="w-full"
		/>
	</div>
	{#if isError}
		<div class="label" transition:slide>
			<span class="label-text-alt text-red-500">{errorMessage}</span>
		</div>
	{/if}
</label>
