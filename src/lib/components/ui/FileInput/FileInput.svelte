<script lang="ts">
	const {
		type,
		size,
		label,
		isDisabled,
		isMultiple,
    acceptTypes,
		onFileChage
	}: {
		type: 'primary' | 'secondary' | 'accent' | 'error' | 'success' | 'warning' | 'info';
		size: 'xs' | 'sm' | 'md' | 'lg';
		label?: string;
		isDisabled?: boolean;
		isMultiple?: boolean;
    acceptTypes?: string;
		onFileChage?: (files: FileList | null) => void;
	} = $props();

	const fileInputTypes = {
		primary: 'file-input-primary',
		secondary: 'file-input-secondary',
		accent: 'file-input-accent',
		error: 'file-input-error',
		success: 'file-input-success',
		warning: 'file-input-warning',
		info: 'file-input-info'
	};

	const fileInputSizes = {
		xs: 'file-input-xs',
		sm: 'file-input-sm',
		md: 'file-input-md',
		lg: 'file-input-lg'
	};
</script>

<label class="form-control w-full max-w-xs">
	<div class="label">
		<span class="label-text">{label ?? ''}</span>
	</div>
	<input
		onchange={(e) => onFileChage && onFileChage(e?.currentTarget?.files)}
		disabled={isDisabled}
		multiple={isMultiple}
    accept={acceptTypes}
		type="file"
		class="file-input file-input-bordered {fileInputTypes[type]} w-full {fileInputSizes[
			size
		]} max-w-xs"
	/>
</label>
