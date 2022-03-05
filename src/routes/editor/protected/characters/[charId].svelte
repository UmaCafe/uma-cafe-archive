<script lang="ts" context="module">
	import { getCharacterInfo } from '$lib/client/characters';
	import EditorView from '$lib/components/editor/editor_view.svelte';
	import PageRenderer from '$lib/components/editor/page_renderer.svelte';
	import Metadata from '$lib/components/metadata.svelte';
	import { CHARACTER_METADATA } from '$lib/editor/meta/character';
	import type { CharacterObject } from '$lib/types/character';
	import type { Load } from '@sveltejs/kit';
	import CharacterPage, { load as charLoad } from '../../../characters/[charId].svelte';

	export const load: Load = async ({ fetch, params }) => {
		let charId = params.charId;
		const charObj = await getCharacterInfo(fetch, charId);
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
	metaObject={CHARACTER_METADATA}
	object={charObj}
	assetFolder={`characters/${charObj.assetId}`}
	let:previewObject
>
	{#if previewObject}
		<PageRenderer
			component={CharacterPage}
			load={charLoad}
			params={{ charId: charId }}
			props={{ charObj: previewObject }}
		/>
	{/if}
</EditorView>
