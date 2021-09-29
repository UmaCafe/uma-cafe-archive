<script lang="ts" context="module">
	import { getPageMarkdown } from '$lib/content';
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ page }) => {
		const path = page.params.pagePath;
		const markdown = await getPageMarkdown(path);
		if (markdown) {
			return {
				props: {
					markdown
				}
			};
		}
	};
</script>

<script lang="ts">
	import TokenRenderer from '$lib/components/token_renderer.svelte';
	import marked from 'marked';

	export let markdown: string;

	$: lexed = marked.lexer(markdown);
</script>

<TokenRenderer tokens={lexed} />
