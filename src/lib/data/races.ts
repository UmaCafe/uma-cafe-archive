import {
	Boolean,
	Collection,
	DatabaseObject,
	Desc,
	Enum,
	ImageFile,
	MakeArray,
	Number,
	Record,
	String,
	Translated,
	type TranslatedString
} from './base/objects';

@Collection('races')
export class Race extends DatabaseObject {
	@Translated()
	name?: TranslatedString;

	@Enum('G1', 'G2', 'G3')
	grade?: 'G1' | 'G2' | 'G3';

	@Translated()
	trackName?: TranslatedString;

	@Number()
	trackDistance?: number;

	@Enum('Turf', 'Dirt')
	trackType?: 'Turf' | 'Dirt';

	@Enum('CW', 'CCW')
	trackDirection?: 'CW' | 'CCW';

	@Desc('Human-readable version of the usual timeframe the race takes place')
	@String()
	raceTimeDescription?: string;

	@Desc(
		'Used to sort the race in chronological order. Rule of thumb: (Month# * 10 + Week#) e.g. "121" for first week of December'
	)
	@Number()
	raceTimeSortValue?: number;

	@Number()
	raceTimeStartYear?: number;

	@Record({ name: 'string', untilYear: 'number' })
	@MakeArray()
	previousNames?: { name: string; untilYear: number }[];

	@String()
	wikiJP?: string;

	@String()
	wikiEN?: string;

	@ImageFile('logo.png')
	imageLogo?: string;

	@ImageFile('thumb.png')
	imageThumb?: string;

	@Boolean()
	visible?: boolean;
}

// TODO race history
