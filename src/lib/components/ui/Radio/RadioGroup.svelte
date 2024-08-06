<script lang="ts">
	import Radio from './Radio.svelte';

	let {
		radios,
    onValueChange
	}: {
		radios: {
			name: string;
			value: string | number;
			size: 'xs' | 'sm' | 'md' | 'lg';
			type: 'primary' | 'secondary' | 'accent' | 'error' | 'success' | 'warning' | 'info';
			label?: string;
			isChecked?: boolean;
		}[];
    onValueChange?: (value: string | number) => void;
	} = $props();
</script>

<div class="form-control">
	{#each radios as radio}
		<label class="label cursor-pointer">
			<span class="label-text">{radio.label ?? ''}</span>
			<Radio
				name={radio.name}
				type={radio.type}
				value={radio.value}
				isChecked={radio.isChecked}
				size={radio.size}
        onValueChange={onValueChange}
			/>
		</label>
	{/each}
</div>
