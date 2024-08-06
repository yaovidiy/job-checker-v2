<script lang="ts">
	let {
		type,
		size,
		step,
		min,
		max,
		initValue,
		onValueChange
	}: {
		type: 'primary' | 'secondary' | 'accent' | 'error' | 'success' | 'warning' | 'info';
		size: 'xs' | 'sm' | 'md' | 'lg';
		step?: number;
		min?: number;
		max?: number;
		initValue?: number;
		onValueChange?: (value: number) => void;
	} = $props();

	step = step ?? 1;
	min = min ?? 0;
	max = max ?? 100;

	let currentValue = $state<number>(initValue ?? 0);

	const rangeClasses = {
		primary: 'range-primary',
		secondary: 'range-secondary',
		accent: 'range-accent',
		error: 'range-error',
		success: 'range-success',
		warning: 'range-warning',
		info: 'range-info'
	};

	const sizeClasses = {
		xs: 'range-xs',
		sm: 'range-sm',
		md: 'range-md',
		lg: 'range-lg'
	};
</script>

<input
  onchange={() => onValueChange && onValueChange(currentValue)}
	type="range"
	{min}
	{max}
	bind:value={currentValue}
	{step}
	class="range {rangeClasses[type]} {sizeClasses[size]}"
/>
