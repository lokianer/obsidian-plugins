// Spellcasting, spell slots (single class, multiclass, pact) and resources. Pure.

import type { Resource, Sheet, Spellcasting } from './character';
import type { Context } from './derive';
import type { Grant } from './model';

/** Spell slots by caster level (index 0 = level 1), from the multiclass spellcaster table. */
const SLOTS: readonly (readonly number[])[] = [
  [2],
  [3],
  [4, 2],
  [4, 3],
  [4, 3, 2],
  [4, 3, 3],
  [4, 3, 3, 1],
  [4, 3, 3, 2],
  [4, 3, 3, 3, 1],
  [4, 3, 3, 3, 2],
  [4, 3, 3, 3, 2, 1],
  [4, 3, 3, 3, 2, 1],
  [4, 3, 3, 3, 2, 1, 1],
  [4, 3, 3, 3, 2, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1, 1],
  [4, 3, 3, 3, 3, 1, 1, 1, 1],
  [4, 3, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 3, 2, 2, 1, 1],
];

/** Pact Magic by warlock level: how many slots, of which level. */
function pactSlots(level: number): Sheet['pact'] {
  if (level < 1) return null;
  const count = level === 1 ? 1 : level < 11 ? 2 : level < 17 ? 3 : 4;
  return { level: Math.min(5, Math.ceil(level / 2)), count };
}

type Casting = Extract<Grant, { kind: 'spellcasting' }>;

export function spellcasting(
  ctx: Context,
  classes: Sheet['classes'],
): { spellcasting: Spellcasting[]; slots: number[]; pact: Sheet['pact'] } {
  const { mod, proficiency } = ctx;
  const casting = ctx.grants.flatMap(({ grant, p }) =>
    grant.kind === 'spellcasting' && p.owner !== null ? [{ grant, owner: p.owner }] : [],
  );
  const levelOf = (owner: string) => classes.find((c) => c.id === owner)?.level ?? 0;
  const spellcasting = casting.map(({ grant, owner }): Spellcasting => ({
    class: owner,
    ability: grant.ability,
    dc: 8 + proficiency + mod[grant.ability],
    attack: proficiency + mod[grant.ability],
    prepared: ctx.amount(grant.prepared, owner),
    cantrips: ctx.amount(grant.cantrips, owner),
    list: grant.list,
  }));

  // Half and third casters round up in 2024 and down in 2014; a 2014 single-class half caster
  // has no slots at level 1.
  const round = ctx.character.rules === '2024' ? Math.ceil : Math.floor;
  const share = (g: Casting, level: number) =>
    g.progression === 'full'
      ? level
      : g.progression === 'half'
        ? round(level / 2)
        : g.progression === 'third'
          ? round(level / 3)
          : 0;
  const casterLevel = casting.reduce((n, { grant, owner }) => n + share(grant, levelOf(owner)), 0);
  const pact = casting.find(({ grant }) => grant.progression === 'pact');
  return {
    spellcasting,
    slots: casterLevel > 0 ? [...(SLOTS[Math.min(20, casterLevel) - 1] ?? [])] : [],
    pact: pact === undefined ? null : pactSlots(levelOf(pact.owner)),
  };
}

export function resources(ctx: Context): Resource[] {
  return ctx.grants.flatMap(({ grant, p }): Resource[] => {
    if (grant.kind !== 'resource') return [];
    const index = Math.max(1, ctx.classLevel(p.owner)) - 1;
    const die =
      grant.die === undefined
        ? null
        : typeof grant.die === 'string'
          ? grant.die
          : (grant.die.byLevel[index] ?? null);
    const recharge =
      typeof grant.recharge === 'string'
        ? grant.recharge
        : (grant.recharge.byLevel[index] ?? 'long');
    return [
      {
        id: grant.id,
        name: grant.name,
        uses: Math.max(grant.min ?? 0, ctx.amount(grant.uses, p.owner)),
        die,
        recharge,
      },
    ];
  });
}
