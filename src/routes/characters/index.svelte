<script lang="ts">
	import CharacterIcon from '$lib/components/character_icon.svelte';
	import Metadata from '$lib/components/metadata.svelte';
	import { fromJson } from '$lib/data/base/objects';
	import type { Character } from '$lib/data/character';

	export let characterJsonList: string[];
	export let characters = characterJsonList.map((json) => fromJson<Character>(json));
</script>

<Metadata title="Character List" description="List of Uma Musume characters." />

<div class="char-container">
	<h1>Characters</h1>
	<div class="char-list">
		{#each characters as character}
			<div class="char">
				<a href={`/characters/${character.id}`}>
					<div class="inner">
						<CharacterIcon {character} />
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
		justify-content: center;
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
		transform: scale(0.96);
	}
</style>
