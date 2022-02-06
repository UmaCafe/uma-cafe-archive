import { getAllCharacters, getCharacterInfo } from '$lib/server/characters';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ url }) => {
	if (url.searchParams.has('id')) {
		const charId = url.searchParams.get('id');
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
	} else if (url.searchParams.has('all') && url.searchParams.get('all')) {
		const infoObjs = await getAllCharacters(
			url.searchParams.has('invis') && url.searchParams.get('invis') == '1'
		);
		return {
			status: 200,
			body: JSON.stringify([...infoObjs]),
			headers: {
				'content-type': 'application/json'
			}
		};
	}
	return {
		status: 400
	};
};
