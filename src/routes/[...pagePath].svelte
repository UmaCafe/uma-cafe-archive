<script lang="ts" context="module">
	import TokenRenderer from '$lib/components/markdown/token_renderer.svelte';
	import Metadata from '$lib/components/metadata.svelte';
	import { getPageMarkdown } from '$lib/content';
	import type { Load } from '@sveltejs/kit';
	import frontmatter from 'front-matter';
	import marked from 'marked';

	export const load: Load = async ({ page }) => {
		let path = page.params.pagePath;
		if (path == '') path = 'index';
		const markdown = await getPageMarkdown(path);
		if (markdown) {
			return {
				props: {
					markdown
				}
			};
		}
		return { error: 'Page not found', status: 404 };
	};
</script>

<script lang="ts">
	export let markdown: string;

	$: data = frontmatter(markdown);

	type PageAttribs = {
		layout: string;
		title: string;
		description: string;
	};

	$: meta = data.attributes as PageAttribs;

	$: lexed = marked.lexer(data.body);
</script>

<Metadata title={meta.title} description={meta.description} />

<TokenRenderer tokens={lexed} />
