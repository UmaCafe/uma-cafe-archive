import { getEditorFromKey, makeEdit } from '$lib/editor';
import type { RequestHandler } from '@sveltejs/kit';

export const post: RequestHandler = async ({ body }) => {
	const { editorKey, collection, document, changes } = JSON.parse(body as string);
	const editor = getEditorFromKey(editorKey);
	if (editor) {
		try {
			makeEdit(editorKey, collection, document, changes);
			return {
				status: 200,
				body: 'Success'
			};
		} catch (e) {
			return {
				status: 500,
				body: e
			};
		}
	}

	return {
		status: 401,
		body: 'Unauthorized'
	};
};
