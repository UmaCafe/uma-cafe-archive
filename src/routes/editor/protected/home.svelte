<script lang="ts" context="module">
	import { goto } from '$app/navigation';
	import { session } from '$app/stores';
	import Metadata from '$lib/components/metadata.svelte';
	import { getAllCharacters } from '$lib/content';
	import type { CharacterObject } from '$lib/types/character';
	import type { Load } from '@sveltejs/kit';
	export const load: Load = async () => {
		const chars = await getAllCharacters();
		return {
			props: {
				chars
			}
		};
	};
</script>

<script lang="ts">
	export let chars: Map<string, CharacterObject>;

	let selChar: string;
</script>

<Metadata title="Editor Home" description="Landing page for editors" />

<h1>Editor Home</h1>
<p>Logged in as: {$session.editor.name}</p>

<div class="creation">
	<h2>Characters</h2>
	<select bind:value={selChar}>
		{#each [...chars] as [charId, charInfo]}
			<option value={charId}>{charInfo.info.name.translated}</option>
		{/each}
	</select>
	<button on:click={() => goto(`./characters/${selChar}`)}>Edit</button>
</div>
