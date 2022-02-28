<script lang="ts" context="module">
	import { getCharacterInfo } from '$lib/client/characters';
	import Metadata from '$lib/components/metadata.svelte';
	import CharacterPage from '$lib/components/pages/character_page.svelte';
	import type { CharacterObject } from '$lib/types/character';
	import { getContentUrl } from '$lib/util';
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ fetch, params }) => {
		let charId = params.charId;
		const charObj = await getCharacterInfo(fetch, charId);
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

<Metadata
	title={charObj.info.name.translated}
	{description}
	image={getContentUrl(charObj.images.icon)}
/>

<CharacterPage {charObj} />
