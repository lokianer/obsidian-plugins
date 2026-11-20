// Spellcasting, spell slots (single class, multiclass, pact) and resources. Pure.

import type { Resource, Sheet, Spellcasting } from './character';
import type { Context } from './derive';

export function spellcasting(
  ctx: Context,
  classes: Sheet['classes'],
): { spellcasting: Spellcasting[]; slots: number[]; pact: Sheet['pact'] } {
  void ctx;
  void classes;
  return { spellcasting: [], slots: [], pact: null };
}

export function resources(ctx: Context): Resource[] {
  void ctx;
  return [];
}
