// The faction module's data types. Pure: no Obsidian import.

/** Which side of a relation a view shows: the public face, or the GM's true stance. */
export type Mode = 'public' | 'true';

/** The two frontmatter keys relations are read from. */
export type RelationField = 'relations' | 'secret_relations';

/** One relation value, −5 … +5, with the optional reason written next to it. */
export interface Relation {
	value: number;
	why?: string;
}

export type WarningCode =
	| 'value-out-of-range'
	| 'value-not-a-number'
	| 'value-not-integer'
	| 'structured-without-value'
	| 'relations-not-a-map'
	| 'power-out-of-range'
	| 'unknown-target'
	| 'self-relation'
	| 'ambiguous-key'
	| 'duplicate-name'
	| 'missing-type'
	| 'duplicate-faction-note';

/** A problem in the GM's data, reported once and never fatal. */
export interface Warning {
	/** The note the problem sits in. */
	path: string;
	code: WarningCode;
	/** The relation key concerned, if any. */
	key?: string;
	field?: RelationField;
}

export type Warn = (warning: Warning) => void;
