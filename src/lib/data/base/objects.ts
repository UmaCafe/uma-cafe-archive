import { dev } from '$app/env';
import { AUDIO_MIMES, IMAGE_MIMES, type KVPair } from '$lib/util';

/**
 * Represents an object stored in the database
 */
export class DatabaseObject {
	/** The database ID for this object */
	id: string;
	/** True if this object was created from existing database data */
	_loaded = false;
	/** The environment-specific database collection id this object is stored in */
	_collectionId!: string;
	/** The unique type of this object, can be used to locate the exact class the object was created from */
	_type!: string;
	/** The metadata for each key in this object, used to convert to/from the database format and for creating editor menus */
	_keyData!: Map<keyof this, KeyData<unknown>>;

	constructor(id: string) {
		this.id = id;
	}

	/**
	 * @returns The internal database representation of the current data in the object
	 */
	toDb(): Record<string, unknown> {
		const data: Record<string, unknown> = {};
		for (const [key, keyData] of this._keyData.entries()) {
			if (keyData.dbKey && key in this) {
				if (keyData.type == 'dynamic') {
					if (keyData.serializeKey) data[keyData.dbKey] = this[key][keyData.serializeKey];
				} else {
					data[keyData.dbKey] = this[key];
				}
			}
		}
		return data;
	}
}

/** Map of object types (DbObject._type) to their constructors */
export const OBJECT_BY_TYPE = new Map<string, ObjectConstructor<DatabaseObject>>();

/** Decorator that marks a class as one that comes from the database */
export function Collection(type: string): ClassDecorator {
	return (target) => {
		target.prototype._type = type;
		target.prototype._collectionId = (dev ? 'dev-' : 'prod-') + type;
		target.prototype._keyData = new Map(keyDataMap.get(target.prototype));
		OBJECT_BY_TYPE.set(type, target as unknown as ObjectConstructor<DatabaseObject>);
	};
}

export type KeyType =
	| 'number'
	| 'string'
	| 'translated'
	| 'boolean'
	| 'array'
	| 'object'
	| 'dynamic';

export type KeyData<T> = {
	dbKey: string;

	name?: string;
	description?: string;

	type?: KeyType;
	schema?: KeySchema;
	schemaNames?: KeyObjectNames;
	suggestTl?: TranslatedString[];
	enumChoices?: string[];
	fileMime?: string;
	fileDefaultName?: string;

	deserializeTo?: ObjectConstructor<DatabaseObject>;

	serializeKey?: keyof T;
	fromString?: (str: string) => Promise<unknown> | unknown;
	loadChoices?: (obj: T) => Promise<KVPair[]> | KVPair[];
};

export type KeyObjectSchema = {
	[k: string]: KeyType;
};

export type KeyObjectNames = { [k: string]: string };

export type KeySchema = KeyObjectSchema | KeyType;

export function String(): PropertyDecorator {
	return basicKeyDecorator((data) => {
		setType(data, 'string');
	});
}

export function Enum(...choices: string[]): PropertyDecorator {
	return basicKeyDecorator((data) => {
		setType(data, 'string');
		data.enumChoices = choices;
	});
}

export function Number(): PropertyDecorator {
	return basicKeyDecorator((data) => {
		setType(data, 'number');
	});
}

export function Translated(): PropertyDecorator {
	return basicKeyDecorator((data) => {
		setType(data, 'translated');
	});
}

export function TranslateSuggest(...suggestions: TranslatedString[]): PropertyDecorator {
	return basicKeyDecorator((data) => {
		setType(data, 'translated');
		data.suggestTl = suggestions;
	});
}

export function Boolean(): PropertyDecorator {
	return basicKeyDecorator((data) => {
		setType(data, 'boolean');
	});
}

export function MakeArray(): PropertyDecorator {
	return basicKeyDecorator((data) => {
		data.type = 'array';
	});
}

export function Record(schema: KeyObjectSchema, names?: KeyObjectNames): PropertyDecorator {
	return basicKeyDecorator((data) => {
		data.schema = schema;
		data.schemaNames = names;
		if (data.type != 'object' && data.type != 'array') data.type = 'object';
	});
}

export function File(mime: string, defaultFileName: string): PropertyDecorator {
	return basicKeyDecorator((data) => {
		setType(data, 'string');
		data.fileMime = mime;
		data.fileDefaultName = defaultFileName;
	});
}

