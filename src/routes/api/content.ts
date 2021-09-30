import { getPageMarkdown } from '$lib/content';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ query }) => {
	if (query.has('page')) {
		const page = query.get('page');
		const md = await getPageMarkdown(page);
		return {
			status: 200,
			body: md
		};
	}
	return {
		status: 400
	};
};
