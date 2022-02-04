import type { CharacterObject } from './types/character';

export const CHARACTER_EXAMPLE: CharacterObject = {
	info: {
		name: {
			native: 'ネイム',
			translated: 'Name'
		},
		gameId: 1001,
		colors: {
			main: 'ffffff',
			sub: 'eeeeee'
		},
		bio: {
			about:
				'General information, some taken from the initial twitter intro thread. Could also be taken from the official website bio.',
			birthday: {
				year: 1990,
				month: 1,
				day: 1
			},
			sizes: {
				height: 160,
				bust: 80,
				waist: 80,
				hips: 80,
				shoes: 'From game bio'
			},
			weight: 'Weight section from game bio or website',
			class: 'Middle / Upper',
			dorm: 'Miho / Ritto',
			intro: 'Intro quote from the game bio',
			onEars: 'Ears quote from the game bio',
			onFamily: 'Family quote from the game bio',
			onTail: 'Tail quote from the game bio',
			secret: 'Secret from the game load screen',
			strength: 'Strength section from game bio',
			weakness: 'Weakness section from game bio'
		},
		voice: {
			nativeName: '藤井ゆきよ',
			romanizedName: 'Yukiyo Fujii',
			voiceSample: 'characters/[folder]/voice.mp3',
			anilistUrl: 'https://anilist.co/staff/106162/Yukiyo-Fujii',
			malUrl: 'https://myanimelist.net/people/11162/Yukiyo_Fujii',
			wikipediaUrlEN: 'https://en.wikipedia.org/wiki/Yukiyo_Fujii',
			wikipediaUrlJP: 'https://ja.wikipedia.org/wiki/%E8%97%A4%E4%BA%95%E3%82%86%E3%81%8D%E3%82%88'
		},
		counterpart: {
			sex: 'male',
			record: {
				total: 10,
				wins: 2
			},
			notableRaces: [{ name: 'Race Name', place: 1, year: 1990 }],
			netkeibaUrl: 'https://db.netkeiba.com/horse/000a01029a/',
			wikipediaUrlEN: 'https://en.wikipedia.org/wiki/Tokino_Minoru',
			wikipediaUrlJP:
				'https://ja.wikipedia.org/wiki/%E3%83%88%E3%82%AD%E3%83%8E%E3%83%9F%E3%83%8E%E3%83%AB'
		}
	},
	images: {
		icon: 'characters/[folder]/icon.png',
		thumb: 'characters/[folder]/thumb.png',
		counterpart: 'characters/[folder]/counterpart.jpg',
		proto: 'characters/[folder]/proto_raw.png',
		seifuku: 'characters/[folder]/seifuku_raw.png',
		shoubufuku: 'characters/[folder]/shoubufuku_raw.png',
		stage: 'characters/[folder]/stage_raw.png'
	},
	visible: false
};
