<script lang="ts">
	import { getContentUrl } from '$lib/util';
	import type { Token } from 'marked';
	import Heading from './heading.svelte';
	import HtmlExt from './html_ext.svelte';
	import List from './list.svelte';
	import Paragraph from './paragraph.svelte';
	import Table from './table.svelte';

	type TokenExt =
		| Token
		| {
				type: 'htmlext';
				raw: string;
				prefix: string;
				suffix: string;
				tokens: Array<Token>;
		  };

	export let tokens: Array<Token>;

	let tokensExt: Array<TokenExt>;
	$: {
		tokensExt = [];
		if (tokens != undefined) {
			// Find opening and closing HTML tags and transform them into prefixed and suffixed tags

			let pref: string | null = null;
			let htmlTokens = [];
			for (let token of tokens) {
				if (token.type == 'html') {
					if (token.raw.startsWith('<') && token.raw.endsWith('>') && !token.raw.endsWith('/>')) {
						if (token.raw.startsWith('</') && pref != null) {
							// if closing tag
							tokensExt.push({
								type: 'htmlext',
								prefix: pref,
								suffix: token.raw,
								tokens: htmlTokens.slice(),
								raw: ''
							});
							htmlTokens = [];
							pref = null;
						} else {
							// if opening tag
							pref = token.raw;
						}
						continue;
					}
				}
				// if we're in the middle of a tag, add to the tag's children tokens
				if (pref != null) {
					htmlTokens.push(token);
				} else {
					tokensExt.push(token);
				}
			}
		}
	}
</script>

{#each tokensExt as token}
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
	{:else if token.type == 'htmlext'}
		<HtmlExt prefix={token.prefix} suffix={token.suffix}>
			<svelte:self tokens={token.tokens} />
		</HtmlExt>
	{:else if token.type == 'html'}
		{@html token.text}
	{:else if token.type == 'image'}
		<img src={getContentUrl(`${token.href}`)} title={token.title} alt={token.text} />
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

<style>
	img {
		max-width: 100%;
	}
</style>
