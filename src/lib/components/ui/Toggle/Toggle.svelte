<script lang="ts">
	const {
		type,
		size,
		isChecked,
		label,
		onChanged
	}: {
		type: 'primary' | 'secondary' | 'accent' | 'error' | 'success' | 'warning' | 'info';
		size: 'xs' | 'sm' | 'md' | 'lg';
		isChecked?: boolean;
		label?: string;
		onChanged?: (isChecked: boolean) => void;
	} = $props();

	const toggleTypes = {
		primary: 'toggle-primary',
		secondary: 'toggle-secondary',
		accent: 'toggle-accent',
		error: 'toggle-error',
		success: 'toggle-success',
		warning: 'toggle-warning',
		info: 'toggle-info'
	};

	const toggleSizes = {
		xs: 'toggle-xs',
		sm: 'toggle-sm',
		md: 'toggle-md',
		lg: 'toggle-lg'
	};

	let isCheckedValue = $state(isChecked ?? false);
</script>

<div class="form-control">
	<label class="label cursor-pointer">
		<span class="label-text mr-5">{label ?? ''}</span>
		<input
			type="checkbox"
			class="toggle {toggleTypes[type]} {toggleSizes[size]}"
			bind:checked={isCheckedValue}
			onchange={() => onChanged && onChanged(isCheckedValue)}
		/>
	</label>
</div>
