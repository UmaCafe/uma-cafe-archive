import { browser } from '$app/env';
import type { QueryDocumentSnapshot } from '@google-cloud/firestore';
import { get, writable } from 'svelte/store';
import { characterDb, pageDb, raceDb } from './db/firestore';
import type { CharacterObject } from './types/character';
import type { RaceObject } from './types/race';

export const CHAR_DATA = writable(new Map<string, CharacterObject>());
export const RACE_DATA = writable(new Map<string, RaceObject>());

/**
 * Transform an image name relative to the images folder into the absolute path used by an <img> tag
 * @param image The image filename or path relative to `$content/public/images`, omitting leading slash
 * @returns Absolute image path
 */
export function getImageUrl(image: string): string {
	return `/images/${image}`;
}

/**
 * Reads the markdown content of a page for processing
 * @param page The page name relative to `$content/pages`, omitting leading slash
 * @returns Markdown content as a string, or null if page not found
 */
export async function getPageMarkdown(page: string): Promise<string | null> {
	if (!browser) {
		const pages = await pageDb();
		if (page == 'index') return null;
		if (page.length == 0) page = 'index';
		const docId = page.replace(/\./g, '').replace(/\//g, '.');
		const pageData = await pages.doc(docId).get();
		if (pageData.exists) {
			const pageObj = pageData.data();
			return pageObj.md.replace(/\\n/g, '\n');
		}
	} else {
		const resp = await fetch(`/api/content?page=${page}`);
		if (resp.status == 200) {
			return await resp.text();
		}
	}
	return null;
}

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

/**
 * @returns Race info objects for all races keyed to their ID
 */
export async function getAllRaces(): Promise<Map<string, RaceObject>> {
	if (!browser) {
		const races = await raceDb();
		const docList = await races.listDocuments();
		const dataList = docList.map(async (docRef) => {
			const data = await docRef.get();
			return [data.id, data.data()] as [string, RaceObject];
		});
		return new Map(await Promise.all(dataList));
	} else {
		const resp = await fetch(`/api/race?all=true`);
		if (resp.status == 200) {
			const data = await resp.json();
			const map = new Map(data) as Map<string, RaceObject>;
			RACE_DATA.set(map);
			return map;
		}
	}
	return new Map();
}

/**
 * @param raceId The reference ID of the race
 * @returns Race info object for the race, or null if it doesn't exist
 */
export async function getRaceInfo(raceId: string): Promise<RaceObject | null> {
	if (!browser) {
		const races = await raceDb();
		const raceDoc = await races.doc(raceId).get();
		if (raceDoc.exists) {
			const raceObj = raceDoc.data();
			return raceObj;
		}
	} else {
		const raceData = get(RACE_DATA);
		if (raceData.has(raceId)) {
			return raceData.get(raceId);
		} else {
			const resp = await fetch(`/api/race?id=${raceId}`);
			if (resp.status == 200) {
				const data = (await resp.json()) as RaceObject;
				RACE_DATA.update((val) => {
					val.set(raceId, data);
					return val;
				});
				return data;
			}
		}
	}
	return null;
}
