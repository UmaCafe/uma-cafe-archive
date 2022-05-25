import {
	AudioFile,
	Boolean,
	Collection,
	DatabaseObject,
	Desc,
	Enum,
	ImageFile,
	LinkedObject,
	MakeArray,
	Name,
	Number,
	Record,
	String,
	Translated,
	TranslateSuggest,
	type TranslatedString
} from './base/objects';

@Collection('characters')
export class Character extends DatabaseObject {
	@Name('Character Name')
	@Translated()
	name?: TranslatedString;

	@Name('Internal Game ID')
	@Number()
	gameId?: number;

	@Name('Asset ID')
	@Desc('From official website: /character/detail/?name=[ID]')
	@String()
	assetId?: string;

	@Record({ main: 'string', sub: 'string' })
	colors?: { main: string; sub: string };

	@Translated()
	introduction?: TranslatedString;

	@String()
	about?: string;

	@Translated()
	tagline?: TranslatedString;

	@Translated()
	nickname?: TranslatedString;

	@Name('Refers to Self as')
	@Translated()
	refersSelf?: TranslatedString;

	@Name('Refers to Trainer as')
	@Translated()
	refersTrainer?: TranslatedString;

	@Record({ year: 'number', month: 'number', day: 'number' })
	birthday?: {
		year?: number;
		month: number;
		day: number;
	};

	@Name('Height (cm)')
	@Number()
	height?: number;

	@Record({ bust: 'number', waist: 'number', hips: 'number' })
	threeSizes?: {
		bust: number;
		waist: number;
		hips: number;
	};

	@Record({ left: 'number', right: 'number' })
	shoeSize?: { left: number; right: number };

	@Name('Weight Description')
	@Translated()
	weight?: TranslatedString;

	@Name('Preferred Ground Type')
	@TranslateSuggest(
		{ jp: '芝', en: 'Turf' },
		{ jp: 'ダ', en: 'Dirt' },
		{ jp: 'ダ/芝', en: 'Turf/Dirt' }
	)
	preferredGround?: TranslatedString;

	@TranslateSuggest(
		{ jp: '短', en: 'Short' },
		{ jp: 'マ', en: 'Mile' },
		{ jp: '中', en: 'Mid' },
		{ jp: '長', en: 'Long' },
		{ jp: '短～中', en: 'Short-Mid' },
		{ jp: '中～長', en: 'Mid-Long' }
	)
	preferredDistance?: TranslatedString;

	@TranslateSuggest(
		{ jp: '逃げ', en: 'Escape' },
		{ jp: '先行', en: 'Leader' },
		{ jp: '差し', en: 'Betweener' },
		{ jp: '追込', en: 'Chaser' }
	)
	preferredStrategy?: TranslatedString;

	@Name('School Class')
	@TranslateSuggest({ jp: '高等部', en: 'High School' }, { jp: '中等部', en: 'Middle School' })
	class?: TranslatedString;

	@Name('School Dorm')
	@TranslateSuggest(
		{ jp: '栗東寮', en: 'Ritto' },
		{ jp: '美浦寮', en: 'Miho' },
		{ jp: '一人暮らし', en: 'Living Alone' }
	)
	dorm?: TranslatedString;

	@LinkedObject(Character, (ch) => ch.name?.en)
	roommate?: Character;

	@Translated()
	strengths?: TranslatedString;

	@Translated()
	weaknesses?: TranslatedString;

	@Name('Comment: Ears')
	@Translated()
	commentEars?: TranslatedString;

	@Name('Comment: Tail')
	@Translated()
	commentTail?: TranslatedString;

	@Name('Comment: Family')
	@Translated()
	commentFamily?: TranslatedString;

	@Translated()
	@MakeArray()
	secrets?: TranslatedString[];

	@String()
	@MakeArray()
	trivia?: string[];

	@Translated()
	seiyuuName?: TranslatedString;

	@Name('Seiyuu Anilist URL')
	@String()
	seiyuuAnilist?: string;

	@Name('Seiyuu MAL URL')
	@String()
	seiyuuMal?: string;

	@Name('Seiyuu JP Wikipedia URL')
	@String()
	seiyuuWikiJP?: string;

	@Name('Seiyuu EN Wikipedia URL')
	@String()
	seiyuuWikiEN?: string;

	@Name('Seiyuu Social Links')
	@Record({ name: 'string', url: 'string' })
	@MakeArray()
	seiyuuSocials?: {
		name: string;
		url: string;
	}[];

	@Name('Seiyuu Other Character Roles')
	@Record({ charName: 'string', mediaName: 'string' }, { charName: 'Character Name' })
	@MakeArray()
	seiyuuRoles?: {
		charName: string;
		mediaName: string;
	}[];

	@AudioFile('voice.mp3')
	voiceSample?: string;

	@Enum('Stallion', 'Mare')
	counterpartSex?: 'Stallion' | 'Mare';

	@Name('Counterpart # of Races')
	@Number()
	counterpartNumRaces?: number;

	@Name('Counterpart # of Wins')
	@Number()
	counterpartNumWins?: number;

	@Record({ name: 'string', placed: 'number', year: 'number' })
	@MakeArray()
	counterpartNotableRaces?: { name: string; placed: number; year: number }[];

	@Name('Counterpart Netkeiba URL')
	@String()
	counterpartNetkeiba?: string;

	@Name('Counterpart JP Wikipedia URL')
	@String()
	counterpartWikiJP?: string;

	@Name('Counterpart EN Wikipedia URL')
	@String()
	counterpartWikiEN?: string;

	@Name('Icon Image')
	@ImageFile('icon.png')
	imageIcon?: string;

	@Name('Thumbnail Image')
	@ImageFile('thumb.png')
	imageThumb?: string;

	@Name('Proto Shoubufuku Image')
	@ImageFile('proto_raw.png')
	imageProto?: string;

	@Name('Seifuku Image')
	@ImageFile('seifuku_raw.png')
	imageSeifuku?: string;

	@Name('Shoubufuku Image')
	@ImageFile('shoubufuku_raw.png')
	imageShoubufuku?: string;

	@Name('Stage Uniform Image')
	@ImageFile('stage_raw.png')
	imageStage?: string;

	@Name('Seiyuu Image')
	@ImageFile('seiyuu.jpg')
	imageSeiyuu?: string;

	@Name('Counterpart Image')
	@ImageFile('counterpart.jpg')
	imageCounterpart?: string;

	@Name('Make Visible')
	@Boolean()
	visible?: boolean;
}
