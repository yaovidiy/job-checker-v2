<script lang="ts">
	import Checkbox from './Checkbox.svelte';

	const {
		checkboxes,
		onChecked
	}: {
		checkboxes: {
			name: string;
			value: string | number;
			label?: string;
			type: 'primary' | 'secondary' | 'accent' | 'error' | 'success' | 'warning' | 'info';
			size: 'xs' | 'sm' | 'md' | 'lg';
			isChecked?: boolean;
		}[];
		onChecked: (name: string | number) => void;
	} = $props();
</script>

<div class="form-control">
	{#each checkboxes as checkbox}
		<label class="cursor-pointer label">
			<span class="label-text">{checkbox.label ?? ''}</span>
			<Checkbox {...checkbox} {onChecked} />
		</label>
	{/each}
</div>
