import { Page } from '$lib/data/page';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async () => {
	return {
		status: 200,
		body: { type: Page.prototype._type }
	};
};
