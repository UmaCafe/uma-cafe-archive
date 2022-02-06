export type EditorObject = {
	name: string;
	key: string;
};

export type EditorMetadata<T extends Record<string, unknown>> = {
	[P in keyof Required<T>]: T[P] extends Record<string, unknown>
		? RecordMetadata<T[P]>
		: T[P] extends Array<unknown>
		? ArrayMetadata<T[P]>
		: T[P] extends number
		? NumberMetadata<T[P]>
		: T[P] extends boolean
		? BooleanMetadata<T[P]>
		: OtherMetadata<T[P]>;
};

export type RecordMetadata<T extends Record<string, unknown>> = {
	type: 'object';
	name: string;
	children: EditorMetadata<T>;
};

export type ArrayMetadata<T extends Array> = {
	type: 'array';
	name: string;
	entry: EditorMetadata<T[number]>;
};

type ValueFields<T> = {
	name: string;
	example?: T;
	description?: string;
};

export type NumberMetadata<T extends number> = {
	type: 'number';
} & ValueFields<T>;

export type BooleanMetadata<T extends boolean> = {
	type: 'boolean';
} & ValueFields<T>;

export type OtherMetadata<T> = ValueFields<T> &
	(
		| { type: 'string' }
		| { type: 'file'; mime: string; defaultFileName?: string }
		| { type: 'enum'; choices: { label: string; value: T }[] }
		| { type: 'suggest'; suggestions: T[] }
	);

export type ObjectEditorMeta = {
	assetFolder: string;
};
