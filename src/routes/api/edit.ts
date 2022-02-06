import { createBasic, deleteBasic, getEditorFromKey, makeEdit } from '$lib/server/editor';
import type { RequestHandler } from '@sveltejs/kit';

export const post: RequestHandler = async ({ request }) => {
	const { editorKey, collection, document, changes } = await request.json();
	const editor = await getEditorFromKey(editorKey);
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

export const put: RequestHandler = async ({ request }) => {
	const { editorKey, collection, document, data } = await request.json();
	const editor = await getEditorFromKey(editorKey);
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

export const del: RequestHandler = async ({ request }) => {
	const { editorKey, collection, document } = await request.json();
	const editor = await getEditorFromKey(editorKey);
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
