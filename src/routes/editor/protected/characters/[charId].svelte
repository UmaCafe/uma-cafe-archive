<script lang="ts" context="module">
	import EditorView from '$lib/components/editor/editor_view.svelte';
	import Metadata from '$lib/components/metadata.svelte';
	import CharacterPage from '$lib/components/pages/character_page.svelte';
	import { getCharacterInfo } from '$lib/content';
	import { CHARACTER_EXAMPLE } from '$lib/examples';
	import type { CharacterObject } from '$lib/types/character';
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ page }) => {
		let charId = page.params.charId;
		const charObj = await getCharacterInfo(charId);
		if (charObj) {
			return {
				props: {
					charId,
					charObj
				}
			};
		}
	};
</script>

<script lang="ts">
	export let charId: string;
	export let charObj: CharacterObject;
</script>

<Metadata title="Character Editor" description="Editing character" />

<EditorView
	collection="characters"
	document={charId}
	exampleObject={CHARACTER_EXAMPLE}
	object={charObj}
	let:previewObject
>
	{#if previewObject}
		<CharacterPage charObj={previewObject} />
	{/if}
</EditorView>
