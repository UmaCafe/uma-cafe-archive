import { pageDb } from '$lib/server/external/firestore';
import { docIdToPagePath, pagePathToDocId } from '$lib/util';

export async function listPagePaths(): Promise<string[]> {
	const pages = await pageDb();
	const docs = await pages.listDocuments();
	return docs.map((doc) => {
		const docId = doc.id;
		return docIdToPagePath(docId);
	});
}

export async function getPageMarkdown(pagePath: string): Promise<string | null> {
	const pages = await pageDb();
	if (pagePath == 'index') return null;
	const docId = pagePathToDocId(pagePath);
	const pageData = await pages.doc(docId).get();
	if (pageData.exists) {
		const pageObj = pageData.data();
		return pageObj.md.replace(/\\n/g, '\n');
	}
	return null;
}
