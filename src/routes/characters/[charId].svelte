<script lang="ts" context="module">
	import Metadata from '$lib/components/metadata.svelte';
	import CharacterPage from '$lib/components/pages/character_page.svelte';
	import { getCharacterInfo } from '$lib/content/characters';
	import type { CharacterObject } from '$lib/types/character';
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ page }) => {
		let charId = page.params.charId;
		const charObj = await getCharacterInfo(charId);
		if (charObj) {
			return {
				props: {
					charObj
				}
			};
		}
	};
</script>

<script lang="ts">
	export let charObj: CharacterObject;
	let description = `Information about ${charObj.info.name.translated} from Uma Musume`;
	if (charObj.info.bio?.about) {
		description = charObj.info.bio.about;
	}
</script>

<Metadata title={charObj.info.name.translated} {description} image={charObj.images.icon} />

<CharacterPage {charObj} />
