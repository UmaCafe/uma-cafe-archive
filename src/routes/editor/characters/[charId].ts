import { compileEditorInformation, loadFromDatabase } from '$lib/data/base/server';
import { Character } from '$lib/data/character';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ params }) => {
	const charId = params.charId;
	const char = await loadFromDatabase(Character, charId);
	const info = await compileEditorInformation(char);
	if (char._loaded) {
		return {
			status: 200,
			body: {
				id: char.id,
				type: char._type,
				infoJson: JSON.stringify(info)
			}
		};
	}

	return {
		status: 404
	};
};
