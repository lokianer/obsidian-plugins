// Several data sets (the SRD, a book, …) merged into one set of lookups by id. Pure.

import type {
  ArmorDef,
  BackgroundDef,
  ClassDef,
  FeatDef,
  LanguageDef,
  RulesData,
  SkillDef,
  SpeciesDef,
  SubclassDef,
  ToolDef,
  WeaponDef,
} from './model';

export interface Rules {
  data: RulesData;
  class(id: string): ClassDef | undefined;
  subclass(id: string): SubclassDef | undefined;
  species(id: string): SpeciesDef | undefined;
  background(id: string): BackgroundDef | undefined;
  feat(id: string): FeatDef | undefined;
  armor(id: string): ArmorDef | undefined;
  weapon(id: string): WeaponDef | undefined;
  skill(id: string): SkillDef | undefined;
  tool(id: string): ToolDef | undefined;
  language(id: string): LanguageDef | undefined;
}

const KEYS = [
  'classes',
  'subclasses',
  'species',
  'backgrounds',
  'feats',
  'armor',
  'weapons',
  'skills',
  'tools',
  'languages',
  'creation',
] as const;

export function loadRules(sets: readonly RulesData[]): Rules {
  const data = Object.fromEntries(
    KEYS.map((key) => [key, sets.flatMap((set) => set[key] as { id: string }[])]),
  ) as unknown as RulesData;
  const index = <T extends { id: string }>(list: readonly T[]) => {
    const map = new Map<string, T>();
    for (const item of list) if (!map.has(item.id)) map.set(item.id, item);
    return (id: string) => map.get(id);
  };
  return {
    data,
    class: index(data.classes),
    subclass: index(data.subclasses),
    species: index(data.species),
    background: index(data.backgrounds),
    feat: index(data.feats),
    armor: index(data.armor),
    weapon: index(data.weapons),
    skill: index(data.skills),
    tool: index(data.tools),
    language: index(data.languages),
  };
}
