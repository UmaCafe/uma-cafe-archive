import type { EditorObject } from '$lib/types/editors';
import { CollectionReference, getFirestore } from 'firebase-admin/firestore';
import type { CharacterObject } from '../../types/character';
import type { RaceObject } from '../../types/race';

export async function getCollection<T>(collectionId: string): Promise<CollectionReference<T>> {
	const firestore = getFirestore();
	return firestore.collection(collectionId).withConverter<T>({
		toFirestore: (data: T) => data,
		fromFirestore: (snap) => snap.data() as T
	});
}

export async function characterDb(): Promise<CollectionReference<CharacterObject>> {
	return getCollection<CharacterObject>('characters');
}
export async function raceDb(): Promise<CollectionReference<RaceObject>> {
	return getCollection<RaceObject>('races');
}
export type Page = { md: string };
export async function pageDb(): Promise<CollectionReference<Page>> {
	return getCollection<Page>('pages');
}
export async function editorsDb(): Promise<CollectionReference<EditorObject>> {
	return getCollection<EditorObject>('editors');
}
