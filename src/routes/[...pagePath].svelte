<script lang="ts" context="module">
	import { getPageMarkdown } from '$lib/client/pages';
	import TokenRenderer from '$lib/components/markdown/token_renderer.svelte';
	import Metadata from '$lib/components/metadata.svelte';
	import type { Load } from '@sveltejs/kit';
	import frontmatter from 'front-matter';
	import marked from 'marked';

	export const load: Load = async ({ fetch, params }) => {
		let path = params.pagePath;
		const markdown = await getPageMarkdown(fetch, path);
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

<style>
	.md {
		padding: 20px 50px;
	}
</style>
