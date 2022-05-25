import { hasPermission } from '$lib/permissions';
import { authEditorWithRequest, listContentObjects } from '$lib/server/editor';
import { deleteObject, uploadObject } from '$lib/server/s3';
import type { RequestHandler } from '@sveltejs/kit';

export type FilesPostRequest = {
	folder: string;
};
export const post: RequestHandler = async ({ request }) => {
	const { folder } = (await request.json()) as FilesPostRequest;
	const editor = await authEditorWithRequest(request);
	if (hasPermission(editor, 'files.list')) {
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

export type FilesPutRequest = {
	name: string;
	data: string;
	contentType: string;
};
export const put: RequestHandler = async ({ request }) => {
	const { name, data, contentType } = (await request.json()) as FilesPutRequest;
	const editor = await authEditorWithRequest(request);
	if (hasPermission(editor, 'files.upload')) {
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

export type FilesDeleteRequest = {
	name: string;
};
export const del: RequestHandler = async ({ request }) => {
	const { name } = (await request.json()) as FilesDeleteRequest;
	const editor = await authEditorWithRequest(request);
	if (hasPermission(editor, 'files.delete')) {
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
