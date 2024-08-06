<script lang="ts">
	const {
		type,
		size,
		selectLabel,
		selectedValue,
		options,
		label,
		isDisabled,
		onSelect
	}: {
		type: 'primary' | 'secondary' | 'accent' | 'error' | 'success' | 'warning' | 'info';
		size: 'xs' | 'sm' | 'md' | 'lg';
		selectLabel?: string;
		selectedValue?: string;
		options: {
			value: string;
			label: string;
		}[];
		label?: string;
		isDisabled?: boolean;
		onSelect?: (value: string) => void;
	} = $props();

	const selectTypes = {
		primary: 'select-primary',
		secondary: 'select-secondary',
		accent: 'select-accent',
		error: 'select-error',
		success: 'select-success',
		warning: 'select-warning',
		info: 'select-info'
	};

	const selectSizes = {
		xs: 'select-xs',
		sm: 'select-sm',
		md: 'select-md',
		lg: 'select-lg'
	};
</script>

<label class="form-control w-full max-w-xs">
	<div class="label">
		<span class="label-text">{label ?? ''}</span>
	</div>
	<select
		disabled={isDisabled}
		class="select {selectTypes[type]} {selectSizes[size]} select-bordered"
    onchange={(e) => onSelect && onSelect(e?.currentTarget?.value)}
	>
		<option disabled selected={!selectedValue}>{selectLabel}</option>
		{#each options as option}
			<option selected={selectedValue === option.value} value={option.value}>{option.label}</option>
		{/each}
	</select>
</label>
