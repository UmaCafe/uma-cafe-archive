import { authEditorWithRequest } from '$lib/server/editor';
import type { RequestHandler } from '@sveltejs/kit';
import { getAuth } from 'firebase-admin/auth';

export const get: RequestHandler = async ({ request }) => {
	const editor = await authEditorWithRequest(request);
	if (editor) {
		const auth = getAuth();
		const user = await auth.getUser(editor.uid);
		const link = await auth.generatePasswordResetLink(user.email);
		return {
			status: 302,
			headers: {
				Location: link
			}
		};
	}

	return {
		status: 302,
		headers: {
			Location: '/'
		}
	};
};
