import type { Fetch } from '$lib/types/fetch';

export async function listContentObjects(
	fetch: Fetch,
	folder: string
): Promise<{ name: string }[]> {
	const resp = await fetch(`/api/files`, {
		method: 'POST',
		body: JSON.stringify({
			folder
		})
	});
	if (resp.status == 200) {
		return await resp.json();
	}
}
