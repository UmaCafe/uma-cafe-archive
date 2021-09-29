<script lang="ts">
	import { getImageUrl } from '$lib/content';
	import type { Token } from 'marked';
	import Heading from './markdown/heading.svelte';
	import List from './markdown/list.svelte';
	import Paragraph from './markdown/paragraph.svelte';
	import Table from './markdown/table.svelte';
	export let tokens: Array<Token>;
</script>

{#each tokens as token (token.raw)}
	{#if token.type == 'heading'}
		<Heading depth={token.depth}><svelte:self tokens={token.tokens} /></Heading>
	{:else if token.type == 'paragraph'}
		<Paragraph pre={token.pre}><svelte:self tokens={token.tokens} /></Paragraph>
	{:else if token.type == 'blockquote'}
		<blockquote><svelte:self tokens={token.tokens} /></blockquote>
	{:else if token.type == 'code'}
		<pre class={token.lang}>{token.text}</pre>
	{:else if token.type == 'codespan'}
		<code>{token.text}</code>
	{:else if token.type == 'br'}
		<br />
	{:else if token.type == 'del'}
		<del><svelte:self tokens={token.tokens} /></del>
	{:else if token.type == 'em'}
		<em><svelte:self tokens={token.tokens} /></em>
	{:else if token.type == 'hr'}
		<hr />
	{:else if token.type == 'html'}
		{@html token.text}
	{:else if token.type == 'image'}
		<img src={getImageUrl(token.href)} title={token.title} alt={token.text} />
	{:else if token.type == 'link'}
		<a href={token.href} title={token.title}><svelte:self tokens={token.tokens} /></a>
	{:else if token.type == 'list'}
		<List ordered={token.ordered} start={token.start}><svelte:self tokens={token.items} /></List>
	{:else if token.type == 'list_item'}
		<li><svelte:self tokens={token.tokens} /></li>
	{:else if token.type == 'space'}
		{' '}
	{:else if token.type == 'strong'}
		<strong><svelte:self tokens={token.tokens} /></strong>
	{:else if token.type == 'table'}
		<Table header={token.header} rows={token.rows} align={token.align} />
	{:else if token.type == 'text'}
		{token.text}
	{:else}
		{token.raw}
	{/if}
{/each}
