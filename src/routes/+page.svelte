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
</script>

<div>
	<Swap type="flip" classes="text-9xl" />
</div>

<div>
	<Modal closeOnClickOutside={true} />
</div>

<div>
	Selected Value: {selectedValue}
	<Select
		type="primary"
		size="lg"
		selectLabel="Select an option"
		options={[
			{ value: 'Option 1', label: 'Option 1' },
			{ value: 'Option 2', label: 'Option 2' },
			{ value: 'Option 3', label: 'Option 3' }
		]}
		label="Select an option"
		onSelect={(value) => (selectedValue = value)}
	/>
</div>

<div>
	<FileInput
		type="primary"
		size="lg"
		label="Upload file"
		onFileChage={(files) => console.log(files)}
		isMultiple
		acceptTypes="image/*"
	/>
</div>

<div>
	Is checked: {isCheckedValue}

	<Toggle
		type="primary"
		size="lg"
		isChecked={isCheckedValue}
		label="Toggle me"
		onChanged={(isChecked) => (isCheckedValue = isChecked)}
	/>
</div>

<div>
	selected checkboxes: {selectedCheckboxes.join(', ')}
	<CheckboxGroup checkboxes={Checkboxes} onChecked={(value) => updateCheckboxes(value)} />
</div>

Seletected Radio Value: {selectedRadio}
<RadioGroup
	radios={radioButtons}
	onValueChange={(value: string | number) => (selectedRadio = value)}
/>

{#if emailStatus}
	<p>{emailStatus}</p>
{/if}

{#if data}
	<h1>{data.username}</h1>
{/if}
<Range type="primary" size="lg" onValueChange={(number) => console.log(number)} />
<br />
<StarRating onUpdate={(score) => (currentRating = score)} />
Current score: {currentRating}
<br />
<Button isOutlined isPending={isEmailPending} type="primary" onclick={sendDummyEmail}
	>Send email</Button
>

<fieldset class="flex flex-wrap gap-2 mb-10">
	<legend>Base buttons</legend>
	{#each buttonsArray as btn}
		<Button
			isPending={isButtonPending}
			type={btn.type}
			isOutlined={btn.isOutlined}
			onclick={() => {
				isButtonPending = true;

				setTimeout(() => {
					isButtonPending = false;
				}, 5000);
			}}
		>
			{btn.text}
		</Button>
	{/each}
</fieldset>

<fieldset>
	<legend>Base input</legend>
	<Input extraClasses="max-w-xs" value="" placeholder="Username" type="text" />
</fieldset>

<Dropdown>
	<ul class="menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
		<li><a href="!#">Item 1</a></li>
		<li><a href="!#">Item 2</a></li>
	</ul>
</Dropdown>

<div class="mb-10 px-5">
	<Accordion {accordionItems}></Accordion>
</div>

<Table {headers} data={columns} {footers} caption="This is a table!">
	{#snippet bodyCell(cellValue)}
		<td>
			<div>
				<div class="font-bold">Heading</div>
				<div class="text-sm opacity-50">{cellValue}</div>
			</div>
		</td>
	{/snippet}
</Table>

<Alert alertType="error" alertText="Something whent wrong">
	{#snippet content(alertText)}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-6 w-6 shrink-0 stroke-current"
			fill="none"
			viewBox="0 0 24 24"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
			/>
		</svg>
		<span>{alertText}</span>
	{/snippet}
</Alert>

<Alert alertType="info" alertText="Just an info for you"></Alert>

<Button type="primary" onclick={addDummyToast}>Add toast</Button>

<ToastContainer />

<Tooltip tooltip="Icon tooltip">
	{#snippet trigger()}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			class="h-6 w-6 shrink-0 stroke-current cursor-pointer"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
			></path>
		</svg>
	{/snippet}
</Tooltip>

<Article>
	{#snippet article()}
		<p>
			Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec turpis eget dolor
			ultricies aliquam. Nullam nec turpis eget dolor ultricies aliquam.
		</p>
		<p>
			Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec turpis eget dolor
			ultricies aliquam. Nullam nec turpis eget dolor ultricies aliquam.
		</p>

		<blockquote>
			<p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec turpis eget dolor
				ultricies aliquam. Nullam nec turpis eget dolor ultricies aliquam.
			</p>
		</blockquote>
		<h1>This is color!</h1>

		<p>
			<span class="text-primary">Primary</span>
			<span class="text-secondary">Secondary</span>
			<span class="text-error">Error</span>
			<span class="text-success">Success</span>
			<span class="text-warning">Warning</span>
			<span class="text-info">Info</span>
		</p>
		<pre>
		<code class="language-js text-left">
			const a = ['1', '2', '3']
			And this is a code block
		</code>
		
	</pre>

		<ol>
			<li>Item 1</li>
			<li>Item 2</li>
			<li>Item 3</li>
		</ol>

		<figure>
			<img
				src="https://images.unsplash.com/photo-1556740758-90de374c12ad?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80"
				alt="unsplash"
			/>

			<figcaption>
				Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece
				of classical Latin literature from 45 BC, making it over 2000 years old.
			</figcaption>
		</figure>

		<p>
			Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec turpis eget dolor
			ultricies aliquam. Nullam nec turpis eget dolor ultricies <a
				href="/"
				target="_blank"
				rel="noopener noreferrer">aliquam.</a
			>
		</p>
	{/snippet}
</Article>
