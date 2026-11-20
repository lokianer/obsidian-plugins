// Armour class and weapon attacks. Pure.

import type { Attack, Character, Value } from './character';
import type { Rules } from './data';
import type { Context } from './derive';
import type { ArmorDef } from './model';

/** The equipped body armour and whether a shield is equipped. */
export function worn(
  character: Character,
  rules: Rules,
): { body: ArmorDef | null; shield: boolean } {
  void character;
  void rules;
  return { body: null, shield: false };
}

export function armorClass(ctx: Context, armor: ReturnType<typeof worn>): Value {
  void armor;
  return {
    total: 10 + ctx.mod.dex,
    sources: [
      { label: 'base', value: 10 },
      { label: 'dex', value: ctx.mod.dex },
    ],
  };
}

export function attacks(ctx: Context): Attack[] {
  void ctx;
  return [];
}
