import type { Fetch } from '$lib/types/fetch';

export async function listPagePaths(fetch: Fetch): Promise<string[]> {
	const resp = await fetch(`/api/content?all=true`);
	if (resp.status == 200) {
		return resp.json();
	}
	return [];
}

export async function getPageMarkdown(fetch: Fetch, pagePath: string): Promise<string | null> {
	const resp = await fetch(`/api/content?page=${pagePath}`);
	if (resp.status == 200) {
		return await resp.text();
	}
	return null;
}
