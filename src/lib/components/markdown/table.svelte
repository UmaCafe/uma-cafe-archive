<script lang="ts">
	import type { Tokens } from 'marked';
	import TokenRenderer from './token_renderer.svelte';

	export let header: Array<Tokens.TableCell>;
	export let rows: Array<Array<Tokens.TableCell>>;
	export let align: Array<'left' | 'center' | 'right'>;
</script>

<table>
	<thead>
		{#each header as head}
			<th><TokenRenderer tokens={head.tokens} /></th>
		{/each}
	</thead>
	<tbody>
		{#each rows as row}
			<tr>
				{#each row as cell, i}
					<td style={align[i] ? `text-align: ${align[i]};` : undefined}
						><TokenRenderer tokens={cell.tokens} /></td
					>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>
