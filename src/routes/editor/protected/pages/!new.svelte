<script lang="ts">
	import { goto } from '$app/navigation';
	import { session } from '$app/stores';
	import Metadata from '$lib/components/metadata.svelte';
	import { docIdToPagePath, pagePathToDocId } from '$lib/content/pages';

	function create() {
		const baseMd = `---\ntitle: ${pageTitle}\ndescription: ${pageDescription}\n---\n\n# ${pageTitle}\n`;

		fetch(`/api/edit`, {
			method: 'PUT',
			body: JSON.stringify({
				editorKey: $session.editor.key,
				collection: 'pages',
				document: pagePathToDocId(pagePath),
				data: { md: baseMd }
			})
		}).then((resp) => {
			if (resp.status == 200) {
				window.location.href = `/editor/protected/pages/${normalizedPath}`;
			} else {
				errorMsg = 'Creation failed';
			}
		});
	}

	let pagePath = '';
	$: normalizedPath = docIdToPagePath(pagePathToDocId(pagePath));
	let pageTitle = '';
	let pageDescription = '';

	let errorMsg = '';
</script>

<Metadata title="Page Editor" description="Creating new page" />

<h1>Create Page</h1>
<button on:click={() => goto('../home')}>Back</button>
<div>
	<form on:submit|preventDefault={create}>
		<div>
			<label
				>Page path: <input
					type="text"
					bind:value={pagePath}
					placeholder="path/page"
					required
				/></label
			>
			<div>
				Page will be accessible at: <pre>{window?.location?.origin ?? '[origin]'}/{normalizedPath}</pre>
			</div>
		</div>
		<div>
			<label
				>Page title: <input
					type="text"
					bind:value={pageTitle}
					placeholder="Page Title"
					required
				/></label
			>
		</div>
		<div>
			<label
				>Page description: <input
					type="text"
					bind:value={pageDescription}
					placeholder="Page Description"
					required
				/></label
			>
		</div>
		<input type="submit" value="Create" />
		{#if errorMsg}<div style="color: red;">{errorMsg}</div>{/if}
	</form>
</div>
