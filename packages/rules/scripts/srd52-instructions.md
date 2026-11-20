# Turning the SRD 5.2.1 into rule records — instructions for the cleaning agents

The SRD 5.2.1 (Wizards of the Coast, CC-BY-4.0) is turned into JSON records of the data model in
`packages/rules/src/model.ts` (read it first: `Feature`, `Grant`, `Choice`, `OptionSource`,
`Amount`, `ClassDef`, `SubclassDef`, `SpeciesDef`, `BackgroundDef`, `FeatDef`, `ArmorDef`,
`WeaponDef`). The fixture `packages/rules/data/fixture/fixture.json` shows the JSON shape.

Sources (private work folder, not in the repository): `dnd5e-library/work/srd52/src/<name>.txt`
(running text, one paragraph per line) and `<name>.layout.txt` (the same pages with the tables in
columns). Output: `dnd5e-library/work/srd52/out/<name>.json`. Write nowhere else.

## Rules

1. **Never estimate or invent a number.** Every number comes from the SRD text or its tables. If a
   table cell is unreadable in both files, write `"TODO"` in its place and list it in your report.
2. **Text verbatim.** `text.en` is the SRD's full text of the feature, paragraphs joined with
   `\n\n`, lists as Markdown `- ` lines, tables as Markdown tables. Fix only hyphenation breaks
   (`mon- ster` → `monster`) and page furniture (page numbers, "System Reference Document 5.2.1").
   No `de` texts.
3. **Ids:** lower-case English kebab case. Class `bard`; subclass `bard/college-of-lore`; feature
   `<owner>-<feature>` (`bard-bardic-inspiration`, `lore-cutting-words`, `halfling-luck`); features
   that repeat get the level: `bard-asi-4`, `bard-asi-8`, …, `bard-epic-boon-19`. Skills
   `sleight-of-hand`; abilities `str dex con int wis cha`; armour categories `light medium heavy
shield`; weapon categories `simple martial`; weapons and armour by name (`hand-crossbow`,
   `studded-leather`); tools by name (`thieves-tools`); languages by name (`common`, `draconic`).
4. **One feature per SRD feature heading**, with `level` = the class level of the heading
   ("Level 2: Expertise" → 2). Species, background and feat features: `level` 1 (or the level the
   text names for a trait that comes later, e.g. a species spell at character level 3).
5. **A class's first feature** is `<class>-core` (level 1): text = the Core Traits table as a
   Markdown table; grants = saves, armour and weapon proficiencies, tools; choices = the skill
   choice (`gives: "skill"`, `from: {"skills": [...]}` or `"any"`) and tool choices. Its
   `multiclass.grants` are the proficiencies the multiclassing rules list for that class (from the
   Core Traits table's "Armor Training … if you multiclass" or the multiclassing section); its
   `multiclass.requires` the primary ability of 13.
6. **Grants only for what changes a number or a list on the sheet** (`model.ts` lists the kinds):
   proficiencies, expertise, ability increases (with `max` when not 20), speed (with `when`),
   senses, initiative, hit points per level, unarmoured AC formulas (`kind: "ac"`), AC bonuses,
   attack bonuses, resistances, resources (uses with recharge and an optional die), scaling values
   (`kind: "scale"`, 20 values, one per class level, for Sneak Attack, Martial Arts die, Rage
   Damage, Weapon Mastery count …), half proficiency, spellcasting. A feature whose effect is not
   one of these has `"grants": []` — its text carries it.
7. **Choices** the player makes when gaining the feature: subclass (`gives: "subclass"`,
   `from: {"subclasses": "<class>"}`, on the feature `<class>-subclass` at the subclass level), the
   Ability Score Improvement levels and Epic Boon (`gives: "feat"`, `from: {"feats": "general"}`
   or `"epic-boon"`), fighting styles (`gives: "feat"`, `"fighting-style"`), expertise
   (`gives: "expertise"`, `from: {"skills": "proficient"}`), weapon mastery (`gives: "mastery"`,
   `from: {"list": [weapon category or ids]}`, count from the table), Divine Order, Primal Order,
   Eldritch Invocations, Metamagic, Hunter's Prey and similar (`gives: "option"`,
   `from: {"options": [Feature, …]}` — each option a full Feature with its own text and grants).
   A count that grows with level is `{"byLevel": [20 numbers]}`.
8. **Tables:** every `byLevel` and `scale.values` has exactly 20 entries (index 0 = level 1). Read
   them from the class table in `.layout.txt`. Spellcasting: `prepared` and `cantrips` byLevel from
   the table, `progression` `full` (bard, cleric, druid, sorcerer, wizard), `half` (paladin,
   ranger), `pact` (warlock); `list` = the class id. Spell slots are computed by the engine — do
   not write them. Do not list the class's spells.
9. **Resources:** `uses` as an Amount (`{"ability": "cha"}`, `{"proficiency": true}`, a number, or
   byLevel), `die` (`"d8"` or `{"byLevel": [...]}`), `recharge` `"short"`/`"long"` or byLevel when
   a later feature changes it (Bardic Inspiration: long until level 4, short from 5 by Font of
   Inspiration).
10. **Check your output** parses as JSON and follows the model. Report: the files written, the
    number of features per class, and every `TODO`.

## Example (abridged)

```json
{
  "id": "bard-bardic-inspiration",
  "name": { "en": "Bardic Inspiration" },
  "level": 1,
  "text": { "en": "You can supernaturally inspire others through words, music, or dance. …" },
  "grants": [
    {
      "kind": "resource",
      "id": "bardic-inspiration",
      "name": { "en": "Bardic Inspiration" },
      "uses": { "ability": "cha" },
      "die": { "byLevel": ["d6", "d6", "d6", "d6", "d8", "…20 entries…"] },
      "recharge": { "byLevel": ["long", "long", "long", "long", "short", "…20 entries…"] }
    }
  ],
  "choices": []
}
```
