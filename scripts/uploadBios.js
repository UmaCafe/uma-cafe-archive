import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import bios from './bio_dump.json';

initializeApp({
	credential: cert('gcloud_credentials.json')
});

const firestore = getFirestore();
firestore.settings({ ignoreUndefinedProperties: true });

function shoeSize(bio) {
	if (!bio.shoe) return;
	if (bio.shoe.includes('左右')) {
		let b = parseFloat(bio.shoe.replace(/[\D^\\.]/g, ''));
		if (b > 100) b /= 10;
		return [b, b];
	}
	const ex = /(\d+\.\d)\D\D+(\d+\.\d?)/g.exec(bio.shoe);
	let [l, r] = [parseFloat(ex[1]), parseFloat(ex[2])];
	if (l > 100) l /= 10;
	if (r > 100) r /= 10;
	return [l, r];
}

function birthday(bio) {
	if (!bio.birthday) return;
	const ex = /(\d+)\D+(\d+)/g.exec(bio.birthday);
	return [parseInt(ex[1]), parseInt(ex[2])];
}

// im lazy
function strip(obj) {
	for (const [k, v] of Object.entries(obj)) {
		if (v == null) continue;
		if (Array.isArray(v)) {
			obj[k] = v.map((a) => {
				if (typeof a == 'object') {
					return strip(a);
				} else if (typeof a == 'string') {
					return a.replace(/\\n/g, '');
				}
			});
		} else if (typeof v == 'object') {
			obj[k] = strip(v);
		} else if (typeof v == 'string') {
			obj[k] = v.replace(/\\n/g, '');
		}
	}
}

for (const bio of bios) {
	if (bio.id > 9000) continue;

	strip(bio);

	const shoes = shoeSize(bio);
	const bday = birthday(bio);
	const height = bio.height ? parseInt(bio.height.replace(/\D/g, '')) : undefined;

	const dbId = bio['name-en'].toLowerCase().replace(/\s/g, '-').replace(/\./g, '');
	const doc = await firestore.collection('dev-characters').doc(dbId).get();
	const data = doc.data();

	if (doc.exists) {
		const updateVal = {
			gameId: bio.id,
			'birthday.month': bday?.[0],
			'birthday.day': bday?.[1],
			'class.jp': bio.class ?? undefined,
			'commentEars.jp': bio.ears ?? undefined,
			'commentFamily.jp': bio.family ?? undefined,
			'commentTail.jp': bio.tail ?? undefined,
			'dorm.jp': bio.dorm ?? undefined,
			height: height,
			'introduction.jp': bio.intro ?? undefined,
			'name.jp': bio.name ?? undefined,
			'name.en': bio['name-en'] ?? undefined,
			'nickname.jp': bio.nickname ?? undefined,
			'preferredDistance.jp': bio.dist ?? undefined,
			'preferredGround.jp': bio.ground ?? undefined,
			'preferredStrategy.jp': bio.strat ?? undefined,
			secrets: bio.secret?.map((s, i) => ({ jp: s, en: data.secrets?.[i]?.en ?? undefined })),
			'seiyuuName.jp': bio.seiyuu ?? undefined,
			shoeSize: bio.shoe ? { left: shoes[0], right: shoes[1] } : undefined,
			'strengths.jp': bio.strength ?? undefined,
			'tagline.jp': bio.quote ?? undefined,
			'weaknesses.jp': bio.weakness ?? undefined,
			'weight.jp': bio.weight ?? undefined
		};
		doc.ref.update(updateVal);
	} else {
		const newVal = {
			gameId: bio.id
		};
		if (bio.birthday) newVal.birthday = { month: bday[0], day: bday[1] };
		if (bio.class) newVal.class = { jp: bio.class };
		if (bio.ears) newVal.commentEars = { jp: bio.ears };
		if (bio.family) newVal.commentFamily = { jp: bio.family };
		if (bio.tail) newVal.commentTail = { jp: bio.tail };
		if (bio.dorm) newVal.dorm = { jp: bio.dorm };
		if (bio.height) newVal.height = height;
		if (bio.intro) newVal.introduction = { jp: bio.intro };
		if (bio.name || bio['name-en'])
			newVal.name = { jp: bio.name ?? undefined, en: bio['name-en'] ?? undefined };
		if (bio.nickname) newVal.nickname = { jp: bio.nickname };
		if (bio.dist) newVal.preferredDistance = { jp: bio.dist };
		if (bio.ground) newVal.preferredGround = { jp: bio.ground };
		if (bio.strat) newVal.preferredStrategy = { jp: bio.strat };
		if (bio.secret) newVal.secrets = bio.secret.map((v) => ({ jp: v }));
		if (bio.seiyuu) newVal.seiyuuName = { jp: bio.seiyuu };
		if (bio.shoe) newVal.shoeSize = { left: shoes[0], right: shoes[1] };
		if (bio.strength) newVal.strengths = { jp: bio.strength };
		if (bio.quote) newVal.tagline = { jp: bio.quote };
		if (bio.weakness) newVal.weaknesses = { jp: bio.weakness };
		if (bio.weight) newVal.weight = { jp: bio.weight };
		doc.ref.set(newVal);
	}
}
