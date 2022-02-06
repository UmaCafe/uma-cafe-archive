import { raceDb } from '$lib/server/external/firestore';
import type { RaceObject } from '$lib/types/race';

/**
 * @returns Race info objects for all races keyed to their ID
 */
export async function getAllRaces(): Promise<Map<string, RaceObject>> {
	const races = await raceDb();
	const docList = await races.listDocuments();
	const dataList = docList.map(async (docRef) => {
		const data = await docRef.get();
		return [data.id, data.data()] as [string, RaceObject];
	});
	return new Map(await Promise.all(dataList));
}

/**
 * @param raceId The reference ID of the race
 * @returns Race info object for the race, or null if it doesn't exist
 */
export async function getRaceInfo(raceId: string): Promise<RaceObject | null> {
	const races = await raceDb();
	const raceDoc = await races.doc(raceId).get();
	if (raceDoc.exists) {
		const raceObj = raceDoc.data();
		return raceObj;
	}
	return null;
}
