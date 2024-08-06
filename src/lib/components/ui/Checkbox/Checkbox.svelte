<script lang="ts">
	const {
		name,
		value,
		type,
		size,
		isChecked,
		onChecked
	}: {
		name: string;
		value: string | number;
		type: 'primary' | 'secondary' | 'accent' | 'error' | 'success' | 'warning' | 'info';
		size: 'xs' | 'sm' | 'md' | 'lg';
		isChecked?: boolean;
		onChecked?: (value: string | number) => void;
	} = $props();

	const checkboxTypes = {
		primary: 'checkbox-primary',
		secondary: 'checkbox-secondary',
		accent: 'checkbox-accent',
		error: 'checkbox-error',
		success: 'checkbox-success',
		warning: 'checkbox-warning',
		info: 'checkbox-info'
	};

	const checkboxSizes = {
		xs: 'checkbox-xs',
		sm: 'checkbox-sm',
		md: 'checkbox-md',
		lg: 'checkbox-lg'
	};
</script>

<input
	{name}
	{value}
	type="checkbox"
	checked={isChecked}
	class="checkbox {checkboxTypes[type]} {checkboxSizes[size]}"
	onclick={() => onChecked && onChecked(value)}
/>
