import { getCharacterInfo } from '$lib/content';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ query }) => {
	if (query.has('id')) {
		const charId = query.get('id');
		const info = await getCharacterInfo(charId);
		if (info) {
			return {
				status: 200,
				body: JSON.stringify(info),
				headers: {
					'content-type': 'application/json'
				}
			};
		}
	}
	return {
		status: 400
	};
};
