import { createBasic, deleteBasic, getSessionFromRequest, makeEdit } from '$lib/server/editor';
import type { RequestHandler } from '@sveltejs/kit';

export const post: RequestHandler = async ({ request }) => {
	const { collection, document, changes } = await request.json();
	const session = getSessionFromRequest(request);
	try {
		if (await makeEdit(session, collection, document, changes)) {
			return {
				status: 200,
				body: 'Success'
			};
		}
	} catch (e) {
		return {
			status: 500,
			body: e
		};
	}

	return {
		status: 401,
		body: 'Unauthorized'
	};
};

export const put: RequestHandler = async ({ request }) => {
	const { collection, document, data } = await request.json();
	const session = getSessionFromRequest(request);
	try {
		if (await createBasic(session, collection, document, data)) {
			return {
				status: 200,
				body: 'Success'
			};
		}
	} catch (e) {
		return {
			status: 500,
			body: e
		};
	}

	return {
		status: 401,
		body: 'Unauthorized'
	};
};

export const del: RequestHandler = async ({ request }) => {
	const { collection, document } = await request.json();
	const session = getSessionFromRequest(request);
	try {
		if (await deleteBasic(session, collection, document)) {
			return {
				status: 200,
				body: 'Success'
			};
		}
	} catch (e) {
		return {
			status: 500,
			body: e
		};
	}

	return {
		status: 401,
		body: 'Unauthorized'
	};
};
