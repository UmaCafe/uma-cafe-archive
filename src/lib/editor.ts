import { FieldValue } from '@google-cloud/firestore';
import { editorsDb, getCollection } from './db/firestore';
import type { EditorObject } from './types/editors';
import type { ChangeInstance } from './util';

/*
 * Note that this editor login system is likely temporary - I just need an easy way to get started.
 * Ideally would move to a provider like Firebase to handle auth and anonymized accounts, as well as a permission system.
 */

/**
 * Get an editor based off a user-entered or known key.
 * @returns the editor object if the key is valid, null otherwise
 */
export async function getEditorFromKey(key: string): Promise<EditorObject | null> {
	const editors = await editorsDb();
	const obj = await editors.where('key', '==', key).get();
	if (obj.empty) return null;
	const doc = obj.docs[0];
	if (!doc.exists) return null;
	return doc.data();
}

export async function makeEdit(
	key: string,
	collection: string,
	doc: string,
	changes: ChangeInstance[]
): Promise<void> {
	const editor = await getEditorFromKey(key);
	if (editor) {
		const docRef = (await getCollection(collection)).doc(doc);
		const data = {};
		for (const change of changes) {
			data[change.key] = change.after;
		}
		await docRef.update(data);
		await docRef.collection('changes').add({
			madeBy: editor.name,
			withKey: editor.key,
			at: FieldValue.serverTimestamp(),
			changes: changes
		});
	}
}

export async function createBasic(
	key: string,
	collection: string,
	doc: string,
	data: unknown
): Promise<void> {
	const editor = await getEditorFromKey(key);
	if (editor) {
		const docRef = (await getCollection(collection)).doc(doc);
		await docRef.create(data);
	}
}
