import { browser } from '$app/env';
import { characterDb } from '$lib/external/firestore';
import type { CharacterObject } from '$lib/types/character';
import type { QueryDocumentSnapshot } from '@google-cloud/firestore';
import { get, writable } from 'svelte/store';

export const CHAR_DATA = writable(new Map<string, CharacterObject>());

/**
 * @param charId The reference ID of the character
 * @returns Character info object for the character, or null if it doesn't exist
 */
export async function getCharacterInfo(charId: string): Promise<CharacterObject | null> {
	if (!browser) {
		const chars = await characterDb();
		const charData = await chars.doc(charId).get();
		if (charData.exists) {
			return charData.data();
		}
	} else {
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
	return null;
}

/**
 * @returns Character info objects for all characters keyed to their ID
 */
export async function getAllCharacters(
	allowInvisible = false
): Promise<Map<string, CharacterObject>> {
	if (!browser) {
		const chars = await characterDb();
		let docList: QueryDocumentSnapshot<CharacterObject>[];
		if (allowInvisible) {
			docList = (await chars.get()).docs;
		} else {
			docList = (await chars.where('visible', '==', true).get()).docs;
		}
		const dataList = docList.map(async (doc) => {
			return [doc.id, doc.data()] as [string, CharacterObject];
		});
		return new Map(await Promise.all(dataList));
	} else {
		const resp = await fetch(`/api/character?all=true` + (allowInvisible ? `&invis=1` : ``));
		if (resp.status == 200) {
			const data = await resp.json();
			const map = new Map(data) as Map<string, CharacterObject>;
			CHAR_DATA.set(map);
			return map;
		}
	}
	return new Map();
}
