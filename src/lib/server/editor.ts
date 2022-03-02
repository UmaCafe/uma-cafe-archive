import type { EditorObject } from '$lib/types/editors';
import type { ChangeInstance } from '$lib/util';
import * as cookie from 'cookie';
import { FieldValue } from 'firebase-admin/firestore';
import { hasPermission } from '../editor/permissions';
import { getUserIdFromSession } from './external/firebaseAuth';
import { editorsDb, getCollection } from './external/firestore';
import { listObjects } from './external/s3';

export async function authEditorWithRequest(request: Request): Promise<EditorObject | null> {
	const session = getSessionFromRequest(request);
	if (session) return authEditorWithSession(session);
	return null;
}

export function getSessionFromRequest(request: Request): string | null {
	if (request.headers.has('cookie')) {
		const cookies = cookie.parse(request.headers.get('cookie'));

		if (cookies['session']) {
			return cookies['session'];
		}
	}
	return null;
}

export async function authEditorWithSession(session: string): Promise<EditorObject | null> {
	if (!session) return null;
	const uid = await getUserIdFromSession(session);
	if (uid) return await getEditorFromUid(uid);
}

export async function getEditorFromUid(uid: string): Promise<EditorObject | null> {
	const editors = await editorsDb();
	const obj = await editors.where('uid', '==', uid).get();
	if (obj.empty) return null;
	const doc = obj.docs[0];
	if (!doc.exists) return null;
	return doc.data();
}

export async function makeEdit(
	session: string,
	collection: string,
	doc: string,
	changes: ChangeInstance[]
): Promise<boolean> {
	const editor = await authEditorWithSession(session);
	if (hasPermission(editor, 'editor.edit.' + collection)) {
		const docRef = (await getCollection(collection)).doc(doc);
		const data = {};
		for (const change of changes) {
			data[change.key] = change.after;
		}
		await docRef.update(data);
		await docRef.collection('changes').add({
			madeBy: editor.name,
			at: FieldValue.serverTimestamp(),
			changes: changes
		});
		return true;
	}
	return false;
}

export async function createBasic(
	session: string,
	collection: string,
	doc: string,
	data: unknown
): Promise<boolean> {
	const editor = await authEditorWithSession(session);
	if (hasPermission(editor, 'editor.create.' + collection)) {
		const docRef = (await getCollection(collection)).doc(doc);
		await docRef.create(data);
		return true;
	}
	return false;
}

export async function deleteBasic(
	session: string,
	collection: string,
	doc: string
): Promise<boolean> {
	const editor = await authEditorWithSession(session);
	if (hasPermission(editor, 'editor.delete.' + collection)) {
		const docRef = (await getCollection(collection)).doc(doc);
		await docRef.firestore.recursiveDelete(docRef);
		return true;
	}
	return false;
}

export async function listContentObjects(folder: string): Promise<{ name: string }[]> {
	const objects = await listObjects(folder);
	return objects
		.filter((obj) => {
			const path = obj.Key.split('/');
			return path[path.length - 1] != '.bzEmpty'; // ignore folder keep files
		})
		.map((obj) => {
			return { name: obj.Key };
		});
}
