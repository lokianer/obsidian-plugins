// Encounter difficulty by the SRD 5.2.1's XP budget (CC-BY-4.0): per character and level a Low,
// Moderate and High budget; a party's budget is the sum over its characters, and an encounter
// spends it with its creatures' XP, summed. The encounter note the builder writes. Pure.

export type Difficulty = 'low' | 'moderate' | 'high';
export const DIFFICULTIES: readonly Difficulty[] = ['low', 'moderate', 'high'];

/** XP Budget per Character, SRD 5.2.1: Low, Moderate, High for levels 1–20. */
const BUDGET: readonly (readonly [number, number, number])[] = [
  [50, 75, 100],
  [100, 150, 200],
  [150, 225, 400],
  [250, 375, 500],
  [500, 750, 1100],
  [600, 1000, 1400],
  [750, 1300, 1700],
  [1000, 1700, 2100],
  [1300, 2000, 2600],
  [1600, 2300, 3100],
  [1900, 2900, 4100],
  [2200, 3700, 4700],
  [2600, 4200, 5400],
  [2900, 4900, 6200],
  [3300, 5400, 7800],
  [3800, 6100, 9800],
  [4500, 7200, 11700],
  [5000, 8700, 14200],
  [5500, 10700, 17200],
  [6400, 13200, 22000],
];

const level = (n: number) => Math.min(20, Math.max(1, Math.round(n) || 1));

/** The party's budget for a difficulty: each character's entry by their level, summed. */
export function budget(levels: readonly number[], difficulty: Difficulty): number {
  const column = DIFFICULTIES.indexOf(difficulty);
  return levels.reduce((sum, l) => sum + (BUDGET[level(l) - 1]?.[column] ?? 0), 0);
}

export type Rating = 'none' | Difficulty | 'beyond';

/** How hard an encounter's XP is for the party: the first budget it fits, or beyond High. */
export function rating(xp: number, levels: readonly number[]): Rating {
  if (xp <= 0 || levels.length === 0) return 'none';
  return DIFFICULTIES.find((d) => xp <= budget(levels, d)) ?? 'beyond';
}

export interface EncounterDraft {
  name: string;
  location: string;
  difficulty: Difficulty;
  /** False leaves the campaign's party out of the fight. */
  party: boolean;
  monsters: { name: string; count: number }[];
}

/** A YAML scalar: plain when safe, else JSON-quoted. */
const scalar = (s: string) => (/^[A-Za-z][\w ,'()-]*$/.test(s) ? s : JSON.stringify(s));

/** The encounter note: frontmatter the battle tracker reads, a heading, sections to fill. */
export function encounterNoteText(draft: EncounterDraft): string {
  const lines = ['---', 'type: encounter', `difficulty: ${draft.difficulty}`];
  const location = draft.location.trim();
  if (location !== '') lines.push(`location: ${JSON.stringify(location)}`);
  if (!draft.party) lines.push('party: false');
  const monsters = draft.monsters.filter((m) => m.name.trim() !== '' && m.count > 0);
  if (monsters.length === 0) lines.push('combatants: []');
  else lines.push('combatants:');
  for (const m of monsters) {
    lines.push(`  - monster: ${scalar(m.name.trim())}`);
    if (m.count > 1) lines.push(`    count: ${m.count}`);
  }
  lines.push('tags:', '  - encounter', '---', '', `# ${draft.name.trim()}`, '', '## Tactics', '');
  return lines.join('\n');
}
