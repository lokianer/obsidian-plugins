// Armour class and weapon attacks. Pure.

import type { Attack, Character, Value } from './character';
import type { Rules } from './data';
import type { Context } from './derive';
import type { ArmorDef } from './model';

const sum = (sources: Value['sources']): Value => ({
  total: sources.reduce((n, s) => n + s.value, 0),
  sources,
});

/** The equipped body armour and whether a shield is equipped. */
export function worn(
  character: Character,
  rules: Rules,
): { body: ArmorDef | null; shield: boolean } {
  let body: ArmorDef | null = null;
  let shield = false;
  for (const item of character.inventory) {
    if (item.equipped !== true) continue;
    const armor = rules.armor(item.item);
    if (armor?.category === 'shield') shield = true;
    else if (armor !== undefined && (body === null || armor.ac > body.ac)) body = armor;
  }
  return { body, shield };
}

/**
 * The best of: the worn armour, each unarmoured formula, and 10 + Dexterity; then the shield,
 * AC bonuses and manual bonuses.
 */
export function armorClass(ctx: Context, armor: ReturnType<typeof worn>): Value {
  const { mod } = ctx;
  const candidates: { sources: Value['sources']; shield: boolean }[] = [];
  if (armor.body !== null) {
    const { body } = armor;
    const dex = body.dexMax === null ? mod.dex : Math.min(mod.dex, body.dexMax);
    const sources = [{ label: body.id, value: body.ac }];
    if (dex !== 0) sources.push({ label: 'dex', value: dex });
    candidates.push({ sources, shield: true });
  } else {
    candidates.push({
      sources: [
        { label: 'base', value: 10 },
        { label: 'dex', value: mod.dex },
      ],
      shield: true,
    });
    for (const { grant } of ctx.grants) {
      if (grant.kind !== 'ac' || (armor.shield && !grant.shield)) continue;
      candidates.push({
        sources: [
          { label: grant.id, value: grant.base },
          ...grant.add.map((a) => ({ label: a, value: mod[a] })),
        ],
        shield: grant.shield,
      });
    }
  }
  const best = candidates.reduce((a, b) => (sum(b.sources).total > sum(a.sources).total ? b : a));
  const sources = [...best.sources];
  if (armor.shield && best.shield) sources.push({ label: 'shield', value: 2 });
  for (const { grant, p } of ctx.grants) {
    if (grant.kind !== 'ac-bonus') continue;
    if (grant.when === 'armored' && armor.body === null) continue;
    sources.push({ label: p.feature.id, value: grant.value });
  }
  for (const bonus of ctx.character.bonuses) {
    if (bonus.to === 'ac') sources.push({ label: 'bonus', value: bonus.value });
  }
  return sum(sources);
}

const signed = (n: number) => (n > 0 ? `+${n}` : n < 0 ? String(n) : '');

/** One attack per equipped weapon. */
export function attacks(ctx: Context): Attack[] {
  const { mod, rules } = ctx;
  return ctx.character.inventory.flatMap((item) => {
    const weapon = item.equipped === true ? rules.weapon(item.item) : undefined;
    if (weapon === undefined) return [];
    const finesse = weapon.properties.includes('finesse');
    const ability = weapon.ranged ? 'dex' : finesse && mod.dex > mod.str ? 'dex' : 'str';
    const proficient =
      ctx.lists.weapon.includes(weapon.category) || ctx.lists.weapon.includes(weapon.id);
    const toHit = [{ label: ability as string, value: mod[ability] }];
    if (proficient) toHit.push({ label: 'proficiency', value: ctx.proficiency });
    for (const { grant, p } of ctx.grants) {
      if (grant.kind === 'attack-bonus' && grant.ranged === weapon.ranged) {
        toHit.push({ label: p.feature.id, value: grant.value });
      }
    }
    return [
      {
        id: weapon.id,
        name: weapon.name,
        toHit: sum(toHit),
        damage: `${weapon.damage}${signed(mod[ability])}`,
        type: weapon.type,
        properties: weapon.properties,
        mastery: weapon.mastery ?? null,
        proficient,
      },
    ];
  });
}
