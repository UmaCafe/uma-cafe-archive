import { getEditorFromKey, listContentObjects } from '$lib/editor';
import { deleteObject, uploadObject } from '$lib/external/s3';
import type { RequestHandler } from '@sveltejs/kit';

export const post: RequestHandler = async ({ body }) => {
	const { editorKey, folder } = JSON.parse(body as string);
	const editor = await getEditorFromKey(editorKey);
	if (editor) {
		const objs = await listContentObjects(editorKey, folder);
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

export const put: RequestHandler = async ({ body }) => {
	const { editorKey, name, data, contentType } = JSON.parse(body as string);
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

export const del: RequestHandler = async ({ body }) => {
	const { editorKey, name } = JSON.parse(body as string);
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
