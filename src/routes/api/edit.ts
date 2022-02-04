import { createBasic, deleteBasic, getEditorFromKey, makeEdit } from '$lib/editor';
import type { RequestHandler } from '@sveltejs/kit';

export const post: RequestHandler = async ({ body }) => {
	const { editorKey, collection, document, changes } = JSON.parse(body as string);
	const editor = getEditorFromKey(editorKey);
	if (editor) {
		try {
			await makeEdit(editorKey, collection, document, changes);
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

export const put: RequestHandler = async ({ body }) => {
	const { editorKey, collection, document, data } = JSON.parse(body as string);
	const editor = getEditorFromKey(editorKey);
	if (editor) {
		try {
			await createBasic(editorKey, collection, document, data);
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

export const del: RequestHandler = async ({ body }) => {
	const { editorKey, collection, document } = JSON.parse(body as string);
	const editor = getEditorFromKey(editorKey);
	if (editor) {
		try {
			await deleteBasic(editorKey, collection, document);
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
