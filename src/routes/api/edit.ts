import { DatabaseObject, OBJECT_BY_TYPE } from '$lib/data/base/objects';
import { loadFromDatabase, loadFromDatabaseData } from '$lib/data/base/server';
import { createObject, deleteObject, editObject, getSessionFromRequest } from '$lib/server/editor';
import type { ChangeInstance } from '$lib/util';
import { getObjectFromChangeList } from '$lib/util';
import type { RequestHandler } from '@sveltejs/kit';

export type EditPostRequest = {
	type: string;
	id: string;
	changes: ChangeInstance[];
	update: boolean;
};
export const post: RequestHandler = async ({ request }) => {
	const { type, id, changes, update } = (await request.json()) as EditPostRequest;
	const session = getSessionFromRequest(request);
	try {
		if (session) {
			if (update) {
				if (await editObject(session, type, id, changes)) {
					return {
						status: 200,
						body: 'Success'
					};
				}
			} else {
				const obj = OBJECT_BY_TYPE.get(type) ?? DatabaseObject;
				const curVal = await loadFromDatabase(obj, id);
				const dbObj = curVal.toDb();
				Object.assign(dbObj, getObjectFromChangeList(changes));
				const newVal = await loadFromDatabaseData(obj, id, dbObj);
				return {
					status: 200,
					body: JSON.stringify(newVal)
				};
			}
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

export type EditPutRequest = {
	type: string;
	id: string;
	data: Record<string, unknown>;
};
export const put: RequestHandler = async ({ request }) => {
	const { type, id, data } = (await request.json()) as EditPutRequest;
	const session = getSessionFromRequest(request);
	try {
		if (session && (await createObject(session, type, id, data))) {
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

export type EditDeleteRequest = {
	type: string;
	id: string;
};
export const del: RequestHandler = async ({ request }) => {
	const { type, id } = (await request.json()) as EditDeleteRequest;
	const session = getSessionFromRequest(request);
	try {
		if (session && (await deleteObject(session, type, id))) {
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
