<script lang="ts">
	import EditorView from '$lib/components/editor/editor_view.svelte';
	import Metadata from '$lib/components/metadata.svelte';
	import type { EditorInformation } from '$lib/data/base/objects';
	import type { Character } from '$lib/data/character';
	import CharacterPage from '../../characters/[charId].svelte';

	export let id: string;
	export let type: string;
	export let infoJson: string;
	let info = JSON.parse(infoJson) as EditorInformation<Character>[];
	$: info = JSON.parse(infoJson) as EditorInformation<Character>[];

	const folderPath = info.find((v) => v.objKey == 'assetId')?.dbVal ?? id.replace(/-/g, '');
</script>

<Metadata title="Character Editor" description="Editing character" />

<EditorView
	{info}
	{type}
	{id}
	assetFolder="characters/{folderPath}"
	path="characters/{id}"
	let:previewJson
>
	{#if previewJson}
		<CharacterPage characterJson={previewJson} />
	{/if}
</EditorView>
