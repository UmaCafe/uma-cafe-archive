import type { Fetch } from '$lib/types/fetch';
import type { RaceObject } from '$lib/types/race';
import { get, writable } from 'svelte/store';

export const RACE_DATA = writable(new Map<string, RaceObject>());

export async function getAllRaces(fetch: Fetch): Promise<Map<string, RaceObject>> {
	const resp = await fetch(`/api/race?all=true`);
	if (resp.status == 200) {
		const data = await resp.json();
		const map = new Map(data) as Map<string, RaceObject>;
		RACE_DATA.set(map);
		return map;
	}
	return new Map();
}

export async function getRaceInfo(fetch: Fetch, raceId: string): Promise<RaceObject | null> {
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
	return null;
}
