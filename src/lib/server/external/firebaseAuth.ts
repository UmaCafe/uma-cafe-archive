import { getAuth } from 'firebase-admin/auth';

export async function generateSessionCookie(idToken: string): Promise<string | null> {
	try {
		return await getAuth().createSessionCookie(idToken, { expiresIn: 1000 * 60 * 60 * 24 * 5 });
	} catch (_) {
		return null;
	}
}

export async function getUserIdFromSession(session: string): Promise<string | null> {
	if (!session) return null;
	try {
		const decoded = await getAuth().verifySessionCookie(session, true);
		return decoded.uid;
	} catch (_) {
		return null;
	}
}
