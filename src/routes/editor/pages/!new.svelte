<script lang="ts">
	import { goto } from '$app/navigation';
	import Metadata from '$lib/components/metadata.svelte';
	import { docIdToPagePath, pagePathToDocId } from '$lib/util';
	import type { EditPutRequest } from 'src/routes/api/edit';

	export let type: string;

	function create() {
		const baseMd = `---\ntitle: ${pageTitle}\ndescription: ${pageDescription}\n---\n\n# ${pageTitle}\n`;

		const body: EditPutRequest = {
			type,
			id: pagePathToDocId(pagePath),
			data: { md: baseMd }
		};
		fetch(`/api/edit`, {
			method: 'PUT',
			body: JSON.stringify(body)
		}).then((resp) => {
			if (resp.status == 200) {
				window.location.href = `/editor/pages/${
					normalizedPath.length == 0 ? 'index' : normalizedPath
				}`;
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
				Page will be accessible at: <pre>{window?.location?.origin ??
						'[origin]'}/{normalizedPath}</pre>
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
