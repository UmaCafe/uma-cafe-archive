import { Character } from '$lib/data/character';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async () => {
	return {
		status: 200,
		body: { type: Character.prototype._type }
	};
};