export function AudioFile(defaultFileName: string): PropertyDecorator {
	return basicKeyDecorator((data) => {
		setType(data, 'string');
		data.fileMime = AUDIO_MIMES;
		data.fileDefaultName = defaultFileName;
	});
}

export function ImageFile(defaultFileName: string): PropertyDecorator {
	return basicKeyDecorator((data) => {
		setType(data, 'string');
		data.fileMime = IMAGE_MIMES;
		data.fileDefaultName = defaultFileName;
	});
}

export function Dynamic<T>(
	fromString: (str: string) => Promise<T> | T,
	serializeKey: keyof T,
	loadChoices: () => Promise<KVPair[]> | KVPair[]
): PropertyDecorator {
	return basicKeyDecorator<T>((data) => {
		data.type = 'dynamic';
		data.serializeKey = serializeKey;
		data.fromString = fromString;
		data.loadChoices = loadChoices;
	});
}

export function LinkedObject<T extends DatabaseObject>(
	type: ObjectConstructor<T>,
	display?: (val: T) => string | undefined
): PropertyDecorator {
	return basicKeyDecorator<T>((data) => {
		data.type = 'dynamic';
		data.serializeKey = 'id';
		data.fromString = async (str) => {
			const { loadFromDatabase } = await import('./server');
			return loadFromDatabase(type, str, { ignoreDynamic: true });
		};
		data.loadChoices = async (obj: T) => {
			if (display) {
				const { loadAllFromDatabase } = await import('./server');
				const allVals = await loadAllFromDatabase(type);
				return allVals
					.filter((val) => val.id != obj.id)
					.map((val: T) => ({ key: val.id, val: display(val) ?? val.id }));
			} else {
				const { loadIdListFromDatabase } = await import('./server');
				const idList = await loadIdListFromDatabase(type);
				return idList.filter((id) => id != obj.id).map((id) => ({ key: id, val: id }));
			}
		};
		data.deserializeTo = type;
	});
}

function setType<T extends DatabaseObject>(data: KeyData<T>, type: KeyType) {
	if (data.type == 'array' || data.type == 'object') {
		data.schema = type;
	} else {
		data.type = type;
	}
}

export function Key(dbKey: string): PropertyDecorator {
	return basicDataDecorator((data) => (data.dbKey = dbKey));
}

export function Name(name: string): PropertyDecorator {
	return basicDataDecorator((data) => (data.name = name));
}

export function Desc(description: string): PropertyDecorator {
	return basicDataDecorator((data) => (data.description = description));
}

function basicDataDecorator<T>(
	annotate: (data: KeyData<T>, key: string | symbol) => void
): PropertyDecorator {
	return (target: DatabaseObject, key) => {
		annotate(getKeyData(target, key), key);
	};
}

export function basicKeyDecorator<T>(
	annotate: (data: KeyData<T>, key: string | symbol) => void
): PropertyDecorator {
	return basicDataDecorator<T>((data, key) => {
		annotate(data, key);
	});
}

const keyDataMap = new Map<DatabaseObject, Map<string | symbol, KeyData<unknown>>>();

function getKeyData<T>(target: DatabaseObject, key: symbol | string): KeyData<T> {
	const data: KeyData<unknown> = { dbKey: key.toString() };
	if (!keyDataMap.has(target)) keyDataMap.set(target, new Map());
	if (!keyDataMap.get(target)?.has(key)) keyDataMap.get(target)?.set(key, data);
	return keyDataMap.get(target)?.get(key) ?? data;
}

export function fromJson<T extends DatabaseObject>(json: string): BaseObject<T> {
	return JSON.parse(json) as BaseObject<T>;
}

export type BaseObject<T> = {
	[P in {
		[K in keyof T]-?: MappedKey<T, K>;
	}[keyof T]]: MappedVal<T[P]>;
};
// eslint-disable-next-line @typescript-eslint/ban-types
type MappedKey<T, K extends keyof T> = T[K] extends Function
	? never
	: K extends `_${string}`
	? never
	: K;
type MappedVal<T> = T extends BaseObject<DatabaseObject> ? BaseObject<T> : T;

export type EditorInformation<T, K extends keyof BaseObject<T> = keyof BaseObject<T>> = {
	objKey: K;
	dbVal: unknown;
	keyData: BaseObject<KeyData<T[K]>>;
	choices?: KVPair[];
};

export type ObjectConstructor<T extends DatabaseObject> = {
	new (id: string): T;
};

export type TranslatedString = {
	jp?: string;
	en?: string;
};
