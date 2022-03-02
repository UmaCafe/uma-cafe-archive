<script lang="ts" context="module">
	import { goto } from '$app/navigation';
	import { session } from '$app/stores';
	import { getAllCharacters } from '$lib/client/characters';
	import { listContentObjects } from '$lib/client/editor';
	import { listPagePaths } from '$lib/client/pages';
	import Uploader from '$lib/components/editor/uploader.svelte';
	import Metadata from '$lib/components/metadata.svelte';
	import { hasPermission } from '$lib/editor/permissions';
	import type { CharacterObject } from '$lib/types/character';
	import { getContentUrl, pagePathToDocId } from '$lib/util';
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ fetch }) => {
		const chars = await getAllCharacters(fetch, true);
		const pagePaths = await listPagePaths(fetch);
		const imageObjects = await listContentObjects(fetch, 'images/');
		return {
			props: {
				chars,
				pagePaths,
				imageObjects
			}
		};
	};
</script>

<script lang="ts">
	export let chars: Map<string, CharacterObject> = new Map();
	export let pagePaths: string[] = [];
	export let imageObjects: { name: string }[] = [];

	function deleteItem(collection: string, document: string): void {
		if (
			window.prompt(
				`CONFIRM DELETION: ${collection} item "${document}"?\nType '${document}' to continue.`
			) != document
		)
			return;
		fetch(`/api/edit`, {
			method: 'DELETE',
			body: JSON.stringify({
				collection,
				document
			})
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
				`CONFIRM DELETION: "${fileName}"?\nType '${fileName}' to continue.\n\nNote: File may take a day to be removed completely.`
			) != fileName
		)
			return;
		fetch(`/api/files`, {
			method: 'DELETE',
			body: JSON.stringify({
				name: fileName
			})
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
<p>Logged in as: {$session.editor.name}</p>

<div class="creation">
	<div class="characters">
		<h2>Characters</h2>
		<div>
			<div>
				<select bind:value={selChar}>
					{#each [...chars] as [charId, charInfo]}
						<option value={charId}>{charInfo.info.name.translated}</option>
					{/each}
				</select>
				{#if hasPermission($session.editor, 'editor.edit.characters')}
					<button on:click={() => goto(`./characters/${selChar}`)}>Edit</button>
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
					<button on:click={() => goto(`./pages/${selPage}`)}>Edit</button>
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
	<a href="/api/auth/reset" rel="external">Reset Password</a>
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
