import type { RequestHandler } from '@sveltejs/kit';
import * as cookie from 'cookie';

export const get: RequestHandler = async () => {
	return {
		status: 302,
		headers: {
			Location: '/',
			'Set-Cookie': cookie.serialize('session', '', {
				path: '/'
			})
		}
	};
};
