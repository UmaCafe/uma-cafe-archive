import { generateSessionCookie } from '$lib/server/external/firebaseAuth';
import type { RequestHandler } from '@sveltejs/kit';
import * as cookie from 'cookie';

export const post: RequestHandler = async ({ request }) => {
	const { idToken } = await request.json();
	if (idToken) {
		const session = await generateSessionCookie(idToken);
		if (session) {
			return {
				status: 200,
				headers: {
					'Set-Cookie': cookie.serialize('session', session, {
						path: '/'
					})
				}
			};
		}
	}

	return {
		status: 401,
		body: 'Unauthorized'
	};
};
