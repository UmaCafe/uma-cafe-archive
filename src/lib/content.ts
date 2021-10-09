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

export async function getCharacterInfo(charId: string): Promise<CharacterInfo | null> {
	if (charId == '_template') return null;
	if (!browser) {
		const { readFileSync, existsSync } = await import('fs');
		const filePath = `content/data/characters/${charId}.json`;
		if (existsSync(filePath)) {
			const data = readFileSync(filePath, 'utf-8');
			return JSON.parse(data) as CharacterInfo;
		}
	} else {
		const resp = await fetch(`/api/character?id=${charId}`);
		if (resp.status == 200) {
			return (await resp.json()) as CharacterInfo;
		}
	}
	return null;
}

export function getImageMap(charInfo: CharacterInfo): Map<ImageTag, string> {
	const map = new Map<ImageTag, string>();
	if (charInfo.images) {
		charInfo.images.forEach((img) => {
			map.set(img.tag, getImageUrl(img.file));
		});
	}
	return map;
}
