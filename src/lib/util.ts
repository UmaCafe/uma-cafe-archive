import { page } from '$app/stores';
import { get } from 'svelte/store';

export const IMAGE_MIMES = 'image/png,image/jpeg';
export const AUDIO_MIMES = 'audio/mpeg';

export function ordinalNumber(num: number): string {
	let suff = 'th';
	if (num % 100 < 10 || num % 100 > 20) {
		if (num % 10 == 1) {
			suff = 'st';
		} else if (num % 10 == 2) {
			suff = 'nd';
		} else if (num % 10 == 3) {
			suff = 'rd';
		}
	}
	return `${num}${suff}`;
}

export const MONTHS = new Map<number, string>([
	[1, 'Jan'],
	[2, 'Feb'],
	[3, 'Mar'],
	[4, 'Apr'],
	[5, 'May'],
	[6, 'Jun'],
	[7, 'Jul'],
	[8, 'Aug'],
	[9, 'Sep'],
	[10, 'Oct'],
	[11, 'Nov'],
	[12, 'Dec']
]);

export type ChangeInstance = { key: string; before: unknown; after: unknown };

export function getChangesBetween<T>(
	original: T,
	modified: T,
	keyBuild = ''
): Array<ChangeInstance> {
	let changes: Array<ChangeInstance> = [];
	let allKeys: (keyof T)[] = [];
	if (original) allKeys = allKeys.concat(Object.keys(original) as (keyof T)[]);
	if (modified) allKeys = allKeys.concat(Object.keys(modified) as (keyof T)[]);
	allKeys = [...new Set(allKeys)];
	for (const key of allKeys) {
		const originalVal = original?.[key];
		const modifiedVal = modified?.[key];
		const curKey = keyBuild + `${keyBuild.length > 0 ? '.' : ''}${key}`;
		if (Array.isArray(originalVal) && Array.isArray(modifiedVal)) {
			if (JSON.stringify(originalVal) != JSON.stringify(modifiedVal)) {
				changes.push({ key: curKey, before: originalVal, after: modifiedVal });
			}
		} else if (typeof originalVal == 'object') {
			changes = changes.concat(getChangesBetween(originalVal, modifiedVal, curKey));
		} else {
			if (originalVal != modifiedVal) {
				changes.push({ key: curKey, before: originalVal, after: modifiedVal });
			}
		}
	}
	return changes;
}

export function getObjectFromChangeList(changes: ChangeInstance[]): Record<string, unknown> {
	const data: Record<string, unknown> = {};
	for (const change of changes) {
		data[change.key] = change.after;
	}
	return data;
}

export function getContentUrl<T extends string | undefined>(fileName: T): T {
	if (typeof fileName === 'undefined') return undefined as T;
	if (fileName.startsWith('/')) fileName = fileName.substring(1) as T;
	return `https://static.uma.cafe/${fileName}` as T;
}

export function pagePathToDocId(pagePath: string): string {
	if (pagePath.startsWith('/')) pagePath = pagePath.slice(1);
	if (pagePath.length == 0) return 'index';
	return pagePath.replace(/\./g, '').replace(/\//g, '.');
}

export function docIdToPagePath(docId: string): string {
	if (docId == 'index') return '';
	return docId.replace(/\./g, '/');
}

export function mapToJson<K, V>(map: Map<K, V>): string {
	return JSON.stringify([...map.entries()]);
}

export function jsonToMap<K, V>(json: string): Map<K, V> {
	return new Map(JSON.parse(json));
}

export function sortedJson(val: unknown): string {
	if (val != null && typeof val == 'object' && !Array.isArray(val)) {
		const obj = val as Record<string, unknown>;
		const newObj: typeof obj = {};
		for (const k of Object.keys(obj).sort()) {
			newObj[k] = obj[k];
		}
		return JSON.stringify(newObj);
	}
	return JSON.stringify(val);
}

export function camelCaseToLabel(string: string): string {
	return string.charAt(0).toUpperCase() + string.substring(1).replace(/([A-Z])/g, ' $1');
}

/**
 * Helper function to allow not rendering things in pages when previewing them in the editor
 */
export function isPreview(): boolean {
	return get(page).url.pathname.startsWith('/editor/');
}

export type KVPair = {
	key: string;
	val: string;
};

export type ObjectEditorMeta = {
	assetFolder: string;
};
