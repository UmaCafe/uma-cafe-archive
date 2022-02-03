export type CharacterObject = {
	info: {
		name: CharacterName;
		gameId?: number;
		bio?: CharacterBio;
		voice?: CharacterVoice;
		counterpart?: CharacterCounterpart;
		colors?: CharacterColors;
	};
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
	birthday?: CharacterBirthday;
	sizes?: CharacterSizes;
	weight?: string;
	class?: string;
	dorm?: string;
	strength?: string;
	weakness?: string;
	secret?: string;
	onEars?: string;
	onTail?: string;
	onFamily?: string;
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
	shoes?: string;
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
	thumb: string;
	shoubufuku?: string;
	seifuku?: string;
	proto?: string;
	icon: string;
	counterpart?: string;
};
