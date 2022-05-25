import { DatabaseObject, OBJECT_BY_TYPE } from '$lib/data/base/objects';
import { deleteFromDatabase, saveToDatabase, updateDatabaseObject } from '$lib/data/base/server';
import type { EditorObject } from '$lib/permissions';
import { hasPermission } from '$lib/permissions';
import type { ChangeInstance } from '$lib/util';
import * as cookie from 'cookie';
import { getFirestore } from 'firebase-admin/firestore';
import { getUserIdFromSession } from './firebase-auth';
import { listObjects } from './s3';

export async function authEditorWithRequest(request: Request): Promise<EditorObject | undefined> {
	const session = getSessionFromRequest(request);
	if (session) return authEditorWithSession(session);
}

export function getSessionFromRequest(request: Request): string | undefined {
	if (request.headers.has('cookie')) {
		const cookies = cookie.parse(request.headers.get('cookie') ?? '');

		if (cookies['session']) {
			return cookies['session'];
		}
	}
}

export async function authEditorWithSession(session: string): Promise<EditorObject | undefined> {
	if (!session) return;
	const uid = await getUserIdFromSession(session);
	if (uid) return await getEditorFromUid(uid);
}

export async function getEditorFromUid(uid: string): Promise<EditorObject | undefined> {
	const editors = getFirestore().collection('editors');
	const obj = await editors.where('uid', '==', uid).get();
	if (obj.empty) return;
	const doc = obj.docs[0];
	if (!doc.exists) return;
	return doc.data() as EditorObject;
}

export async function editObject(
	session: string,
	type: string,
	id: string,
	changes: ChangeInstance[]
): Promise<boolean> {
	const editor = await authEditorWithSession(session);
	if (editor && hasPermission(editor, 'editor.edit.' + type)) {
		const obj = OBJECT_BY_TYPE.get(type) ?? DatabaseObject;
		return updateDatabaseObject(editor, new obj(id), changes);
	}
	return false;
}

export async function createObject(
	session: string,
	type: string,
	id: string,
	data: Record<string, unknown>
): Promise<boolean> {
	const editor = await authEditorWithSession(session);
	if (hasPermission(editor, 'editor.create.' + type)) {
		const obj = OBJECT_BY_TYPE.get(type) ?? DatabaseObject;
		const val = new obj(id);
		Object.assign(val, data);
		return await saveToDatabase(val);
	}
	return false;
}

export async function deleteObject(session: string, type: string, id: string): Promise<boolean> {
	const editor = await authEditorWithSession(session);
	if (hasPermission(editor, 'editor.delete.' + type)) {
		const obj = OBJECT_BY_TYPE.get(type) ?? DatabaseObject;
		return await deleteFromDatabase(new obj(id));
	}
	return false;
}

export type ListedContentObject = { name: string };
export async function listContentObjects(folder: string): Promise<ListedContentObject[]> {
	const objects = await listObjects(folder);
	return objects
		.filter((obj) => {
			if (!obj || !obj.Key) return false;
			const path = obj.Key.split('/');
			return path[path.length - 1] != '.bzEmpty'; // ignore folder keep files
		})
		.map((obj) => {
			return { name: obj.Key } as ListedContentObject;
		});
}
