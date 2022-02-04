<script lang="ts" context="module">
	import { goto } from '$app/navigation';
	import { session } from '$app/stores';
	import Metadata from '$lib/components/metadata.svelte';
	import { getAllCharacters, listPagePaths, pagePathToDocId } from '$lib/content';
	import type { CharacterObject } from '$lib/types/character';
	import type { Load } from '@sveltejs/kit';
	export const load: Load = async () => {
		const chars = await getAllCharacters(true);
		const pagePaths = await listPagePaths();
		return {
			props: {
				chars,
				pagePaths
			}
		};
	};
</script>

<script lang="ts">
	export let chars: Map<string, CharacterObject>;
	export let pagePaths: string[];

	function deleteItem(collection: string, document: string): void {
		if (
			window.prompt(
				`CONFIRM DELETION: ${collection} item "${document}"?\nType '${document}' to continue.`
			) != document
		)
			return;
		window
			.fetch(`/api/edit`, {
				method: 'DELETE',
				body: JSON.stringify({
					editorKey: $session.editor.key,
					collection,
					document
				})
			})
			.then((resp) => {
				if (resp.status == 200) {
					window.location.reload();
				} else {
					console.error('Delete failed');
				}
			});
	}

	let selChar: string;
	let selPage: string;
</script>

<Metadata title="Editor Home" description="Landing page for editors" />

<h1>Editor Home</h1>
<p>Logged in as: {$session.editor.name}</p>

<div class="creation">
	<div class="characters">
		<h2>Characters</h2>
		<div>
			<select bind:value={selChar}>
				{#each [...chars] as [charId, charInfo]}
					<option value={charId}>{charInfo.info.name.translated}</option>
				{/each}
			</select>
			<button on:click={() => goto(`./characters/${selChar}`)}>Edit</button>
		</div>
		<div>
			<button on:click={() => goto(`./characters/!new`)}>Add Character</button>
		</div>
	</div>
	<div class="pages">
		<h2>Pages</h2>
		<div>
			<select bind:value={selPage}>
				{#each pagePaths as page}
					<option value={page}>{page.length > 0 ? page : '[home]'}</option>
				{/each}
			</select>
			<button on:click={() => goto(`./pages/${selPage}`)}>Edit</button>
			<button on:click={() => deleteItem('pages', pagePathToDocId(selPage))}>Delete</button>
		</div>
		<div>
			<button on:click={() => goto(`./pages/!new`)}>Add Page</button>
		</div>
	</div>
</div>

<style>
	.creation {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: flex-start;
	}

	.creation > div {
		margin: 0px 30px;
	}
</style>
