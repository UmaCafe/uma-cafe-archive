import { getEditorFromKey } from '$lib/editor';
import { listObjects, uploadObject } from '$lib/external/s3';
import type { RequestHandler } from '@sveltejs/kit';

export const post: RequestHandler = async ({ body }) => {
	const { editorKey, folder } = JSON.parse(body as string);
	const editor = getEditorFromKey(editorKey);
	if (editor) {
		const objects = await listObjects(folder);
		const obj = objects.map((obj) => {
			return { name: obj.Key };
		});
		return {
			status: 200,
			body: JSON.stringify(obj),
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
	const { editorKey, name, data } = JSON.parse(body as string);
	const editor = getEditorFromKey(editorKey);
	if (editor) {
		await uploadObject(name, data);
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
