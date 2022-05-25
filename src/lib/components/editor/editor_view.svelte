<script lang="ts">
	import { goto } from '$app/navigation';
	import type { DatabaseObject, EditorInformation } from '$lib/data/base/objects';
	import type { ChangeInstance, ObjectEditorMeta } from '$lib/util';
	import type { EditPostRequest } from 'src/routes/api/edit';
	import KeyEditor from './key_editor.svelte';

	type T = $$Generic<DatabaseObject>;
	export let info: EditorInformation<T>[];
	export let type: string;
	export let id: string;
	export let path: string;
	export let assetFolder: string;

	let values: { [k: string]: unknown } = {};
	for (const k of info) {
		values[k.keyData.dbKey] = k.dbVal;
	}

	let changes: ChangeInstance[] = [];

	let editorMeta: ObjectEditorMeta = {
		assetFolder
	};

	let previewLoading = false;
	let previewJson: string = '';

	async function getPreviewObject(): Promise<string | undefined> {
		const body: EditPostRequest = {
			type,
			id,
			changes,
			update: false
		};
		return fetch('/api/edit', {
			method: 'POST',
			body: JSON.stringify(body)
		}).then((resp) => {
			if (resp.status == 200) {
				return resp.text();
			} else {
				errorMsg = 'Preview failed';
			}
		});
	}

	function submitChanges() {
		if (!window.confirm('Confirm changes?')) return;

		const body: EditPostRequest = {
			type,
			id,
			changes,
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

	export let mode: 'edit' | 'preview' | 'confirm' = 'edit';
	let errorMsg: string;
</script>

{#if mode == 'edit'}
	<h1>Editing: {path}</h1>
	<button on:click={() => goto('../home')}>Home</button>
	<button
		disabled={previewLoading}
		on:click={() => {
			previewLoading = true;
			getPreviewObject()
				.then((obj) => {
					if (obj) {
						previewJson = obj;
						mode = 'preview';
					}
				})
				.finally(() => (previewLoading = false));
		}}>Preview</button
	>
	{#if errorMsg}<div style="color: red;">{errorMsg}</div>{/if}

	{#each [...info] as keyInfo}
		<KeyEditor
			info={keyInfo}
			{editorMeta}
			bind:value={values[keyInfo.keyData.dbKey]}
			on:change={(ev) => {
				changes = changes.filter((v) => v.key != keyInfo.keyData.dbKey);
				if (ev.detail.isDiff) {
					changes = [
						...changes,
						{
							key: keyInfo.keyData.dbKey,
							before: keyInfo.dbVal,
							after: values[keyInfo.keyData.dbKey]
						}
					];
				}
			}}
		/>
	{/each}
{:else if mode == 'preview'}
	<h1>Previewing changes to: {path}</h1>
	<button on:click={() => (mode = 'edit')}>Back to Editing</button>
	<button on:click={() => (mode = 'confirm')}>Confirm Changes</button>
	<slot {previewJson} />
{:else if mode == 'confirm'}
	<h1>Confirm changes to {path}</h1>
	<button on:click={() => (mode = 'edit')}>Back to Editing</button>
	<button on:click={() => (mode = 'preview')}>Back to Preview</button>
	{#each changes as change}
		<div class="change">
			<div>{change.key}</div>
			<div>
				<strong>Before: </strong><span class="before">{JSON.stringify(change.before)}</span>
			</div>
			<div><strong>After: </strong><span class="after">{JSON.stringify(change.after)}</span></div>
		</div>
	{/each}
	{#if changes.length > 0}
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
