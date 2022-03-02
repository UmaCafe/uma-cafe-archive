<script lang="ts">
	import { goto } from '$app/navigation';
	import type { ObjectEditorMeta, ObjectMeta } from '$lib/types/editors';
	import { getChangesBetween } from '$lib/util';
	import MetaView from './object/meta_view.svelte';

	export let collection: string;
	export let document: string;

	type T = $$Generic<Record<String, unknown>>;
	export let metaObject: ObjectMeta<T>;
	export let object: T;
	let objectToEdit: T = JSON.parse(JSON.stringify(object));
	export let assetFolder: string;

	let editorMeta: ObjectEditorMeta = {
		assetFolder
	};

	function submitChanges() {
		if (!window.confirm('Confirm changes?')) return;

		fetch('/api/edit', {
			method: 'POST',
			body: JSON.stringify({
				collection,
				document,
				changes: getChangesBetween(object, objectToEdit)
			})
		}).then((resp) => {
			if (resp.status == 200) {
				window.location.href = '/editor/protected/home';
			} else {
				errorMsg = 'Edit failed';
			}
		});
	}

	export let mode: 'edit' | 'preview' | 'confirm' = 'edit';
	let errorMsg: string;
</script>

{#if mode == 'edit'}
	<h1>Editing: {collection}/{document}</h1>
	<button on:click={() => goto('../home')}>Back</button>
	<button on:click={() => (mode = 'preview')}>Preview</button>

	<MetaView meta={metaObject} value={objectToEdit} valueOriginal={object} globalMeta={editorMeta} />
{:else if mode == 'preview'}
	<h1>Previewing changes to: {collection}/{document}</h1>
	<button on:click={() => (mode = 'edit')}>Back to Editing</button>
	<button on:click={() => (mode = 'confirm')}>Confirm Changes</button>
	<slot previewObject={objectToEdit} />
{:else if mode == 'confirm'}
	<h1>Confirm changes to {collection}/{document}</h1>
	<button on:click={() => (mode = 'edit')}>Back to Editing</button>
	<button on:click={() => (mode = 'preview')}>Back to Preview</button>
	{#each getChangesBetween(object, objectToEdit) as change}
		<div class="change">
			<div>{change.key}</div>
			<div>
				<strong>Before: </strong><span class="before">{JSON.stringify(change.before)}</span>
			</div>
			<div><strong>After: </strong><span class="after">{JSON.stringify(change.after)}</span></div>
		</div>
	{/each}
	{#if getChangesBetween(object, objectToEdit).length > 0}
		<button on:click={submitChanges}>Submit</button>
		{#if errorMsg}<div style="color: red;">{errorMsg}</div>{/if}
	{:else}
		<h3>No changes.</h3>
	{/if}
{/if}

<style>
	.change {
		border: 1px solid #ccc;
		padding: 5px;
		margin: 5px;
	}

	.change .before {
		color: red;
	}

	.change .after {
		color: green;
	}
</style>
