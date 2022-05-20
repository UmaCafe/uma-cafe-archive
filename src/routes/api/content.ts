import { getPageMarkdown, listPagePaths } from '$lib/server/pages';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ url }) => {
	if (url.searchParams.has('page')) {
		const page = url.searchParams.get('page') as string;
		const md = await getPageMarkdown(page);
		if (md) {
			return {
				status: 200,
				body: md
			};
		}
	} else if (url.searchParams.has('all') && url.searchParams.get('all')) {
		const pagePaths = await listPagePaths();
		return {
			status: 200,
			body: JSON.stringify([...pagePaths]),
			headers: {
				'content-type': 'application/json'
			}
		};
	}
	return {
		status: 400
	};
};
