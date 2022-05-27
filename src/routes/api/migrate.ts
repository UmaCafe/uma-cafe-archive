import { saveToDatabase } from '$lib/data/base/server';
import { Character } from '$lib/data/character';
import { Page } from '$lib/data/page';
import type { RequestHandler } from '@sveltejs/kit';
import { getFirestore, QueryDocumentSnapshot } from 'firebase-admin/firestore';

const chars = false;
const pages = false;
const changes = false;
export const get: RequestHandler = async () => {
	if (chars) {
		const existingChars = await getAllCharacters(true);
		for (const [k, v] of existingChars.entries()) {
			const char = await migrate(k, v);
			saveToDatabase(char);
			if (changes) {
				for (const change of await getFirestore()
					.collection('characters')
					.doc(char.id)
					.collection('changes')
					.listDocuments()) {
					const changeData = (await change.get()).data();
					if (changeData) {
						getFirestore()
							.collection(char._collectionId)
							.doc(char.id)
							.collection('changes')
							.add({ ...changeData, legacy: true });
					}
				}
			}
		}
	}

	if (pages) {
		const existingPages = await getFirestore().collection('pages').listDocuments();
		for (const existing of existingPages) {
			const data = (await existing.get()).data();
			if (data) {
				const page = new Page(existing.id);
				page.md = data.md;
				saveToDatabase(page);

				if (changes) {
					for (const change of await getFirestore()
						.collection('pages')
						.doc(existing.id)
						.collection('changes')
						.listDocuments()) {
						const changeData = (await change.get()).data();
						if (changeData) {
							getFirestore()
								.collection(page._collectionId)
								.doc(page.id)
								.collection('changes')
								.add({ ...changeData, legacy: true });
						}
					}
				}
			}
		}
	}

	return {
		body: 'OK'
	};
};

function oops<T extends number | undefined>(x: T): T {
	if (typeof x == 'string') return parseFloat(x) as T;
	return x;
}

async function migrate(id: string, ex: CharacterObject): Promise<Character> {
	const ne = new Character(id);

	ne.name = { jp: ex.info.name.native, en: ex.info.name.translated };
	ne.gameId = oops(ex.info.gameId);
	ne.assetId = ex.assetId;

	if (ex.info.colors) ne.colors = { main: ex.info.colors.main, sub: ex.info.colors.sub };

	if (ex.info.bio) {
		const bio = ex.info.bio;
		ne.introduction = { en: bio.intro };
		ne.about = bio.about;
		ne.tagline = { en: bio.tagline };
		ne.nickname = { en: bio.nickname };
		ne.refersSelf = { jp: bio.refersSelfJP, en: bio.refersSelf };
		ne.refersTrainer = { jp: bio.refersTrainerJP, en: bio.refersTrainer };
		if (bio.birthday)
			ne.birthday = {
				year: oops(bio.birthday.year),
				month: oops(bio.birthday.month),
				day: oops(bio.birthday.day)
			};
		if (bio.sizes) {
			const sizes = bio.sizes;
			ne.height = oops(bio.sizes.height);
			ne.threeSizes = {
				bust: oops(sizes.bust) ?? 0,
				hips: oops(sizes.hips) ?? 0,
				waist: oops(sizes.waist) ?? 0
			};
			ne.shoeSize = { left: oops(sizes.shoesL) ?? 0, right: oops(sizes.shoesR) ?? 0 };
		}
		ne.weight = { en: bio.weight };
		ne.preferredGround = { en: bio.preferredGroundType };
		ne.preferredDistance = { en: bio.preferredDistance };
		ne.preferredStrategy = { en: bio.preferredStrategy };
		ne.class = { en: bio.class };
		ne.dorm = { en: bio.dorm };
		if (bio.roommate) ne.roommate = new Character(bio.roommate);
		ne.strengths = { en: bio.strength };
		ne.weaknesses = { en: bio.weakness };
		ne.commentEars = { en: bio.onEars };
		ne.commentTail = { en: bio.onTail };
		ne.commentFamily = { en: bio.onFamily };
		if (bio.secrets?.length ?? 0 > 0) ne.secrets = bio.secrets?.map((v) => ({ en: v }));
		if (bio.trivia?.length ?? 0 > 0) ne.trivia = bio.trivia;
	}

	if (ex.info.voice) {
		const voice = ex.info.voice;
		ne.seiyuuName = { jp: voice.nativeName, en: voice.romanizedName };
		ne.seiyuuAnilist = voice.anilistUrl;
		ne.seiyuuMal = voice.malUrl;
		ne.seiyuuWikiJP = voice.wikipediaUrlJP;
		ne.seiyuuWikiEN = voice.wikipediaUrlEN;
		ne.seiyuuSocials = voice.socialMedia;
		if (voice.otherRoles?.length ?? 0 > 0)
			ne.seiyuuRoles = voice.otherRoles?.map((v) => ({
				charName: v.characterName,
				mediaName: v.mediaName
			}));
		ne.voiceSample = voice.voiceSample;
	}

	if (ex.info.counterpart) {
		const counterpart = ex.info.counterpart;
		ne.counterpartSex =
			counterpart.sex == 'male' ? 'Stallion' : counterpart.sex == 'female' ? 'Mare' : undefined;
		ne.counterpartNetkeiba = counterpart.netkeibaUrl;
		ne.counterpartNumWins = oops(counterpart.record?.wins);
		ne.counterpartNumRaces = oops(counterpart.record?.total);
		if (counterpart.notableRaces?.length ?? 0 > 0)
			ne.counterpartNotableRaces = counterpart.notableRaces?.map((v) => ({
				name: v.name,
				placed: oops(v.place),
				year: oops(v.year)
			}));
		ne.counterpartWikiJP = counterpart.wikipediaUrlJP;
		ne.counterpartWikiEN = counterpart.wikipediaUrlEN;
	}

	ne.imageIcon = ex.images.icon;
	ne.imageThumb = ex.images.thumb;
	ne.imageCounterpart = ex.images.counterpart;
	ne.imageProto = ex.images.proto;
	ne.imageSeifuku = ex.images.seifuku;
	ne.imageShoubufuku = ex.images.shoubufuku;
	ne.imageStage = ex.images.stage;

	ne.visible = ex.visible;

	return ne;
}

