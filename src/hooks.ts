import { getEditorFromKey } from '$lib/editor';
import type { GetSession, Handle } from '@sveltejs/kit';
import * as cookie from 'cookie';

export const handle: Handle = async ({ request, resolve }) => {
	if (request.headers.cookie) {
		const cookies = cookie.parse(request.headers.cookie);

		if (cookies['editor_key']) {
			const editorObj = await getEditorFromKey(cookies['editor_key']);
			if (editorObj) {
				request.locals['editor'] = editorObj;
			}
		}
	}

	const response = await resolve(request);
	return response;
};

export const getSession: GetSession = async ({ locals }) => {
	const session = {};
	if (locals['editor']) session['editor'] = locals['editor'];
	return session;
};
