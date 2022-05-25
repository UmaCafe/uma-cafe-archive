import { loadFromDatabase } from '$lib/data/base/server';
import { Character } from '$lib/data/character';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ params }) => {
	const charId = params.charId;
	const char = await loadFromDatabase(Character, charId);
	if (char._loaded) {
		return {
			status: 200,
			body: {
				characterJson: JSON.stringify(char)
			}
		};
	}

	return {
		status: 404
	};
};
