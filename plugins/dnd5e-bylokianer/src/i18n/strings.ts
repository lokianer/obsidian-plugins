// Interface strings. English is the source of every key; German follows it key for key.
// Placeholders are written {name} and filled by the function createT returns.

export type Lang = 'en' | 'de';

export const en = {
	'command.showWarnings': 'Show faction warnings',
	'modal.title': 'Faction warnings',
	'modal.noCampaign': 'No campaign note found',
	'modal.noWarnings': 'No warnings — every note reads cleanly.',
	summary: '{factions} factions, {characters} characters, {warnings} warnings',
	'warning.value-out-of-range': '“{key}”: the value is outside −5 … +5 and was clamped.',
	'warning.value-not-a-number': '“{key}”: the value is not a number and was skipped.',
	'warning.value-not-integer': '“{key}”: the value is not a whole number and was rounded.',
	'warning.structured-without-value': '“{key}”: the entry has no value and was skipped.',
	'warning.relations-not-a-map': '{field} is not a list of names with values and was skipped.',
	'warning.power-out-of-range': 'power is outside 1 … 5 and was clamped.',
	'warning.unknown-target': '“{key}”: no faction or character has this name.',
	'warning.self-relation': '“{key}”: a relation to itself was skipped.',
	'warning.ambiguous-key': '“{key}”: a faction and a character share this name; the faction is used.',
	'warning.duplicate-name': 'Another faction or character already has this name; that one is used.',
	'warning.missing-type': 'factions.md has no “type: faction”; it is read as a faction anyway.',
	'warning.duplicate-faction-note':
		'The folder also has a factions.md; that one is used and this note is ignored.',
};

export type StringKey = keyof typeof en;

export const de: Record<StringKey, string> = {
	'command.showWarnings': 'Fraktions-Warnungen anzeigen',
	'modal.title': 'Fraktions-Warnungen',
	'modal.noCampaign': 'Keine Kampagnennotiz gefunden',
	'modal.noWarnings': 'Keine Warnungen — alle Notizen sind lesbar.',
	summary: '{factions} Fraktionen, {characters} Charaktere, {warnings} Warnungen',
	'warning.value-out-of-range': '„{key}“: Der Wert liegt außerhalb von −5 … +5 und wurde begrenzt.',
	'warning.value-not-a-number': '„{key}“: Der Wert ist keine Zahl und wurde übersprungen.',
	'warning.value-not-integer': '„{key}“: Der Wert ist keine ganze Zahl und wurde gerundet.',
	'warning.structured-without-value': '„{key}“: Der Eintrag hat keinen Wert und wurde übersprungen.',
	'warning.relations-not-a-map': '{field} ist keine Liste aus Namen und Werten und wurde übersprungen.',
	'warning.power-out-of-range': 'power liegt außerhalb von 1 … 5 und wurde begrenzt.',
	'warning.unknown-target': '„{key}“: Keine Fraktion und kein Charakter heißt so.',
	'warning.self-relation': '„{key}“: Eine Beziehung zu sich selbst wurde übersprungen.',
	'warning.ambiguous-key':
		'„{key}“: Eine Fraktion und ein Charakter heißen gleich; die Fraktion wird verwendet.',
	'warning.duplicate-name':
		'Eine andere Fraktion oder ein anderer Charakter heißt schon so; diese wird verwendet.',
	'warning.missing-type':
		'factions.md hat kein „type: faction“; sie wird trotzdem als Fraktion gelesen.',
	'warning.duplicate-faction-note':
		'Der Ordner hat auch eine factions.md; die wird verwendet, diese Notiz nicht.',
};

export type T = (key: StringKey, vars?: Record<string, string | number>) => string;

const tables: Record<Lang, Record<StringKey, string>> = { en, de };

export function createT(lang: string): T {
	const table = lang === 'de' ? tables.de : tables.en;
	return (key, vars = {}) =>
		table[key].replace(/\{(\w+)\}/g, (match, name: string) =>
			name in vars ? String(vars[name]) : match,
		);
}
