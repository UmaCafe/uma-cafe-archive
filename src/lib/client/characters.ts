import type { CharacterObject } from '$lib/types/character';
import type { Fetch } from '$lib/types/fetch';
import { get, writable } from 'svelte/store';

export const CHAR_DATA = writable(new Map<string, CharacterObject>());

export async function getCharacterInfo(
	fetch: Fetch,
	charId: string
): Promise<CharacterObject | null> {
	const charData = get(CHAR_DATA);
	if (charData.has(charId)) {
		return charData.get(charId);
	} else {
		const resp = await fetch(`/api/character?id=${charId}`);
		if (resp.status == 200) {
			const data = (await resp.json()) as CharacterObject;
			CHAR_DATA.update((val) => {
				val.set(charId, data);
				return val;
			});
			return data;
		}
	}
}

export async function getAllCharacters(
	fetch: Fetch,
	allowInvisible = false
): Promise<Map<string, CharacterObject>> {
	const resp = await fetch(`/api/character?all=true` + (allowInvisible ? `&invis=1` : ``));
	if (resp.status == 200) {
		const data = await resp.json();
		const map = new Map(data) as Map<string, CharacterObject>;
		CHAR_DATA.set(map);
		return map;
	}
}
