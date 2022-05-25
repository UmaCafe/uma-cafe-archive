import { loadAllFromDatabase, loadIdListFromDatabase } from '$lib/data/base/server';
import { Character } from '$lib/data/character';
import { Page } from '$lib/data/page';
import { listContentObjects } from '$lib/server/editor';
import { docIdToPagePath } from '$lib/util';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ params }) => {
	// Having no route parameters absolutely broke this page but ONLY when building.
	// I have no idea why this bug exists. But it does.
	if (params.index.length > 0) return { status: 404 };

	const chars = await loadAllFromDatabase(Character, { ignoreDynamic: true });
	const pagePaths = (await loadIdListFromDatabase(Page)).map((v) => docIdToPagePath(v));
	const imageObjects = await listContentObjects('images/');

	return {
		status: 200,
		body: {
			charListJson: chars.map((val) => JSON.stringify(val)),
			pagePaths,
			imageObjects
		}
	};
};
