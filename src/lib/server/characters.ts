import { characterDb } from '$lib/server/external/firestore';
import type { CharacterObject } from '$lib/types/character';
import type { QueryDocumentSnapshot } from 'firebase-admin/firestore';

/**
 * @param charId The reference ID of the character
 * @returns Character info object for the character, or null if it doesn't exist
 */
export async function getCharacterInfo(charId: string): Promise<CharacterObject | null> {
	const chars = await characterDb();
	const charData = await chars.doc(charId).get();
	if (charData.exists) {
		return charData.data();
	}
	return null;
}

/**
 * @returns Character info objects for all characters keyed to their ID
 */
export async function getAllCharacters(
	allowInvisible = false
): Promise<Map<string, CharacterObject>> {
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
}
