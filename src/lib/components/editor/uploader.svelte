<script lang="ts">
	import { session } from '$app/stores';
	import { listContentObjects } from '$lib/client/editor';
	import { getContentUrl } from '$lib/util';
	import { createEventDispatcher, onMount } from 'svelte';

	export let allowedTypes: string;
	export let filePrefix: string = '';
	export let forcedFilename: string = undefined;
	export let defaultFilename: string = undefined;
	export let fullFilePath = undefined;
	export let success: Function = () => {};
	export let error: Function = () => {};

	const dispatch = createEventDispatcher<{ change: string }>();

	let fileExists = false;
	let mounted = false;
	onMount(() => {
		mounted = true;
	});
	$: {
		if (mounted) {
			let fname = fullFilePath;
			if (!fname && defaultFilename) {
				fname = `${filePrefix}/${defaultFilename}`;
			}
			listContentObjects(fetch, $session.editor.key, fname).then((objs) => {
				fileExists = objs.length > 0;
				if (fileExists) {
					fullFilePath = fname;
					dispatch('change', fullFilePath);
				}
			});
		}
	}

	function uploadObject(): void {
		uploading = true;
		try {
			const file = uploadFiles[0];
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => {
				const fname = forcedFilename || `${filePrefix}/${uploadName}`;
				fetch(`/api/files`, {
					method: 'PUT',
					body: JSON.stringify({
						editorKey: $session.editor.key,
						name: fname,
						data: reader.result,
						contentType: file.type
					})
				}).then((res) => {
					if (res.status == 200) {
						fullFilePath = fname;
						dispatch('change', fullFilePath);
						success();
					} else {
						res.text().then((val) => error(val));
					}
				});
			};
		} catch (e) {
			error(e);
		} finally {
			uploading = false;
		}
	}

	let uploadFiles: FileList;
	let uploadName: string = '';
	let uploading = false;

	let reupload = false;
	let editPath = false;
</script>

{#if editPath}
	<input
		style="width: 50%"
		type="text"
		placeholder={defaultFilename}
		bind:value={fullFilePath}
		on:change={() => dispatch('change', fullFilePath)}
	/>
	<button on:click={() => (editPath = false)}>Done</button>
{:else if fullFilePath && fileExists && !reupload}
	<div>
		<a href={getContentUrl(fullFilePath)} target="_blank">{fullFilePath}</a>
	</div>
	<button
		on:click={() => {
			reupload = true;
			if (defaultFilename) uploadName = defaultFilename;
		}}>Reupload</button
	>
	<button on:click={() => (editPath = true)}>Edit Manually</button>
{:else}
	{#if reupload}<button on:click={() => (reupload = false)}>Cancel</button>{/if}
	<form on:submit|preventDefault={uploadObject}>
		<div>
			<input type="file" accept={allowedTypes} required bind:files={uploadFiles} />
		</div>
		{#if !forcedFilename}
			<div>
				<label
					>File path: <span>{filePrefix}/</span>
					<input type="text" required placeholder={defaultFilename} bind:value={uploadName} />
				</label>
			</div>
		{:else}
			<div>File path: {forcedFilename}</div>
		{/if}
		<input type="submit" value="Upload" disabled={uploading} />
	</form>
{/if}
