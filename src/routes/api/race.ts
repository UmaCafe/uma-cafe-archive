import { getAllRaces, getRaceInfo } from '$lib/content/races';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ query }) => {
	if (query.has('id')) {
		const raceId = query.get('id');
		const info = await getRaceInfo(raceId);
		if (info) {
			return {
				status: 200,
				body: JSON.stringify(info),
				headers: {
					'content-type': 'application/json'
				}
			};
		}
	} else if (query.has('all') && query.get('all')) {
		const infoObjs = await getAllRaces();
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
