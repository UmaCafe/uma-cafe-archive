<script lang="ts" context="module">
	import { goto } from '$app/navigation';
	import TokenRenderer from '$lib/components/markdown/token_renderer.svelte';
	import Metadata from '$lib/components/metadata.svelte';
	import { fromJson } from '$lib/data/base/objects';
	import type { Page } from '$lib/data/page';
	import frontmatter from 'front-matter';
	import marked from 'marked';
	import type { EditPostRequest } from 'src/routes/api/edit';
</script>

<script lang="ts">
	export let pageJson: string;
	export let type: string;
	export let id: string;
	export let path: string;

	let page = fromJson<Page>(pageJson);
	$: page = fromJson<Page>(pageJson);

	let markdown = page.md ?? '';
	let newMarkdown = markdown;

	function submitChanges() {
		if (!window.confirm('Confirm changes?')) return;

		const body: EditPostRequest = {
			type,
			id,
			changes: [{ key: 'md', before: markdown, after: newMarkdown }],
			update: true
		};
		fetch('/api/edit', {
			method: 'POST',
			body: JSON.stringify(body)
		}).then((resp) => {
			if (resp.status == 200) {
				window.location.href = '/editor/home';
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
	<button on:click={() => goto('../home')}>Home</button>
	<button on:click={() => (newMarkdown = markdown)} disabled={newMarkdown == markdown}
		>Revert</button
	>
	<button on:click={submitChanges} disabled={newMarkdown == markdown}>Save Changes</button>
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
