import { getEditorFromKey } from '$lib/server/editor';
import type { GetSession, Handle } from '@sveltejs/kit';
import * as cookie from 'cookie';
import * as firebase from 'firebase-admin';
import { applicationDefault, initializeApp } from 'firebase-admin/app';

if (!firebase.apps || firebase.apps.length <= 0) {
	initializeApp({
		credential: applicationDefault()
	});
}

export const handle: Handle = async ({ event, resolve }) => {
	if (event.request.headers.has('cookie')) {
		const cookies = cookie.parse(event.request.headers.get('cookie'));

		if (cookies['editor_key']) {
			const editorObj = await getEditorFromKey(cookies['editor_key']);
			if (editorObj) {
				event.locals['editor'] = editorObj;
			}
		}
	}

	const response = await resolve(event);
	return response;
};

export const getSession: GetSession = async ({ locals }) => {
	const session = {};
	if (locals['editor']) session['editor'] = locals['editor'];
	return session;
};
