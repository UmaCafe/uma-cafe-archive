import { authEditorWithRequest } from '$lib/server/editor';
import type { GetSession, Handle } from '@sveltejs/kit';
import * as firebase from 'firebase-admin';
import { cert, initializeApp } from 'firebase-admin/app';

if (!firebase.apps || firebase.apps.length <= 0) {
	initializeApp({
		credential: cert('gcloud_credentials.json')
	});
}

export const handle: Handle = async ({ event, resolve }) => {
	const editorObj = await authEditorWithRequest(event.request);
	if (editorObj) {
		event.locals.editor = editorObj;
	}

	const response = await resolve(event);
	return response;
};

export const getSession: GetSession = async ({ locals }) => {
	const session: App.Session = {};
	if (locals.editor) session.editor = locals.editor;
	return session;
};
