<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';

	let {
		headers,
		data,
		footers,
		modifiers,
		caption,
		headerCell,
		bodyCell,
		footerCell
	}: {
		headers: string[];
		data: T[][];
		footers?: string[];
		modifiers?: string;
		caption?: string;
		headerCell?: Snippet<[string, number]>;
		bodyCell?: Snippet<[T, number, number]>;
		footerCell?: Snippet<[string, number]>;
	} = $props();
</script>

<div class="overflow-x-auto">
	<table class={`table ${modifiers ?? ''}`}>
		{#if caption}
			<caption>{caption}</caption>
		{/if}
		<thead>
			<tr>
				{#each headers as header, headerIndex}
					{#if headerCell}
						{@render headerCell(header, headerIndex)}
					{:else}
						<th>{header}</th>
					{/if}
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each data as row, rowIndex}
				<tr>
					{#each row as cell, cellIndex}
						{#if bodyCell}
							{@render bodyCell(cell, rowIndex, cellIndex)}
						{:else}
							<td>{cell}</td>
						{/if}
					{/each}
				</tr>
			{/each}
		</tbody>
		<tfoot>
			<tr>
				{#each footers ?? [] as footer, footerIndex}
					{#if footerCell}
						{@render footerCell(footer, footerIndex)}
					{:else}
						<th>{footer}</th>
					{/if}
				{/each}
			</tr>
		</tfoot>
	</table>
</div>
