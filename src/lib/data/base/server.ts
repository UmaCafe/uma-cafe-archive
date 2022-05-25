import type { EditorObject } from '$lib/permissions';
import { getObjectFromChangeList, type ChangeInstance } from '$lib/util';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import type {
	BaseObject,
	DatabaseObject,
	EditorInformation,
	KeyData,
	ObjectConstructor
} from './objects';

const loadingCache = new Map<string, Map<string, unknown>>();
const ID_LIST_KEY = '.id-list';

type LoadingSettings = {
	ignoreDynamic?: boolean;
	ignoreCache?: boolean;
};

export async function loadFromDatabase<T extends DatabaseObject>(
	type: ObjectConstructor<T>,
	id: string,
	settings?: LoadingSettings
): Promise<T> {
	const colId = type.prototype._collectionId as string;

	const cached = getCached<T>(colId, id);
	if (!settings?.ignoreCache && cached) {
		return cached;
	}

	const doc = getFirestore().collection(colId).doc(id);
	const snap = await doc.get();
	const obj = await loadFromDatabaseData(type, snap.id, snap.data(), settings);

	if (!settings?.ignoreCache && !settings?.ignoreDynamic) updateCache(colId, id, obj);

	return obj;
}

export async function loadFromDatabaseData<T extends DatabaseObject>(
	type: ObjectConstructor<T>,
	id: string,
	data: Record<string, unknown> | undefined,
	settings?: LoadingSettings
): Promise<T> {
	const obj = new type(id);
	if (data) {
		for (const [objKey, keyData] of obj._keyData.entries()) {
			if (keyData.dbKey && keyData.dbKey in data) {
				if (keyData.type == 'dynamic') {
					if (!settings?.ignoreDynamic && keyData.fromString)
						obj[objKey] = (await keyData.fromString(data[keyData.dbKey] as string)) as T[keyof T];
				} else {
					obj[objKey] = data[keyData.dbKey] as T[keyof T];
				}
			}
		}
		obj._loaded = true;
	}
	return obj;
}

export async function compileEditorInformation<T extends DatabaseObject>(
	obj: T
): Promise<EditorInformation<T>[]> {
	const info: EditorInformation<T>[] = [];
	const dbData = obj.toDb();

	for (const [key, keyData] of obj._keyData.entries()) {
		info.push({
			objKey: key as keyof BaseObject<T>,
			dbVal: dbData[keyData.dbKey],
			keyData: keyData as BaseObject<KeyData<T[typeof key]>>,
			choices: keyData.loadChoices ? await keyData.loadChoices(obj) : undefined
		});
	}

	return info;
}

export async function loadIdListFromDatabase<T extends DatabaseObject>(
	type: ObjectConstructor<T>,
	settings?: LoadingSettings
): Promise<string[]> {
	const colId = type.prototype._collectionId as string;
	const cached = getCached<string[]>(colId, ID_LIST_KEY);
	if (!settings?.ignoreCache && cached) return cached;
	const docList = await getFirestore().collection(colId).listDocuments();
	const ids = docList.map((doc) => doc.id);
	if (!settings?.ignoreCache) updateCache(colId, ID_LIST_KEY, ids);
	return ids;
}

export async function loadAllFromDatabase<T extends DatabaseObject>(
	type: ObjectConstructor<T>,
	settings?: LoadingSettings,
	query?: (col: FirebaseFirestore.CollectionReference) => FirebaseFirestore.Query
): Promise<T[]> {
	if (query) {
		const colId = type.prototype._collectionId as string;
		const result = await query(getFirestore().collection(colId)).get();
		return Promise.all(
			result.docs.map((doc) => loadFromDatabaseData(type, doc.id, doc.data(), settings))
		);
	} else {
		const list = await loadIdListFromDatabase(type);
		return Promise.all(list.map((id) => loadFromDatabase(type, id, settings)));
	}
}

export async function saveToDatabase<T extends DatabaseObject>(obj: T): Promise<boolean> {
	const colId = obj._collectionId;
	const doc = getFirestore().collection(colId).doc(obj.id);
	const data = obj.toDb();
	try {
		await doc.set(data);
		if (!obj._loaded) clearCache(colId, ID_LIST_KEY);
		clearCache(colId, obj.id);
		return true;
	} catch (err) {
		console.warn('error saving object to db:', err);
	}
	return false;
}

export async function updateDatabaseObject<T extends DatabaseObject>(
	editor: EditorObject,
	obj: T,
	changes: ChangeInstance[]
): Promise<boolean> {
	const colId = obj._collectionId;
	const doc = getFirestore().collection(colId).doc(obj.id);
	const changeCol = doc.collection('changes');
	const data = getObjectFromChangeList(changes);
	try {
		await changeCol.add({
			madeBy: editor.name,
			at: FieldValue.serverTimestamp(),
			changes: changes
		});
		await doc.update(data);
		clearCache(colId, obj.id); // TODO add global cache clearing
		return true;
	} catch (err) {
		console.warn('error updating object in db:', err);
	}

	return false;
}

export async function deleteFromDatabase<T extends DatabaseObject>(obj: T): Promise<boolean> {
	const colId = obj._collectionId;
	const doc = getFirestore().collection(colId).doc(obj.id);
	try {
		getFirestore().recursiveDelete(doc);
		clearCache(colId, ID_LIST_KEY);
		clearCache(colId, obj.id);
		return true;
	} catch (err) {
		console.warn('error deleting object from db:', err);
	}
	return false;
}

function getCached<T>(colId: string, id: string): T | undefined {
	if (!loadingCache.has(colId)) loadingCache.set(colId, new Map());
	if (loadingCache.get(colId)?.has(id)) {
		return loadingCache.get(colId)?.get(id) as T;
	}
}

function updateCache<T>(colId: string, id: string, object: T) {
	loadingCache.get(colId)?.set(id, object);
}

export function clearCache(colId?: string, entryId?: string): void {
	if (colId) {
		if (entryId) {
			loadingCache.get(colId)?.delete(entryId);
		} else {
			loadingCache.delete(colId);
		}
	} else {
		loadingCache.clear();
	}
}
