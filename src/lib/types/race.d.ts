export interface RaceObject {
	info: {
		name: RaceName;
		grade: RaceGrade;
		trackInfo?: RaceTrack;
		raceInfo?: RaceInformation;
		history?: RaceHistoric[];
		links?: RaceLinks;
	};
	images: RaceImages;
}

export type RaceName = {
	native: string;
	translated: string;
};

export type RaceGrade = 'g1' | 'g2' | 'g3';

export type RaceTrack = {
	trackName: string;
	distance: number;
	trackType: 'turf' | 'dirt';
	direction: 'cw' | 'ccw';
};

export type RaceInformation = {
	raceTimeValue?: number;
	raceTimeDescription?: string;
	startYear?: number;
	previousNames?: {
		name: string;
		untilYear: number;
	}[];
};

export type RaceHistoric = {
	year: number;
	characters: {
		characterId: string;
		place: number;
	}[];
};

export type RaceLinks = {
	wikipediaUrlJP?: string;
	wikipediaUrlEN?: string;
};

export type RaceImages = {
	logo: string;
	thumb: string;
};
