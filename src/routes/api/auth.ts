import { getEditorFromKey } from '$lib/server/editor';
import type { RequestHandler } from '@sveltejs/kit';
import * as cookie from 'cookie';

export const get: RequestHandler = async () => {
	return {
		status: 302,
		headers: {
			Location: '/',
			'Set-Cookie': cookie.serialize('editor_key', '', {
				path: '/'
			})
		}
	};
};

export const post: RequestHandler = async ({ request }) => {
	const { password } = await request.json();
	if (password) {
		const editor = await getEditorFromKey(password);
		if (editor) {
			return {
				status: 200,
				body: { editor },
				headers: {
					'Set-Cookie': cookie.serialize('editor_key', editor.key, {
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
