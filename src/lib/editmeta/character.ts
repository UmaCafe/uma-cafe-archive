import type { CharacterObject } from '../types/character';
import type { EditorMetadata } from '../types/editors';
import { AUDIO_MIMES, IMAGE_MIMES } from '../util';

export const CHARACTER_METADATA: EditorMetadata<CharacterObject> = {
	info: {
		type: 'object',
		name: 'Character Information',
		children: {
			name: {
				type: 'object',
				name: 'Character Name',
				children: {
					native: {
						type: 'string',
						name: 'JP',
						example: 'トキノミノル'
					},
					translated: {
						type: 'string',
						name: 'EN',
						example: 'Tokino Minoru'
					}
				}
			},
			gameId: {
				type: 'number',
				name: 'Game ID',
				description: 'Internal game ID for reference'
			},
			colors: {
				type: 'object',
				name: 'Colors',
				children: {
					main: { type: 'string', name: 'Main' },
					sub: { type: 'string', name: 'Secondary' }
				}
			},
			bio: {
				type: 'object',
				name: 'Biography',
				children: {
					intro: {
						type: 'string',
						name: 'Introduction',
						description: 'Intro quote from the game bio'
					},
					about: {
						type: 'string',
						name: 'About',
						description:
							'General info blurb, some taken from the initial EN twitter intro thread. Could also be taken from the official website bio.'
					},
					birthday: {
						type: 'object',
						name: 'Birthday',
						children: {
							year: { type: 'number', name: 'Year' },
							month: { type: 'number', name: 'Month' },
							day: { type: 'number', name: 'Day' }
						}
					},
					sizes: {
						type: 'object',
						name: 'Sizes',
						children: {
							height: { type: 'number', name: 'Height' },
							bust: { type: 'number', name: 'Bust' },
							waist: { type: 'number', name: 'Waist' },
							hips: { type: 'number', name: 'Hips' },
							shoes: {
								type: 'string',
								name: 'Shoes',
								description:
									'From game bio. Try to keep in the format "L/R XXcm" or "L XXcm / R XXcm"'
							}
						}
					},
					weight: {
						type: 'string',
						name: 'Weight',
						description: 'Weight section from game bio or website'
					},
					class: {
						type: 'suggest',
						name: 'Class',
						suggestions: ['Upper', 'Middle']
					},
					dorm: {
						type: 'suggest',
						name: 'Dorm',
						suggestions: ['Ritto', 'Miho']
					},
					strength: {
						type: 'string',
						name: 'Strength',
						description: 'Strength from game bio'
					},
					weakness: {
						type: 'string',
						name: 'Weakness',
						description: 'Weakness from game bio'
					},
					secret: {
						type: 'string',
						name: 'Secret',
						description: 'Secret from the game load screens'
					},
					onEars: {
						type: 'string',
						name: 'On Ears',
						description: 'Ears quote from the game bio'
					},
					onTail: {
						type: 'string',
						name: 'On Tail',
						description: 'Tail quote from the game bio'
					},
					onFamily: {
						type: 'string',
						name: 'On Family',
						description: 'Family quote from the game bio'
					}
				}
			},
			voice: {
				type: 'object',
				name: 'Seiyuu',
				children: {
					nativeName: {
						type: 'string',
						name: 'Name (JP)',
						example: '藤井ゆきよ'
					},
					romanizedName: {
						type: 'string',
						name: 'Name (EN)',
						example: 'Yukiyo Fujii',
						description: 'Order should be Given name THEN Family name (First Last)'
					},
					anilistUrl: {
						type: 'string',
						name: 'Anilist URL',
						example: 'https://anilist.co/staff/106162/Yukiyo-Fujii'
					},
					malUrl: {
						type: 'string',
						name: 'MyAnimeList URL',
						example: 'https://myanimelist.net/people/11162/Yukiyo_Fujii'
					},
					wikipediaUrlEN: {
						type: 'string',
						name: 'Wikipedia URL (EN)',
						example: 'https://en.wikipedia.org/wiki/Yukiyo_Fujii'
					},
					wikipediaUrlJP: {
						type: 'string',
						name: 'Wikipedia URL (JP)',
						example: 'https://ja.wikipedia.org/wiki/%E8%97%A4%E4%BA%95%E3%82%86%E3%81%8D%E3%82%88'
					},
					voiceSample: {
						type: 'file',
						name: 'Voice Sample File',
						mime: AUDIO_MIMES,
						defaultFileName: 'voice.mp3'
					}
				}
			},
			counterpart: {
				type: 'object',
				name: 'IRL Counterpart',
				children: {
					sex: {
						type: 'enum',
						name: 'Sex',
						choices: [
							{ label: 'Stallion', value: 'male' },
							{ label: 'Mare', value: 'female' }
						]
					},
					record: {
						type: 'object',
						name: 'Race Record',
						children: {
							total: { type: 'number', name: 'Total Races' },
							wins: { type: 'number', name: 'Races Won' }
						}
					},
					notableRaces: {
						type: 'array',
						name: 'Notable Races',
						entry: {
							name: { type: 'string', name: 'Race Name' },
							place: { type: 'number', name: 'Placed #' },
							year: { type: 'number', name: 'Year' }
						}
					},
					netkeibaUrl: {
						type: 'string',
						name: 'netkeiba URL',
						example: 'https://db.netkeiba.com/horse/000a01029a/'
					},
					wikipediaUrlEN: {
						type: 'string',
						name: 'Wikipedia URL (EN)',
						example: 'https://en.wikipedia.org/wiki/Tokino_Minoru'
					},
					wikipediaUrlJP: {
						type: 'string',
						name: 'Wikipedia URL (JP)',
						example:
							'https://ja.wikipedia.org/wiki/%E3%83%88%E3%82%AD%E3%83%8E%E3%83%9F%E3%83%8E%E3%83%AB'
					}
				}
			}
		}
	},
	assetId: {
		type: 'string',
		name: 'Asset ID',
		description: 'Name of the asset folder the files are stored in'
	},
	images: {
		type: 'object',
		name: 'Character Images',
		children: {
			icon: {
				type: 'file',
				name: 'Icon',
				mime: IMAGE_MIMES,
				defaultFileName: 'icon.png'
			},
			thumb: {
				type: 'file',
				name: 'Thumbnail',
				mime: IMAGE_MIMES,
				defaultFileName: 'thumb.png'
			},
			counterpart: {
				type: 'file',
				name: 'Counterpart Image',
				mime: IMAGE_MIMES,
				defaultFileName: 'counterpart.jpg'
			},
			proto: {
				type: 'file',
				name: 'Prototype Style CG',
				mime: IMAGE_MIMES,
				defaultFileName: 'proto_raw.png'
			},
			seifuku: {
				type: 'file',
				name: 'Uniform CG',
				mime: IMAGE_MIMES,
				defaultFileName: 'seifuku_raw.png'
			},
			shoubufuku: {
				type: 'file',
				name: 'Race Outfit CG',
				mime: IMAGE_MIMES,
				defaultFileName: 'shoubufuku_raw.png'
			},
			stage: {
				type: 'file',
				name: 'Starting Future CG',
				mime: IMAGE_MIMES,
				defaultFileName: 'stage_raw.png'
			}
		}
	},
	visible: {
		type: 'boolean',
		name: 'Character Page Visible',
		description: 'Whether to show the character page in the character list'
	}
};