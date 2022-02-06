import type { Fetch } from '$lib/types/fetch';

export async function listContentObjects(
	fetch: Fetch,
	key: string,
	folder: string
): Promise<{ name: string }[]> {
	const resp = await fetch(`/api/files`, {
		method: 'POST',
		body: JSON.stringify({
			editorKey: key,
			folder
		})
	});
	if (resp.status == 200) {
		return await resp.json();
	}
}
