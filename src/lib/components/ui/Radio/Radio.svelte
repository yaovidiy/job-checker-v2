<script lang="ts">
	let {
		type,
		size,
		name,
		value,
		isChecked,
		onValueChange
	}: {
		type: 'primary' | 'secondary' | 'accent' | 'error' | 'success' | 'warning' | 'info';
		size: 'xs' | 'sm' | 'md' | 'lg';
		name: string;
		value: number | string;
		isChecked?: boolean;
		onValueChange?: (value: number | string) => void;
	} = $props();

	const radioClasses = {
		primary: 'radio-primary',
		secondary: 'radio-secondary',
		accent: 'radio-accent',
		error: 'radio-error',
		success: 'radio-success',
		warning: 'radio-warning',
		info: 'radio-info'
	};

	const sizeClasses = {
		xs: 'radio-xs',
		sm: 'radio-sm',
		md: 'radio-md',
		lg: 'radio-lg'
	};
</script>

<input
	type="radio"
	{name}
	{value}
	checked={isChecked}
	class="radio {radioClasses[type]} {sizeClasses[size]}"
	oninput={() => onValueChange && onValueChange(value)}
/>
