<script lang="ts">
	import { goto } from '$app/navigation';
	import { session } from '$app/stores';
	import Uploader from '$lib/components/editor/uploader.svelte';
	import Metadata from '$lib/components/metadata.svelte';
	import { fromJson } from '$lib/data/base/objects';
	import type { Character } from '$lib/data/character';
	import { hasPermission } from '$lib/permissions';
	import type { ListedContentObject } from '$lib/server/editor';
	import { getContentUrl, pagePathToDocId } from '$lib/util';
	import type { EditDeleteRequest } from '../../api/edit';
	import type { FilesDeleteRequest } from '../../api/files';

	export let charListJson: string[];
	export let pagePaths: string[];
	export let imageObjects: ListedContentObject[];

	export let charList = charListJson.map((v) => fromJson<Character>(v));

	function deleteItem(type: string, id: string): void {
		if (window.prompt(`CONFIRM DELETION: ${type} item "${id}"?\nType '${id}' to continue.`) != id)
			return;
		const body: EditDeleteRequest = {
			type,
			id
		};
		fetch(`/api/edit`, {
			method: 'DELETE',
			body: JSON.stringify(body)
		}).then((resp) => {
			if (resp.status == 200) {
				window.location.reload();
			} else {
				console.error('Delete failed');
			}
		});
	}

	function deleteObject(fileName: string): void {
		if (
			window.prompt(
				`CONFIRM DELETION: "${fileName}"?\nType '${fileName}' to continue.\n\nNote: File may take up to a day to be removed completely.`
			) != fileName
		)
			return;
		const body: FilesDeleteRequest = {
			name: fileName
		};
		fetch(`/api/files`, {
			method: 'DELETE',
			body: JSON.stringify(body)
		}).then((resp) => {
			if (resp.status == 200) {
				window.location.reload();
			} else {
				console.error('Delete failed');
			}
		});
	}

	let selChar: string;
	let selPage: string;
	let selImg: string;
</script>

<Metadata title="Editor Home" description="Landing page for editors" />

<h1>Editor Home</h1>
<p>Logged in as: {$session.editor?.name}</p>

<div class="creation">
	<div class="characters">
		<h2>Characters</h2>
		<div>
			<div>
				<select bind:value={selChar}>
					{#each charList as char}
						<option value={char.id}>{char.name?.en}</option>
					{/each}
				</select>
				{#if hasPermission($session.editor, 'editor.edit.characters')}
					<button on:click={() => goto(`./characters/${selChar}`)}>Edit</button>
				{/if}
				{#if hasPermission($session.editor, 'editor.delete.characters')}
					<button on:click={() => deleteItem('characters', selChar)}>Delete</button>
				{/if}
			</div>
			<a href="/characters/{selChar}" target="_blank">Visit Page</a>
		</div>
		{#if hasPermission($session.editor, 'editor.create.characters')}
			<div>
				<button on:click={() => goto(`./characters/!new`)}>Add Character</button>
			</div>
		{/if}
	</div>
	<div class="pages">
		<h2>Pages</h2>
		<div>
			<div>
				<select bind:value={selPage}>
					{#each pagePaths as page}
						<option value={page}>{page.length > 0 ? page : '[home]'}</option>
					{/each}
				</select>
				{#if hasPermission($session.editor, 'editor.edit.pages')}
					<button on:click={() => goto(`./pages/${selPage.length > 0 ? selPage : 'index'}`)}
						>Edit</button
					>
				{/if}
				{#if hasPermission($session.editor, 'editor.delete.pages')}
					<button on:click={() => deleteItem('pages', pagePathToDocId(selPage))}>Delete</button>
				{/if}
			</div>
			<a href="/{selPage}" target="_blank">Visit Page</a>
		</div>
		{#if hasPermission($session.editor, 'editor.create.pages')}
			<div>
				<button on:click={() => goto(`./pages/!new`)}>Add Page</button>
			</div>
		{/if}
	</div>
	{#if hasPermission($session.editor, 'files.list')}
		<div class="images">
			<h2>Images</h2>
			<div>
				<select bind:value={selImg}>
					{#each imageObjects as imgObj}
						<option value={imgObj.name}>{imgObj.name}</option>
					{/each}
				</select>
				{#if hasPermission($session.editor, 'files.delete')}
					<button on:click={() => deleteObject(selImg)}>Delete</button>
				{/if}
			</div>
			{#if selImg}
				<div>
					<a href={getContentUrl(selImg)} target="_blank">{selImg}</a>
				</div>
			{/if}
			{#if hasPermission($session.editor, 'files.upload')}
				<div style="padding-top: 10px;">
					<Uploader
						allowedTypes="image/png,image/jpeg"
						filePrefix="images"
						success={() => window.location.reload()}
					/>
				</div>
			{/if}
		</div>
	{/if}
</div>

<div class="account">
	<h2>Account</h2>
	<a href="/editor/reset" rel="external">Reset Password</a>
</div>

<style>
	.creation {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: flex-start;
	}

	.account {
		margin: 10px;
	}

	.creation > div {
		margin: 0px 30px;
	}
</style>
