export type EditorObject = {
	name: string;
	uid: string;
	groups: string[];
};

export type PermissionGroup = {
	name: string;
	permissions: string[];
};

export type ObjectMeta<T> =
	| RecordMeta<AsRecord<T>>
	| ArrayMeta<AsArray<T>>
	| StringMeta<AsString<T>>
	| GenericMeta<AsNumber<T>, 'number'>
	| GenericMeta<AsBoolean<T>, 'boolean'>;

export interface GenericMeta<T, TypeString> {
	type: TypeString;
	name: string;
	example?: T;
	description?: string;
}

export interface RecordMeta<T extends Record<string, U>> extends GenericMeta<T, 'object'> {
	children: RecordKeyMeta<T>;
}

export type RecordKeyMeta<T extends Record<string, unknown>> = {
	[P in keyof Required<T>]: ObjectMeta<T[P]>;
};

export interface ArrayMeta<T extends U[]> extends GenericMeta<T, 'array'> {
	entry: ObjectMeta<T[number]>;
	default: T[number];
}

export interface FileMeta<T extends string> extends GenericMeta<T, 'file'> {
	mime: string;
	defaultFileName?: string;
}

export interface EnumMeta<T extends string> extends GenericMeta<T, 'enum'> {
	choices: { label: string; value: T }[];
}

export interface SuggestMeta<T extends string> extends GenericMeta<T, 'suggest'> {
	suggestions: T[];
}

export type StringMeta<T extends string> =
	| GenericMeta<T, 'string'>
	| FileMeta<T>
	| EnumMeta<T>
	| SuggestMeta<T>;

type AsRecord<T> = T extends Record<string, unknown> ? T : never;
type AsArray<T> = T extends unknown[] ? T : never;
type AsString<T> = T extends string ? T : never;
type AsNumber<T> = T extends number ? T : never;
type AsBoolean<T> = T extends boolean ? T : never;

export type ObjectEditorMeta = {
	assetFolder: string;
};
