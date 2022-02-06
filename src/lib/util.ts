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

export const MONTHS = {
	1: 'Jan',
	2: 'Feb',
	3: 'Mar',
	4: 'Apr',
	5: 'May',
	6: 'Jun',
	7: 'Jul',
	8: 'Aug',
	9: 'Sep',
	10: 'Oct',
	11: 'Nov',
	12: 'Dec'
};

export type ChangeInstance = { key: string; before: unknown; after: unknown };

export function getChangesBetween<T>(
	original: T,
	modified: T,
	keyBuild = ''
): Array<ChangeInstance> {
	let changes: Array<ChangeInstance> = [];
	let allKeys = [];
	if (original) allKeys = allKeys.concat(Object.keys(original));
	if (modified) allKeys = allKeys.concat(Object.keys(modified));
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
