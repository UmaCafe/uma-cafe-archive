import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp({
	credential: cert('gcloud_credentials.json')
});

const types = ['characters', 'pages'];

const firestore = getFirestore();

async function copy(fromId, toId) {
	const from = firestore.collection(fromId);
	const to = firestore.collection(toId);
	firestore.recursiveDelete(to);
	for (const ref of await from.listDocuments()) {
		const doc = await ref.get();
		to.doc(doc.id).set(doc.data());

		for (const colRef of await from.doc(doc.id).listCollections()) {
			for (const colDocRef of await colRef.listDocuments()) {
				to.doc(doc.id)
					.collection(colRef.id)
					.doc(colDocRef.id)
					.set((await colDocRef.get()).data());
			}
		}
	}
}

for (const [dev, prod] of types.map((v) => ['dev-' + v, 'prod-' + v])) {
	copy(prod, dev);
}
