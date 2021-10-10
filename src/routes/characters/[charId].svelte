<script type="ts" context="module">
	import CharacterInformation from '$lib/components/character_information.svelte';
	import Metadata from '$lib/components/metadata.svelte';
	import { getCharacterInfo, getImageUrl } from '$lib/content';
	import type { CharacterInfo } from '$lib/types/character';
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ page }) => {
		let charId = page.params.charId;
		const charInfo = await getCharacterInfo(charId);
		if (charInfo) {
			return {
				props: {
					charInfo
				}
			};
		}
	};
</script>

<script lang="ts">
	export let charInfo: CharacterInfo;
	const icon = charInfo.images.find((i) => i.tag == 'icon');
</script>

<Metadata
	title={charInfo.info.name.translated}
	description={`Information about ${charInfo.info.name.translated}`}
	image={icon ? getImageUrl(icon.file) : undefined}
/>

<CharacterInformation {charInfo} />