export async function getAllCharacters(
	allowInvisible = false
): Promise<Map<string, CharacterObject>> {
	const chars = getFirestore().collection('characters');
	let docList: QueryDocumentSnapshot[];
	if (allowInvisible) {
		docList = (await chars.get()).docs;
	} else {
		docList = (await chars.where('visible', '==', true).get()).docs;
	}
	const dataList = docList.map(async (doc) => {
		return [doc.id, doc.data()] as [string, CharacterObject];
	});
	return new Map(await Promise.all(dataList));
}

export type CharacterObject = {
	info: {
		name: CharacterName;
		gameId?: number;
		bio?: CharacterBio;
		voice?: CharacterVoice;
		counterpart?: CharacterCounterpart;
		colors?: CharacterColors;
	};
	assetId: string;
	images: CharacterImages;
	visible?: boolean;
};

export type CharacterName = {
	native: string;
	translated: string;
};

export type CharacterBio = {
	intro?: string;
	about?: string;
	tagline?: string;
	nickname?: string;
	refersSelf?: string;
	refersSelfJP?: string;
	refersTrainer?: string;
	refersTrainerJP?: string;
	birthday?: CharacterBirthday;
	sizes?: CharacterSizes;
	weight?: string;
	preferredGroundType: string;
	preferredDistance: string;
	preferredStrategy: string;
	class?: string;
	dorm?: string;
	roommate?: string;
	strength?: string;
	weakness?: string;
	onEars?: string;
	onTail?: string;
	onFamily?: string;
	secrets?: string[];
	trivia?: string[];
};

export type CharacterBirthday = {
	year?: number;
	month: number;
	day: number;
};

export type CharacterSizes = {
	height?: number;
	bust?: number;
	waist?: number;
	hips?: number;
	shoesL?: number;
	shoesR?: number;
};

export type CharacterVoice = {
	voiceSample?: string;
	nativeName: string;
	romanizedName: string;
	wikipediaUrlJP?: string;
	wikipediaUrlEN?: string;
	anilistUrl?: string;
	malUrl?: string;
	socialMedia?: SeiyuuSocialMedia[];
	otherRoles?: SeiyuuOtherRoles[];
};

export type SeiyuuSocialMedia = {
	name: string;
	url: string;
};

export type SeiyuuOtherRoles = {
	characterName: string;
	mediaName: string;
};

export type CharacterCounterpart = {
	sex?: 'male' | 'female';
	record?: CharacterCounterpartRecord;
	notableRaces?: CharacterCounterpartRace[];
	wikipediaUrlJP?: string;
	wikipediaUrlEN?: string;
	netkeibaUrl?: string;
};

export type CharacterCounterpartRecord = {
	total: number;
	wins: number;
};

export type CharacterCounterpartRace = {
	name: string;
	year: number;
	place: number;
};

export type CharacterColors = {
	main: string;
	sub: string;
};

export type CharacterImages = {
	icon: string;
	thumb: string;
	shoubufuku?: string;
	seifuku?: string;
	proto?: string;
	stage?: string;
	counterpart?: string;
};
