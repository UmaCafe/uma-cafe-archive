import { getEditorFromKey, listContentObjects } from '$lib/server/editor';
import { deleteObject, uploadObject } from '$lib/server/external/s3';
import type { RequestHandler } from '@sveltejs/kit';

export const post: RequestHandler = async ({ request }) => {
	const { editorKey, folder } = await request.json();
	const editor = await getEditorFromKey(editorKey);
	if (editor) {
		const objs = await listContentObjects(folder);
		return {
			status: 200,
			body: JSON.stringify(objs),
			headers: {
				'content-type': 'application/json'
			}
		};
	}

	return {
		status: 401,
		body: 'Unauthorized'
	};
};

export const put: RequestHandler = async ({ request }) => {
	const { editorKey, name, data, contentType } = await request.json();
	const editor = await getEditorFromKey(editorKey);
	if (editor) {
		const buf = Buffer.from(data.replace(/^data:image\/\w+;base64,/, ''), 'base64');
		await uploadObject(name, buf, contentType);
		return {
			status: 200,
			body: 'Success'
		};
	}

	return {
		status: 401,
		body: 'Unauthorized'
	};
};

export const del: RequestHandler = async ({ request }) => {
	const { editorKey, name } = await request.json();
	const editor = await getEditorFromKey(editorKey);
	if (editor) {
		await deleteObject(name);
		return {
			status: 200,
			body: 'Success'
		};
	}

	return {
		status: 401,
		body: 'Unauthorized'
	};
};
