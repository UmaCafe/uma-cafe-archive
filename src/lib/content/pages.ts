import { browser } from '$app/env';
import { pageDb } from '$lib/external/firestore';

export function pagePathToDocId(pagePath: string): string {
	if (pagePath.length == 0) return 'index';
	return pagePath.replace(/\./g, '').replace(/\//g, '.');
}

export function docIdToPagePath(docId: string): string {
	if (docId == 'index') return '';
	return docId.replace(/\./g, '/');
}

export async function listPagePaths(): Promise<string[]> {
	if (!browser) {
		const pages = await pageDb();
		const docs = await pages.listDocuments();
		return docs.map((doc) => {
			const docId = doc.id;
			return docIdToPagePath(docId);
		});
	} else {
		const resp = await fetch(`/api/content?all=true`);
		if (resp.status == 200) {
			return resp.json();
		}
	}
	return [];
}

export async function getPageMarkdown(pagePath: string): Promise<string | null> {
	if (!browser) {
		const pages = await pageDb();
		if (pagePath == 'index') return null;
		const docId = pagePathToDocId(pagePath);
		const pageData = await pages.doc(docId).get();
		if (pageData.exists) {
			const pageObj = pageData.data();
			return pageObj.md.replace(/\\n/g, '\n');
		}
	} else {
		const resp = await fetch(`/api/content?page=${pagePath}`);
		if (resp.status == 200) {
			return await resp.text();
		}
	}
	return null;
}
