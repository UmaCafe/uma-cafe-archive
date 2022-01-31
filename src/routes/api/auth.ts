import { getEditorFromKey } from '$lib/editor';
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

export const post: RequestHandler = async ({ body }) => {
	const { password } = JSON.parse(body as string);
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
