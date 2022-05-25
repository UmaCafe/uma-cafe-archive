import { loadFromDatabase } from '$lib/data/base/server';
import { Page } from '$lib/data/page';
import { pagePathToDocId } from '$lib/util';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ params }) => {
	const path = params.pagePath;
	const page = await loadFromDatabase(Page, pagePathToDocId(path));
	if (path != 'index' && page._loaded) {
		return {
			status: 200,
			body: { pageJson: JSON.stringify(page) }
		};
	}
	return {
		status: 404
	};
};
