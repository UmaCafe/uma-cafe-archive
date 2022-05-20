import type { EditorObject } from '$lib/types/editors';
import type { ChangeInstance } from '$lib/util';
import * as cookie from 'cookie';
import { FieldValue } from 'firebase-admin/firestore';
import { hasPermission } from '../editor/permissions';
import { getUserIdFromSession } from './external/firebaseAuth';
import { editorsDb, getCollection } from './external/firestore';
import { listObjects } from './external/s3';

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
	const editors = await editorsDb();
	const obj = await editors.where('uid', '==', uid).get();
	if (obj.empty) return;
	const doc = obj.docs[0];
	if (!doc.exists) return;
	return doc.data();
}

export async function makeEdit(
	session: string,
	collection: string,
	doc: string,
	changes: ChangeInstance[]
): Promise<boolean> {
	const editor = await authEditorWithSession(session);
	if (editor && hasPermission(editor, 'editor.edit.' + collection)) {
		const docRef = (await getCollection(collection)).doc(doc);
		const data: Record<string, unknown> = {};
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
