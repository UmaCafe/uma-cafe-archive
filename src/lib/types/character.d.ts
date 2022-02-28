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
	birthday?: CharacterBirthday;
	sizes?: CharacterSizes;
	weight?: string;
	class?: string;
	dorm?: string;
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
