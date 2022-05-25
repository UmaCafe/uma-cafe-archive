import { loadAllFromDatabase } from '$lib/data/base/server';
import { Character } from '$lib/data/character';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async () => {
	const chars = await loadAllFromDatabase(Character, {}, (col) => col.where('visible', '==', true));
	return {
		status: 200,
		body: {
			characterJsonList: chars.map((char) => JSON.stringify(char))
		}
	};
};
