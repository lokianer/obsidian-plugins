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

/** A faction (real or pseudo) or a character, as discovered from the notes. */
export interface Entity {
	/** Faction: its folder path. Character: its note path. Pseudo-faction: PARTY or UNAFFILIATED. */
	id: string;
	kind: 'faction' | 'character';
	/** True for the Party and Unaffiliated groups, which have no note. */
	pseudo: boolean;
	/** Faction: frontmatter `name`, else the folder name. Character: the note's base name. */
	name: string;
	/** Factions only: the folder's own name, also accepted as a relation key. */
	folderName?: string;
	/** The note holding the frontmatter; null for pseudo-factions. */
	notePath: string | null;
	/** Id of the enclosing faction; null for top-level factions and pseudo-factions. */
	parent: string | null;
	/** 1–5; only drawn for factions. */
	power: number;
	/** Keys as written in the note, not yet resolved. */
	relations: Map<string, Relation>;
	secretRelations: Map<string, Relation>;
}
