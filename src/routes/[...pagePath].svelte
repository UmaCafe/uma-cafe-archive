<script lang="ts">
	import { page, session } from '$app/stores';
	import TokenRenderer from '$lib/components/markdown/token_renderer.svelte';
	import Metadata from '$lib/components/metadata.svelte';
	import { fromJson } from '$lib/data/base/objects';
	import type { Page } from '$lib/data/page';
	import { hasPermission } from '$lib/permissions';
	import { isPreview } from '$lib/util';
	import frontmatter from 'front-matter';
	import marked from 'marked';

	export let pageJson: string;

	let pageObj = fromJson<Page>(pageJson);
	$: pageObj = fromJson<Page>(pageJson);

	$: data = frontmatter(pageObj.md ?? '');

	type PageAttribs = {
		layout?: 'raw' | undefined;
		title?: string | undefined;
		description?: string | undefined;
	};

	$: meta = data.attributes as PageAttribs;

	$: lexed = marked.lexer(data.body);
</script>

<Metadata title={meta.title} description={meta.description} />

<div class="md">
	<TokenRenderer tokens={lexed} />
</div>
{#if $session.editor && hasPermission($session.editor, 'editor.edit.pages') && !isPreview()}
	<div style="text-align:right;">
		<a href="/editor/pages/{$page.params.pagePath.length == 0 ? 'index' : $page.params.pagePath}"
			>Edit this page</a
		>
	</div>
{/if}

<style>
	.md {
		padding: 20px 50px;
	}
</style>
