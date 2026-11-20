// The arithmetic every rule rests on: the six abilities, a score's modifier, the proficiency bonus
// by level. Pure.

export type Ability = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';

export const ABILITIES: readonly Ability[] = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

/** The 2014 rules or the 2024 rules; a character keeps one. */
export type RuleSet = '2014' | '2024';

/** A score's modifier: 10 and 11 give +0, every two points one more. */
export function modifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

/** +2 at levels 1–4, one more every four levels, +6 from level 17. */
export function proficiencyBonus(level: number): number {
  return 2 + Math.floor((Math.max(1, level) - 1) / 4);
}
