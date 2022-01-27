<script lang="ts" context="module">
	import CharacterInformation from '$lib/components/character_information.svelte';
	import Metadata from '$lib/components/metadata.svelte';
	import { getCharacterInfo } from '$lib/content';
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

<CharacterInformation charInfo={charObj} />
