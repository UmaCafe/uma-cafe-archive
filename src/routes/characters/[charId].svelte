<script type="ts" context="module">
	import CharacterInformation from '$lib/components/character_information.svelte';
	import { getCharacterInfo } from '$lib/content';
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
</script>

<CharacterInformation {charInfo} />
