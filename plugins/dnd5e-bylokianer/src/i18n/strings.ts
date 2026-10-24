// Interface strings. English is the source of every key; German follows it key for key.
// Placeholders are written {name} and filled by the function createT returns.

export type Lang = 'en' | 'de';

export const en = {
  'command.showWarnings': 'Show faction warnings',
  'modal.title': 'Faction warnings',
  'modal.noCampaign': 'No campaign note found',
  'modal.noWarnings': 'Every note reads cleanly',
  'stat.faction': 'faction',
  'stat.factions': 'factions',
  'stat.character': 'character',
  'stat.characters': 'characters',
  'stat.warning': 'warning',
  'stat.warnings': 'warnings',
  'group.skipped': 'Skipped',
  'group.adjusted': 'Adjusted',
  'group.names': 'Names',
  'group.notes': 'Notes',
  'field.secret': 'secret',
  'warning.value-out-of-range': 'outside −5 … +5',
  'warning.value-not-a-number': '“{written}” is not a number',
  'warning.value-not-integer': 'not a whole number',
  'warning.structured-without-value': 'has a reason but no value',
  'warning.relations-not-a-map': 'is not a list of names with values',
  'warning.power-out-of-range': 'outside 1 … 5',
  'warning.power-not-a-number': '“{written}” is not a number',
  'warning.power-not-integer': 'not a whole number',
  'warning.unknown-target': 'no faction or character has this name — kept as a dangling target',
  'warning.self-relation': 'a relation to itself',
  'warning.ambiguous-key': 'a faction and a character share this name — the faction is used',
  'warning.duplicate-name': 'another faction or character already has this name — that one is used',
  'warning.missing-type': 'factions.md has no “type: faction” — read as a faction anyway',
  'warning.duplicate-faction-note':
    'the folder also has a factions.md — that one is used, this note is ignored',
  'warning.duplicate-key': 'an earlier entry already names this target — this one is skipped',
  'warning.campaign-ignored': 'another campaign note is in use — this one is passed over',
  'warning.broken-frontmatter': 'the frontmatter is not valid YAML — none of its values are read',
  'step.-5': 'war',
  'step.-4': 'feud',
  'step.-3': 'hostile',
  'step.-2': 'distrust',
  'step.-1': 'wary',
  'step.0': 'neutral',
  'step.1': 'cordial',
  'step.2': 'friendly',
  'step.3': 'allied',
  'step.4': 'close',
  'step.5': 'sworn',
};

export type StringKey = keyof typeof en;

export const de: Record<StringKey, string> = {
  'command.showWarnings': 'Fraktions-Warnungen anzeigen',
  'modal.title': 'Fraktions-Warnungen',
  'modal.noCampaign': 'Keine Kampagnennotiz gefunden',
  'modal.noWarnings': 'Alle Notizen sind sauber lesbar',
  'stat.faction': 'Fraktion',
  'stat.factions': 'Fraktionen',
  'stat.character': 'Charakter',
  'stat.characters': 'Charaktere',
  'stat.warning': 'Warnung',
  'stat.warnings': 'Warnungen',
  'group.skipped': 'Übersprungen',
  'group.adjusted': 'Angepasst',
  'group.names': 'Namen',
  'group.notes': 'Notizen',
  'field.secret': 'geheim',
  'warning.value-out-of-range': 'außerhalb von −5 … +5',
  'warning.value-not-a-number': '„{written}“ ist keine Zahl',
  'warning.value-not-integer': 'keine ganze Zahl',
  'warning.structured-without-value': 'hat eine Begründung, aber keinen Wert',
  'warning.relations-not-a-map': 'ist keine Liste aus Namen und Werten',
  'warning.power-out-of-range': 'außerhalb von 1 … 5',
  'warning.power-not-a-number': '„{written}“ ist keine Zahl',
  'warning.power-not-integer': 'keine ganze Zahl',
  'warning.unknown-target': 'keine Fraktion und kein Charakter heißt so — bleibt als offenes Ziel',
  'warning.self-relation': 'eine Beziehung zu sich selbst',
  'warning.ambiguous-key':
    'eine Fraktion und ein Charakter heißen gleich — die Fraktion wird verwendet',
  'warning.duplicate-name':
    'eine andere Fraktion oder ein anderer Charakter heißt schon so — diese wird verwendet',
  'warning.missing-type':
    'factions.md hat kein „type: faction“ — wird trotzdem als Fraktion gelesen',
  'warning.duplicate-faction-note':
    'der Ordner hat auch eine factions.md — die wird verwendet, diese Notiz nicht',
  'warning.duplicate-key':
    'ein früherer Eintrag nennt dieses Ziel schon — dieser wird übersprungen',
  'warning.campaign-ignored': 'eine andere Kampagnennotiz wird verwendet — diese wird übergangen',
  'warning.broken-frontmatter':
    'das Frontmatter ist kein gültiges YAML — keiner seiner Werte wird gelesen',
  'step.-5': 'Krieg',
  'step.-4': 'Fehde',
  'step.-3': 'feindlich',
  'step.-2': 'Misstrauen',
  'step.-1': 'argwöhnisch',
  'step.0': 'neutral',
  'step.1': 'höflich',
  'step.2': 'freundlich',
  'step.3': 'verbündet',
  'step.4': 'eng',
  'step.5': 'eingeschworen',
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
