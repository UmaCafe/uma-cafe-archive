<script lang="ts" context="module">
	import { goto } from '$app/navigation';
	import { getPageMarkdown } from '$lib/client/pages';
	import TokenRenderer from '$lib/components/markdown/token_renderer.svelte';
	import Metadata from '$lib/components/metadata.svelte';
	import { getChangesBetween, pagePathToDocId } from '$lib/util';
	import type { Load } from '@sveltejs/kit';
	import frontmatter from 'front-matter';
	import marked from 'marked';

	export const load: Load = async ({ fetch, params }) => {
		let path = params.pagePath;
		const markdown = await getPageMarkdown(fetch, path);
		if (markdown) {
			return {
				props: {
					markdown,
					path
				}
			};
		}
	};
</script>

<script lang="ts">
	export let markdown: string;
	export let path: string;

	let newMarkdown = markdown;

	function submitChanges() {
		if (!window.confirm('Confirm changes?')) return;

		fetch('/api/edit', {
			method: 'POST',
			body: JSON.stringify({
				collection: 'pages',
				document: pagePathToDocId(path),
				changes: getChangesBetween({ md: markdown }, { md: newMarkdown })
			})
		}).then((resp) => {
			if (resp.status == 200) {
				window.location.href = '/editor/protected/home';
			} else {
				errorMsg = 'Edit failed';
			}
		});
	}
	let errorMsg = '';

	$: data = frontmatter(newMarkdown);
	$: lexed = marked.lexer(data.body);
</script>

<Metadata title="Page Editor" description="Editing page" />

<h1>Editing page: /{path}</h1>
<div class="controls">
	<button on:click={() => goto(path.length == 0 ? './home' : '../home')}>Back</button>
	<button on:click={() => (newMarkdown = markdown)}>Revert</button>
	<button on:click={submitChanges}>Save Changes</button>
	{#if errorMsg}<div style="color: red;">{errorMsg}</div>{/if}
</div>
<div class="md">
	<textarea bind:value={newMarkdown} />
	<TokenRenderer tokens={lexed} />
</div>

<style>
	.md {
		padding: 20px 50px;
	}

	textarea {
		width: 100%;
		min-height: 200px;
		resize: vertical;
	}
</style>
