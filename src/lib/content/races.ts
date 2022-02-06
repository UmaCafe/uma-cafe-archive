import { browser } from '$app/env';
import { raceDb } from '$lib/external/firestore';
import type { RaceObject } from '$lib/types/race';
import { get, writable } from 'svelte/store';

export const RACE_DATA = writable(new Map<string, RaceObject>());

/**
 * @returns Race info objects for all races keyed to their ID
 */
export async function getAllRaces(): Promise<Map<string, RaceObject>> {
	if (!browser) {
		const races = await raceDb();
		const docList = await races.listDocuments();
		const dataList = docList.map(async (docRef) => {
			const data = await docRef.get();
			return [data.id, data.data()] as [string, RaceObject];
		});
		return new Map(await Promise.all(dataList));
	} else {
		const resp = await fetch(`/api/race?all=true`);
		if (resp.status == 200) {
			const data = await resp.json();
			const map = new Map(data) as Map<string, RaceObject>;
			RACE_DATA.set(map);
			return map;
		}
	}
	return new Map();
}

/**
 * @param raceId The reference ID of the race
 * @returns Race info object for the race, or null if it doesn't exist
 */
export async function getRaceInfo(raceId: string): Promise<RaceObject | null> {
	if (!browser) {
		const races = await raceDb();
		const raceDoc = await races.doc(raceId).get();
		if (raceDoc.exists) {
			const raceObj = raceDoc.data();
			return raceObj;
		}
	} else {
		const raceData = get(RACE_DATA);
		if (raceData.has(raceId)) {
			return raceData.get(raceId);
		} else {
			const resp = await fetch(`/api/race?id=${raceId}`);
			if (resp.status == 200) {
				const data = (await resp.json()) as RaceObject;
				RACE_DATA.update((val) => {
					val.set(raceId, data);
					return val;
				});
				return data;
			}
		}
	}
	return null;
}
