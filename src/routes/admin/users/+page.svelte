<script lang="ts">
	import { type User, Role } from '@prisma/client';
	import Table from '$lib/components/ui/Table/Table.svelte';
	import Button from '$lib/components/ui/Button/Button.svelte';
	import Input from '$lib/components/ui/Input/Input.svelte';
	import Select from '$lib/components/ui/Select/Select.svelte';
	import Modal from '$lib/components/Modal/Modal.svelte';
	import Toggle from '$lib/components/ui/Toggle/Toggle.svelte';
	import { capitalizeFirstLetter } from '$lib/utils/general';
	import toastStore, { type Toast } from '$lib/stores/toasts.svelte';
	import { randomId } from '$lib/utils/randomId';

	let isBlocked = $state(false);
	let role = $state<Role>(Role.USER);
	let selectedUserName = $state<string | null>(null);
	let userPromise = $state(fetchUsers());

	async function updateUser() {
		try {
			const resp = await fetch('/api/admin/update-user', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					username: selectedUserName,
					isBlocked,
					role
				})
			});

			if (!resp.ok) {
				throw new Error('Failed to update user');
			}

			const successToast: Toast = {
				id: randomId(16),
				message: 'User updated successfully',
				type: 'success'
			};

			toastStore.addToast(successToast);

			return true;
		} catch (error) {
			console.error(error);
			const errorToast: Toast = {
				id: randomId(16),
				message: 'Failed to update user',
				type: 'error'
			};
			toastStore.addToast(errorToast);

			return false;
		}
	}

	async function fetchUsers() {
		try {
			const resp = await fetch('/api/admin/get-users');

			if (!resp.ok) {
				throw new Error('Failed to fetch users');
			}

			const res = (await resp.json()) as User[];

			return res;
		} catch (error) {
			console.error(error);
		}
	}
</script>

{#await userPromise}
	<div class="skeleton h-5 mb-5 w-full"></div>
	<div class="skeleton h-5 mb-5 w-full"></div>
	<div class="skeleton h-5 mb-5 w-full"></div>
	<div class="skeleton h-5 mb-5 w-full"></div>
	<div class="skeleton h-5 mb-5 w-full"></div>
{:then users}
	{#if users}
		{@const headers = [...Object.keys(users[0]).map((key) => capitalizeFirstLetter(key)), 'Action']}
		{@const data = users.map((user) => [
			...Object.entries(user).map(([_, value]) => value?.toString() ?? 'N/A'),
			'Edit'
		])}
		{#snippet bodyCell(cell: string, rowIndex: number)}
			<td>
				{#if cell === 'Edit'}
					<Modal {trigger} header={modalHeader} content={modalContent} footer={modalFooter} />
				{:else}
					{cell}
				{/if}
			</td>
			{#snippet trigger(modal: HTMLDialogElement | null)}
				<Button
					onclick={() => {
						selectedUserName = users[rowIndex].username;
						modal?.showModal();
					}}
					isOutlined
					type="primary">{cell}</Button
				>
			{/snippet}
			{#snippet modalHeader()}
				<h2 class="text-2xl text-center mb-3">Editing user: {users[rowIndex].username}</h2>
			{/snippet}
			{#snippet modalContent()}
				<div class="flex justify-center mb-10 items-center flex-col">
					<div class="flex justify-end w-full">
						<Toggle
							onChanged={(blocked) => (isBlocked = blocked)}
							type="error"
							size="lg"
							label="Is disabled"
							isChecked={users[rowIndex].is_blocked}
						/>
					</div>
					<Input disabled type="text" label="Username" value={users[rowIndex].username} />
					<Input disabled type="text" label="Email" value={users[rowIndex].email} />
					<Select
						type="primary"
						size="md"
						label="Role"
						selectLabel="Select role"
						selectedValue={users[rowIndex].role}
						onSelect={(value) => (role = value as Role)}
						options={[
							{ value: Role.ADMIN, label: Role.ADMIN },
							{ value: Role.USER, label: Role.USER }
						]}
					/>
				</div>
			{/snippet}
			{#snippet modalFooter(modal: HTMLDialogElement | null)}
				<div class="flex flex-col md:flex-row px-5 justify-center items-center gap-3">
					<Button
						extraClasses="md:w-[50%]"
						onclick={async () => {
							const updated = await updateUser();

							if (updated) {
								modal?.close();
								userPromise = fetchUsers();
							}
						}}
						type="primary">Update user</Button
					>
					<Button extraClasses="md:w-[50%]" onclick={() => modal?.close()} isOutlined type="primary"
						>Close</Button
					>
				</div>
			{/snippet}
		{/snippet}
		<Table {headers} {data} {bodyCell} />
	{/if}
{:catch error}
	<p class="text-red-500">{error.message}</p>
{/await}
