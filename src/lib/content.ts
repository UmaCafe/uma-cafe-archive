import { browser } from '$app/env';
import { get, writable } from 'svelte/store';
import type { CharacterImageTag, CharacterInfo } from './types/character';
import type { RaceImageTag, RaceInfo } from './types/race';

export const CHAR_DATA = writable(new Map<string, CharacterInfo>());
export const RACE_DATA = writable(new Map<string, RaceInfo>());

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
	if (page.endsWith('README')) return null;
	if (!browser) {
		const { readFileSync, existsSync } = await import('fs');
		const dirs = page.split('/');
		const filesToCheck = [`${page}/index.md`];
		if (dirs[dirs.length - 1] != 'index') {
			filesToCheck.push(`${page}.md`);
		}
		for (const toCheck of filesToCheck) {
			const filePath = `content/pages/${toCheck}`;
			if (existsSync(filePath)) {
				return readFileSync(filePath, 'utf-8');
			}
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
export async function getCharacterInfo(charId: string): Promise<CharacterInfo | null> {
	if (!browser) {
		const { readFileSync, existsSync } = await import('fs');
		const filePath = `content/data/characters/${charId}.json`;
		if (existsSync(filePath)) {
			const json = readFileSync(filePath, 'utf-8');
			const data = JSON.parse(json);
			delete data['$schema'];
			return data as CharacterInfo;
		}
	} else {
		const charData = get(CHAR_DATA);
		if (charData.has(charId)) {
			return charData.get(charId);
		} else {
			const resp = await fetch(`/api/character?id=${charId}`);
			if (resp.status == 200) {
				const data = (await resp.json()) as CharacterInfo;
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
export async function getAllCharacters(): Promise<Map<string, CharacterInfo>> {
	if (!browser) {
		const { readFileSync, readdirSync } = await import('fs');
		const dirPath = `content/data/characters`;
		const files = readdirSync(dirPath);
		const infoMap = new Map<string, CharacterInfo>();
		for (const file of files) {
			if (file.endsWith('.json') && !file.endsWith('.todo.json')) {
				const charId = file.substring(0, file.length - 5);

				const json = readFileSync(`${dirPath}/${file}`, 'utf-8');
				const data = JSON.parse(json);
				delete data['$schema'];
				infoMap.set(charId, data as CharacterInfo);
			}
		}
		return infoMap;
	} else {
		const resp = await fetch(`/api/character?all=true`);
		if (resp.status == 200) {
			const data = await resp.json();
			const map = new Map(data) as Map<string, CharacterInfo>;
			CHAR_DATA.set(map);
			return map;
		}
	}
	return new Map();
}

export type ImageTag<T> = T extends CharacterInfo
	? CharacterImageTag
	: T extends RaceInfo
	? RaceImageTag
	: never;

/**
 * Transforms the images from an info object into a map with URLs for easier access
 * @param charInfo Character or Race info object
 * @returns Map from image tag to URL
 */
export function getImageMap<T extends RaceInfo | CharacterInfo>(
	infoObj: T
): Map<ImageTag<T>, string> {
	const map = new Map<ImageTag<T>, string>();
	infoObj.images.forEach((img: { tag: unknown; file: string }) => {
		map.set(img.tag as ImageTag<T>, getImageUrl(img.file));
	});
	return map;
}

/**
 * @returns Race info objects for all races keyed to their ID
 */
export async function getAllRaces(): Promise<Map<string, RaceInfo>> {
	if (!browser) {
		const { readFileSync, readdirSync } = await import('fs');
		const dirPath = `content/data/races`;
		const subdirs = readdirSync(dirPath);
		const files: [string, string][] = [];
		for (const subdir of subdirs) {
			const subfiles = readdirSync(`${dirPath}/${subdir}`);
			subfiles.forEach((subfile) => {
				files.push([subdir, subfile]);
			});
		}
		const infoMap = new Map<string, RaceInfo>();
		for (const [subdir, file] of files) {
			if (file.endsWith('.json') && !file.endsWith('.todo.json')) {
				const raceId = `${subdir}/${file.substring(0, file.length - 5)}`;

				const json = readFileSync(`${dirPath}/${subdir}/${file}`, 'utf-8');
				const data = JSON.parse(json);
				delete data['$schema'];
				infoMap.set(raceId, data as RaceInfo);
			}
		}
		return infoMap;
	} else {
		const resp = await fetch(`/api/race?all=true`);
		if (resp.status == 200) {
			const data = await resp.json();
			const map = new Map(data) as Map<string, RaceInfo>;
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
export async function getRaceInfo(raceId: string): Promise<RaceInfo | null> {
	if (!browser) {
		const { readFileSync, existsSync } = await import('fs');
		const filePath = `content/data/races/${raceId}.json`;
		if (existsSync(filePath)) {
			const json = readFileSync(filePath, 'utf-8');
			const data = JSON.parse(json);
			delete data['$schema'];
			return data as RaceInfo;
		}
	} else {
		const raceData = get(RACE_DATA);
		if (raceData.has(raceId)) {
			return raceData.get(raceId);
		} else {
			const resp = await fetch(`/api/race?id=${raceId}`);
			if (resp.status == 200) {
				const data = (await resp.json()) as RaceInfo;
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
