import { browser } from '$app/env';
import type { CharacterInfo, ImageTag } from './types/character';

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
		const resp = await fetch(`/api/character?id=${charId}`);
		if (resp.status == 200) {
			return (await resp.json()) as CharacterInfo;
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
		const infoMap = new Map();
		for (const file of files) {
			if (file.endsWith('.json') && !file.endsWith('.todo.json')) {
				const charId = file.substr(0, file.length - 5);

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
			return new Map(data);
		}
	}
	return new Map();
}

/**
 * Transforms the images from character info into a map with URLs for easier access
 * @param charInfo Character info object
 * @returns Map from image tag to URL
 */
export function getImageMap(charInfo: CharacterInfo): Map<ImageTag, string> {
	const map = new Map<ImageTag, string>();
	charInfo.images.forEach((img) => {
		map.set(img.tag, getImageUrl(img.file));
	});
	return map;
}
