import { getAllRaces, getRaceInfo } from '$lib/server/races';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ url }) => {
	if (url.searchParams.has('id')) {
		const raceId = url.searchParams.get('id');
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
	} else if (url.searchParams.has('all') && url.searchParams.get('all')) {
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
