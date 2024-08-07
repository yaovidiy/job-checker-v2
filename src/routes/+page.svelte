<script lang="ts">
	import Button from '$lib/components/ui/Button/Button.svelte';
	import Input from '$lib/components/ui/Input/Input.svelte';
	import Dropdown from '$lib/components/ui/Dropdown/Dropdown.svelte';
	import Accordion from '$lib/components/ui/Accordion/Accordion.svelte';
	import Table from '$lib/components/ui/Table/Table.svelte';
	import Alert from '$lib/components/ui/Alert/Alert.svelte';
	import ToastContainer from '$lib/components/ui/Toasts/ToastContainer.svelte';
	import Tooltip from '$lib/components/ui/Tooltip/Tooltip.svelte';
	import Article from '$lib/components/ui/Article/Article.svelte';
	import toastStore from '$lib/stores/toasts.svelte.js';
	import StarRating from '$lib/components/ui/StarRating/StarRating.svelte';
	import Range from '$lib/components/ui/Range/Range.svelte';
	import RadioGroup from '$lib/components/ui/Radio/RadioGroup.svelte';
	import CheckboxGroup from '$lib/components/ui/Checkbox/CheckboxGroup.svelte';
	import Toggle from '$lib/components/ui/Toggle/Toggle.svelte';
	import FileInput from '$lib/components/ui/FileInput/FileInput.svelte';
	import Select from '$lib/components/ui/Select/Select.svelte';
	import Modal from '$lib/components/Modal/Modal.svelte';
	import Swap from '$lib/components/ui/Swap/Swap.svelte';
	import Drawer from '$lib/components/ui/Drawer/Drawer.svelte';
	import { Menu, X } from 'lucide-svelte';

	const { data } = $props();
	let emailStatus = $state<string>('');
	let isButtonPending = $state<boolean>(false);
	let isEmailPending = $state<boolean>(false);
	let currentRating = $state<number>(0);
	const accordionItems = [
		{
			title: 'Item 1',
			content:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec turpis eget dolor ultricies aliquam. Nullam nec turpis eget dolor ultricies aliquam.'
		},
		{
			title: 'Item 2',
			content:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec turpis eget dolor ultricies aliquam. Nullam nec turpis eget dolor ultricies aliquam.'
		}
	];
	const headers: string[] = ['Header 1', 'Header 2', 'Header 3', 'Header 4', 'Header 5'];
	const columns: string[][] = [
		['Row 1 Column 1', 'Row 1 Column 2', 'Row 1 Column 3', 'Row 1 Column 4', 'Row 1 Column 5'],
		['Row 2 Column 1', 'Row 2 Column 2', 'Row 2 Column 3', 'Row 2 Column 4', 'Row 2 Column 5'],
		['Row 3 Column 1', 'Row 3 Column 2', 'Row 3 Column 3', 'Row 3 Column 4', 'Row 3 Column 5'],
		['Row 4 Column 1', 'Row 4 Column 2', 'Row 4 Column 3', 'Row 4 Column 4', 'Row 4 Column 5'],
		['Row 5 Column 1', 'Row 5 Column 2', 'Row 5 Column 3', 'Row 5 Column 4', 'Row 5 Column 5']
	];
	const footers: string[] = ['Footer 1', 'Footer 2', 'Footer 3', 'Footer 4', 'Footer 5'];

	async function sendDummyEmail() {
		emailStatus = 'Sending email...';
		isEmailPending = true;
		try {
			const response = await fetch('/api/send-verify-email', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email: 'yaovdiy@gmail.com' })
			});

			if (response.ok) {
				emailStatus = 'Email sent!';
			} else {
				emailStatus = 'Failed to send email';
			}
		} catch (err) {
			emailStatus = 'Failed to send email';
		} finally {
			isEmailPending = false;
		}
	}

	function addDummyToast() {
		toastStore.addToast({
			id: '',
			message: 'This is a dummy toast',
			type: 'warning'
		});
	}

	const buttonsArray: {
		type: 'primary' | 'secondary' | 'ghost' | 'error' | 'success' | 'warning' | 'info';
		text: string;
		isOutlined: boolean;
	}[] = [
		{
			type: 'primary',
			text: 'Primary',
			isOutlined: false
		},
		{
			type: 'secondary',
			text: 'Secondary',
			isOutlined: false
		},
		{
			type: 'ghost',
			text: 'Ghost',
			isOutlined: false
		},
		{
			type: 'error',
			text: 'Error',
			isOutlined: false
		},
		{
			type: 'success',
			text: 'Success',
			isOutlined: false
		},
		{
			type: 'warning',
			text: 'Warning',
			isOutlined: false
		},
		{
			type: 'info',
			text: 'Info',
			isOutlined: false
		},
		{
			type: 'primary',
			text: 'Primary Outlined',
			isOutlined: true
		},
		{
			type: 'secondary',
			text: 'Secondary Outlined',
			isOutlined: true
		},
		{
			type: 'ghost',
			text: 'Ghost Outlined',
			isOutlined: true
		},
		{
			type: 'error',
			text: 'Error Outlined',
			isOutlined: true
		},
		{
			type: 'success',
			text: 'Success Outlined',
			isOutlined: true
		},
		{
			type: 'warning',
			text: 'Warning Outlined',
			isOutlined: true
		},
		{
			type: 'info',
			text: 'Info Outlined',
			isOutlined: true
		}
	];

	type RadioType = {
		name: string;
		value: string | number;
		size: 'xs' | 'sm' | 'md' | 'lg';
		type: 'primary' | 'secondary' | 'accent' | 'error' | 'success' | 'warning' | 'info';
		label?: string;
		isChecked?: boolean;
	};

	const radioButtons: RadioType[] = [
		{
			name: 'radios',
			value: 'Radio 1',
			size: 'lg',
			type: 'primary',
			label: 'Radio 1',
			isChecked: false
		},
		{
			name: 'radios',
			value: 'Radio 2',
			size: 'lg',
			type: 'secondary',
			label: 'Radio 2',
			isChecked: false
		},
		{
			name: 'radios',
			value: 'Radio 3',
			size: 'lg',
			type: 'accent',
			label: 'Radio 3',
			isChecked: false
		},
		{
			name: 'radios',
			value: 'Radio 4',
			size: 'lg',
			type: 'error',
			label: 'Radio 4',
			isChecked: false
		},
		{
			name: 'radios',
			value: 'Radio 5',
			size: 'lg',
			type: 'success',
			label: 'Radio 5',
			isChecked: false
		},
		{
			name: 'radios',
			value: 'Radio 6',
			size: 'lg',
			type: 'warning',
			label: 'Radio 6',
			isChecked: false
		},
		{
			name: 'radios',
			value: 'Radio 7',
			size: 'lg',
			type: 'info',
			label: 'Radio 7',
			isChecked: false
		}
	];

	const Checkboxes: {
		name: string;
		value: string | number;
		label?: string;
		type: 'primary' | 'secondary' | 'accent' | 'error' | 'success' | 'warning' | 'info';
		size: 'xs' | 'sm' | 'md' | 'lg';
		isChecked?: boolean;
	}[] = [
		{
			name: 'checkboxes',
			value: 'Checkbox 1',
			size: 'lg',
			type: 'primary',
			label: 'Checkbox 1',
			isChecked: false
		},
		{
			name: 'checkboxes',
			value: 'Checkbox 2',
			size: 'lg',
			type: 'secondary',
			label: 'Checkbox 2',
			isChecked: false
		},
		{
			name: 'checkboxes',
			value: 'Checkbox 3',
			size: 'lg',
			type: 'accent',
			label: 'Checkbox 3',
			isChecked: false
		},
		{
			name: 'checkboxes',
			value: 'Checkbox 4',
			size: 'lg',
			type: 'error',
			label: 'Checkbox 4',
			isChecked: false
		},
		{
			name: 'checkboxes',
			value: 'Checkbox 5',
			size: 'lg',
			type: 'success',
			label: 'Checkbox 5',
			isChecked: false
		},
		{
			name: 'checkboxes',
			value: 'Checkbox 6',
			size: 'lg',
			type: 'warning',
			label: 'Checkbox 6',
			isChecked: false
		},
		{
			name: 'checkboxes',
			value: 'Checkbox 7',
			size: 'lg',
			type: 'info',
			label: 'Checkbox 7',
			isChecked: false
		}
	];

	let selectedRadio = $state<string | number>('');
	let selectedCheckboxes = $state<(string | number)[]>([]);

	function updateCheckboxes(value: string | number) {
		selectedCheckboxes.includes(value)
			? (selectedCheckboxes = selectedCheckboxes.filter((checkbox) => checkbox !== value))
			: (selectedCheckboxes = [...selectedCheckboxes, value]);
	}

	let isCheckedValue = $state<boolean>(false);
	let selectedValue = $state<string>('');

	let isDrawerOpen = $state<boolean>(false);

	$inspect(isDrawerOpen);
</script>

{#snippet drawerTrigger()}
	{#snippet off()}
		<Menu />
	{/snippet}
	{#snippet on()}
		<X />
	{/snippet}
	<Swap onSwap={on} offSwap={off} bind:isOn={isDrawerOpen} type="rotate" classes="text-4xl" />
{/snippet}

<Drawer trigger={drawerTrigger} bind:isOpen={isDrawerOpen} />
