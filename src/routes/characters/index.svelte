<script lang="ts" context="module">
	import CharacterIcon from '$lib/components/character_icon.svelte';
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
</script>

<Metadata title="Character List" description="List of Uma Musume characters." />

<div class="char-container">
	<h1>Characters</h1>
	<div class="char-list">
		{#each [...chars] as [charId, charInfo]}
			<div class="char">
				<a href={`/characters/${charId}`}>
					<div class="inner">
						<CharacterIcon {charInfo} />
					</div>
				</a>
			</div>
		{/each}
	</div>
</div>

<style>
	.char-container {
		padding: 10px 30px;
	}

	.char-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-evenly;
	}

	.char {
		flex-basis: 0;
		padding: 5px;
	}

	a {
		text-decoration: none;
	}

	a .inner {
		transform: scale(1);
		transition: transform 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
	}

	a:hover .inner {
		transform: scale(0.95);
	}
</style>
