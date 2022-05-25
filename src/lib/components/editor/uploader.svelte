<script lang="ts">
	import { session } from '$app/stores';
	import { hasPermission } from '$lib/permissions';
	import type { ListedContentObject } from '$lib/server/editor';
	import { getContentUrl } from '$lib/util';
	import type { FilesPostRequest } from 'src/routes/api/files';
	import { createEventDispatcher, onMount } from 'svelte';

	const dispatch = createEventDispatcher<{ updatePath: string }>();

	export let allowedTypes: string;
	export let filePrefix: string = '';
	export let forcedFilename: string | undefined = undefined;
	export let defaultFilename: string | undefined = undefined;
	export let fullFilePath: string | undefined = undefined;
	export let success: Function = () => {};
	export let error: Function = () => {};

	let fileExists = false;
	let mounted = false;
	onMount(() => {
		mounted = true;
	});
	function checkDefaultExists() {
		if (fullFilePath || defaultFilename) {
			let fname = fullFilePath ?? `${filePrefix}/${defaultFilename}`;
			checkExists(fname);
		}
	}
	function checkExists(fpath: string) {
		const body: FilesPostRequest = {
			folder: fpath
		};
		fetch(`/api/files`, {
			method: 'POST',
			body: JSON.stringify(body)
		})
			.then((resp) => {
				if (resp.status == 200) {
					return resp.json();
				}
			})
			.then((json) => {
				if (json) {
					const data = json as ListedContentObject[];
					fileExists = data.length > 0;
					if (fileExists) {
						fullFilePath = fpath;
						dispatch('updatePath', fullFilePath);
					}
				}
			});
	}
	$: {
		if (mounted) checkDefaultExists();
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
						name: fname,
						data: reader.result,
						contentType: file.type
					})
				}).then((res) => {
					if (res.status == 200) {
						fullFilePath = fname;
						fileExists = true;
						dispatch('updatePath', fullFilePath);
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

{#if hasPermission($session.editor, 'files.list') && hasPermission($session.editor, 'files.upload')}
	{#if editPath}
		<input style="width: 50%" type="text" placeholder={defaultFilename} bind:value={fullFilePath} />
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
		{#if !forcedFilename && defaultFilename}
			<button on:click={() => checkExists(`${filePrefix}/${uploadName ?? defaultFilename}`)}
				>Recheck</button
			>
		{/if}
	{/if}
{:else}
	<div>You do not have permission to upload files.</div>
{/if}
