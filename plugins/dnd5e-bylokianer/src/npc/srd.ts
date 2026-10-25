// The 21 nonplayer characters of the System Reference Document 5.1 as stat block YAML in the
// plugin's format (Fantasy Statblocks' keys). SRD 5.1 by Wizards of the Coast, CC-BY-4.0 — see
// NOTICE.md beside this file. Transcribed from the 5e-bits SRD database and checked in tests
// (which caught one error there: the Cult Fanatic has 33 (6d8 + 6) hit points, as in the SRD).

import type { Archetype } from './archetypes';

export const SRD_NPCS: readonly Archetype[] = [
  {
    name: 'Acolyte',
    cr: '1/4',
    source: 'srd',
    yaml: 'name: Acolyte\nsize: Medium\ntype: humanoid\nsubtype: any race\nalignment: any alignment\nac: 10\nhp: 9\nhit_dice: "2d8"\nspeed: "30 ft."\nstats: [10, 10, 10, 10, 14, 11]\nskillsaves:\n  - medicine: 4\n  - religion: 2\nsenses: passive Perception 12\nlanguages: any one language (usually Common)\ncr: "1/4"\ntraits:\n  - name: Spellcasting\n    desc: "The acolyte is a 1st-level spellcaster. Its spellcasting ability is Wisdom (spell save DC 12, +4 to hit with spell attacks). The acolyte has following cleric spells prepared:\\n\\n- Cantrips (at will): light, sacred flame, thaumaturgy\\n- 1st level (3 slots): bless, cure wounds, sanctuary"\nactions:\n  - name: Club\n    desc: "Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 2 (1d4) bludgeoning damage."',
  },
  {
    name: 'Archmage',
    cr: '12',
    source: 'srd',
    yaml: 'name: Archmage\nsize: Medium\ntype: humanoid\nsubtype: any race\nalignment: any alignment\nac: 12\nac_class: "15 with mage armor"\nhp: 99\nhit_dice: "18d8 + 18"\nspeed: "30 ft."\nstats: [10, 14, 12, 20, 15, 16]\nsaves:\n  - int: 9\n  - wis: 6\nskillsaves:\n  - arcana: 13\n  - history: 13\ndamage_resistances: "damage from spells; bludgeoning, piercing, and slashing from nonmagical attacks (from stoneskin)"\nsenses: passive Perception 12\nlanguages: any six languages\ncr: 12\ntraits:\n  - name: Magic Resistance\n    desc: "The archmage has advantage on saving throws against spells and other magical effects."\n  - name: Spellcasting\n    desc: "The archmage is an 18th-level spellcaster. Its spellcasting ability is Intelligence (spell save DC 17, +9 to hit with spell attacks). The archmage can cast disguise self and invisibility at will and has the following wizard spells prepared:\\n\\n- Cantrips (at will): fire bolt, light, mage hand, prestidigitation, shocking grasp\\n- 1st level (4 slots): detect magic, identify, mage armor*, magic missile\\n- 2nd level (3 slots): detect thoughts, mirror image, misty step\\n- 3rd level (3 slots): counterspell, fly, lightning bolt\\n- 4th level (3 slots): banishment, fire shield, stoneskin*\\n- 5th level (3 slots): cone of cold, scrying, wall of force\\n- 6th level (1 slot): globe of invulnerability\\n- 7th level (1 slot): teleport\\n- 8th level (1 slot): mind blank*\\n- 9th level (1 slot): time stop\\n* The archmage casts these spells on itself before combat."\nactions:\n  - name: Dagger\n    desc: "Melee or Ranged Weapon Attack: +6 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 4 (1d4 + 2) piercing damage."',
  },
  {
    name: 'Assassin',
    cr: '8',
    source: 'srd',
    yaml: 'name: Assassin\nsize: Medium\ntype: humanoid\nsubtype: any race\nalignment: any non-good alignment\nac: 15\nac_class: studded leather armor\nhp: 78\nhit_dice: "12d8 + 24"\nspeed: "30 ft."\nstats: [11, 16, 14, 13, 11, 10]\nsaves:\n  - dex: 6\n  - int: 4\nskillsaves:\n  - acrobatics: 6\n  - deception: 3\n  - perception: 3\n  - stealth: 9\ndamage_resistances: poison\nsenses: passive Perception 13\nlanguages: Thieves\' cant plus any two languages\ncr: 8\ntraits:\n  - name: Assassinate\n    desc: "During its first turn, the assassin has advantage on attack rolls against any creature that hasn\'t taken a turn. Any hit the assassin scores against a surprised creature is a critical hit."\n  - name: Evasion\n    desc: "If the assassin is subjected to an effect that allows it to make a Dexterity saving throw to take only half damage, the assassin instead takes no damage if it succeeds on the saving throw, and only half damage if it fails."\n  - name: Sneak Attack (1/Turn)\n    desc: "The assassin deals an extra 13 (4d6) damage when it hits a target with a weapon attack and has advantage on the attack roll, or when the target is within 5 ft. of an ally of the assassin that isn\'t incapacitated and the assassin doesn\'t have disadvantage on the attack roll."\nactions:\n  - name: Multiattack\n    desc: "The assassin makes two shortsword attacks."\n  - name: Shortsword\n    desc: "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 6 (1d6 + 3) piercing damage, and the target must make a DC 15 Constitution saving throw, taking 24 (7d6) poison damage on a failed save, or half as much damage on a successful one."\n  - name: Light Crossbow\n    desc: "Ranged Weapon Attack: +6 to hit, range 80/320 ft., one target. Hit: 7 (1d8 + 3) piercing damage, and the target must make a DC 15 Constitution saving throw, taking 24 (7d6) poison damage on a failed save, or half as much damage on a successful one."',
  },
  {
    name: 'Bandit',
    cr: '1/8',
    source: 'srd',
    yaml: 'name: Bandit\nsize: Medium\ntype: humanoid\nsubtype: any race\nalignment: any non-lawful alignment\nac: 12\nac_class: leather armor\nhp: 11\nhit_dice: "2d8 + 2"\nspeed: "30 ft."\nstats: [11, 12, 12, 10, 10, 10]\nsenses: passive Perception 10\nlanguages: any one language (usually Common)\ncr: "1/8"\nactions:\n  - name: Scimitar\n    desc: "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 4 (1d6 + 1) slashing damage."\n  - name: Light Crossbow\n    desc: "Ranged Weapon Attack: +3 to hit, range 80/320 ft., one target. Hit: 5 (1d8 + 1) piercing damage."',
  },
  {
    name: 'Bandit Captain',
    cr: '2',
    source: 'srd',
    yaml: 'name: Bandit Captain\nsize: Medium\ntype: humanoid\nsubtype: any race\nalignment: any non-lawful alignment\nac: 15\nac_class: studded leather armor\nhp: 65\nhit_dice: "10d8 + 20"\nspeed: "30 ft."\nstats: [15, 16, 14, 14, 11, 14]\nsaves:\n  - str: 4\n  - dex: 5\n  - wis: 2\nskillsaves:\n  - athletics: 4\n  - deception: 4\nsenses: passive Perception 10\nlanguages: any two languages\ncr: 2\nactions:\n  - name: Multiattack\n    desc: "The captain makes three melee attacks: two with its scimitar and one with its dagger. Or the captain makes two ranged attacks with its daggers."\n  - name: Scimitar\n    desc: "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6 + 3) slashing damage."\n  - name: Dagger\n    desc: "Melee or Ranged Weapon Attack: +5 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 5 (1d4 + 3) piercing damage."\nreactions:\n  - name: Parry\n    desc: "The captain adds 2 to its AC against one melee attack that would hit it. To do so, the captain must see the attacker and be wielding a melee weapon."',
  },
  {
    name: 'Berserker',
    cr: '2',
    source: 'srd',
    yaml: 'name: Berserker\nsize: Medium\ntype: humanoid\nsubtype: any race\nalignment: any chaotic alignment\nac: 13\nac_class: hide armor\nhp: 67\nhit_dice: "9d8 + 27"\nspeed: "30 ft."\nstats: [16, 12, 17, 9, 11, 9]\nsenses: passive Perception 10\nlanguages: any one language (usually Common)\ncr: 2\ntraits:\n  - name: Reckless\n    desc: "At the start of its turn, the berserker can gain advantage on all melee weapon attack rolls during that turn, but attack rolls against it have advantage until the start of its next turn."\nactions:\n  - name: Greataxe\n    desc: "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 9 (1d12 + 3) slashing damage."',
  },
  {
    name: 'Commoner',
    cr: '0',
    source: 'srd',
    yaml: 'name: Commoner\nsize: Medium\ntype: humanoid\nsubtype: any race\nalignment: any alignment\nac: 10\nhp: 4\nhit_dice: "1d8"\nspeed: "30 ft."\nstats: [10, 10, 10, 10, 10, 10]\nsenses: passive Perception 10\nlanguages: any one language (usually Common)\ncr: 0\nactions:\n  - name: Club\n    desc: "Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 2 (1d4) bludgeoning damage."',
  },
  {
    name: 'Cult Fanatic',
    cr: '2',
    source: 'srd',
    yaml: 'name: Cult Fanatic\nsize: Medium\ntype: humanoid\nsubtype: any race\nalignment: any non-good alignment\nac: 13\nac_class: leather armor\nhp: 33\nhit_dice: "6d8 + 6"\nspeed: "30 ft."\nstats: [11, 14, 12, 10, 13, 14]\nskillsaves:\n  - deception: 4\n  - persuasion: 4\n  - religion: 2\nsenses: passive Perception 11\nlanguages: any one language (usually Common)\ncr: 2\ntraits:\n  - name: Dark Devotion\n    desc: "The fanatic has advantage on saving throws against being charmed or frightened."\n  - name: Spellcasting\n    desc: "The fanatic is a 4th-level spellcaster. Its spell casting ability is Wisdom (spell save DC 11, +3 to hit with spell attacks). The fanatic has the following cleric spells prepared:\\n\\nCantrips (at will): light, sacred flame, thaumaturgy\\n- 1st level (4 slots): command, inflict wounds, shield of faith\\n- 2nd level (3 slots): hold person, spiritual weapon"\nactions:\n  - name: Multiattack\n    desc: "The fanatic makes two melee attacks."\n  - name: Dagger\n    desc: "Melee or Ranged Weapon Attack: +4 to hit, reach 5 ft. or range 20/60 ft., one creature. Hit: 4 (1d4 + 2) piercing damage."',
  },
  {
    name: 'Cultist',
    cr: '1/8',
    source: 'srd',
    yaml: 'name: Cultist\nsize: Medium\ntype: humanoid\nsubtype: any race\nalignment: any non-good alignment\nac: 12\nac_class: leather armor\nhp: 9\nhit_dice: "2d8"\nspeed: "30 ft."\nstats: [11, 12, 10, 10, 11, 10]\nskillsaves:\n  - deception: 2\n  - religion: 2\nsenses: passive Perception 10\nlanguages: any one language (usually Common)\ncr: "1/8"\ntraits:\n  - name: Dark Devotion\n    desc: "The cultist has advantage on saving throws against being charmed or frightened."\nactions:\n  - name: Scimitar\n    desc: "Melee Weapon Attack: +3 to hit, reach 5 ft., one creature. Hit: 4 (1d6 + 1) slashing damage."',
  },
  {
    name: 'Druid',
    cr: '2',
    source: 'srd',
    yaml: 'name: Druid\nsize: Medium\ntype: humanoid\nsubtype: any race\nalignment: any alignment\nac: 11\nac_class: "16 with barkskin"\nhp: 27\nhit_dice: "5d8 + 5"\nspeed: "30 ft."\nstats: [10, 12, 13, 12, 15, 11]\nskillsaves:\n  - medicine: 4\n  - nature: 3\n  - perception: 4\nsenses: passive Perception 14\nlanguages: Druidic plus any two languages\ncr: 2\ntraits:\n  - name: Spellcasting\n    desc: "The druid is a 4th-level spellcaster. Its spellcasting ability is Wisdom (spell save DC 12, +4 to hit with spell attacks). It has the following druid spells prepared:\\n\\n- Cantrips (at will): druidcraft, produce flame, shillelagh\\n- 1st level (4 slots): entangle, longstrider, speak with animals, thunderwave\\n- 2nd level (3 slots): animal messenger, barkskin"\nactions:\n  - name: Quarterstaff\n    desc: " Melee Weapon Attack: +2 to hit (+4 to hit with shillelagh), reach 5 ft., one target. Hit: 3 (1d6) bludgeoning damage, 4 (1d8) bludgeoning damage if wielded with two hands, or 6 (1d8 + 2) bludgeoning damage with shillelagh."',
  },
  {
    name: 'Gladiator',
    cr: '5',
    source: 'srd',
    yaml: 'name: Gladiator\nsize: Medium\ntype: humanoid\nsubtype: any race\nalignment: any alignment\nac: 16\nac_class: studded leather armor, shield\nhp: 112\nhit_dice: "15d8 + 45"\nspeed: "30 ft."\nstats: [18, 15, 16, 10, 12, 15]\nsaves:\n  - str: 7\n  - dex: 5\n  - con: 6\nskillsaves:\n  - athletics: 10\n  - intimidation: 5\nsenses: passive Perception 11\nlanguages: any one language (usually Common)\ncr: 5\ntraits:\n  - name: Brave\n    desc: "The gladiator has advantage on saving throws against being frightened."\n  - name: Brute\n    desc: "A melee weapon deals one extra die of its damage when the gladiator hits with it (included in the attack)."\nactions:\n  - name: Multiattack\n    desc: "The gladiator makes three melee attacks or two ranged attacks."\n  - name: Spear\n    desc: "Melee or Ranged Weapon Attack: +7 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 11 (2d6 + 4) piercing damage, or 13 (2d8 + 4) piercing damage if used with two hands to make a melee attack."\n  - name: Shield Bash\n    desc: "Melee Weapon Attack: +7 to hit, reach 5 ft., one creature. Hit: 9 (2d4 + 4) bludgeoning damage. If the target is a Medium or smaller creature, it must succeed on a DC 15 Strength saving throw or be knocked prone."\nreactions:\n  - name: Parry\n    desc: "The gladiator adds 3 to its AC against one melee attack that would hit it. To do so, the gladiator must see the attacker and be wielding a melee weapon."',
  },
  {
    name: 'Guard',
    cr: '1/8',
    source: 'srd',
    yaml: 'name: Guard\nsize: Medium\ntype: humanoid\nsubtype: any race\nalignment: any alignment\nac: 16\nac_class: chain shirt, shield\nhp: 11\nhit_dice: "2d8 + 2"\nspeed: "30 ft."\nstats: [13, 12, 12, 10, 11, 10]\nskillsaves:\n  - perception: 2\nsenses: passive Perception 12\nlanguages: any one language (usually Common)\ncr: "1/8"\nactions:\n  - name: Spear\n    desc: "Melee or Ranged Weapon Attack: +3 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 4 (1d6 + 1) piercing damage or 5 (1d8 + 1) piercing damage if used with two hands to make a melee attack."',
  },
  {
    name: 'Knight',
    cr: '3',
    source: 'srd',
    yaml: 'name: Knight\nsize: Medium\ntype: humanoid\nsubtype: any race\nalignment: any alignment\nac: 18\nac_class: plate armor\nhp: 52\nhit_dice: "8d8 + 16"\nspeed: "30 ft."\nstats: [16, 11, 14, 11, 11, 15]\nsaves:\n  - con: 4\n  - wis: 2\nsenses: passive Perception 10\nlanguages: any one language (usually Common)\ncr: 3\ntraits:\n  - name: Brave\n    desc: "The knight has advantage on saving throws against being frightened."\nactions:\n  - name: Multiattack\n    desc: "The knight makes two melee attacks."\n  - name: Greatsword\n    desc: "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d6 + 3) slashing damage."\n  - name: Heavy Crossbow\n    desc: "Ranged Weapon Attack: +2 to hit, range 100/400 ft., one target. Hit: 5 (1d10) piercing damage."\n  - name: Leadership\n    desc: "For 1 minute, the knight can utter a special command or warning whenever a nonhostile creature that it can see within 30 ft. of it makes an attack roll or a saving throw. The creature can add a d4 to its roll provided it can hear and understand the knight. A creature can benefit from only one Leadership die at a time. This effect ends if the knight is incapacitated."\nreactions:\n  - name: Parry\n    desc: "The knight adds 2 to its AC against one melee attack that would hit it. To do so, the knight must see the attacker and be wielding a melee weapon."',
  },
  {
    name: 'Mage',
    cr: '6',
    source: 'srd',
    yaml: 'name: Mage\nsize: Medium\ntype: humanoid\nsubtype: any race\nalignment: any alignment\nac: 12\nac_class: "15 with mage armor"\nhp: 40\nhit_dice: "9d8"\nspeed: "30 ft."\nstats: [9, 14, 11, 17, 12, 11]\nsaves:\n  - int: 6\n  - wis: 4\nskillsaves:\n  - arcana: 6\n  - history: 6\nsenses: passive Perception 11\nlanguages: any four languages\ncr: 6\ntraits:\n  - name: Spellcasting\n    desc: "The mage is a 9th-level spellcaster. Its spellcasting ability is Intelligence (spell save DC 14, +6 to hit with spell attacks). The mage has the following wizard spells prepared:\\n\\n- Cantrips (at will): fire bolt, light, mage hand, prestidigitation\\n- 1st level (4 slots): detect magic, mage armor, magic missile, shield\\n- 2nd level (3 slots): misty step, suggestion\\n- 3rd level (3 slots): counterspell, fireball, fly\\n- 4th level (3 slots): greater invisibility, ice storm\\n- 5th level (1 slot): cone of cold"\nactions:\n  - name: Dagger\n    desc: "Melee or Ranged Weapon Attack: +5 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 4 (1d4 + 2) piercing damage."',
  },
  {
    name: 'Noble',
    cr: '1/8',
    source: 'srd',
    yaml: 'name: Noble\nsize: Medium\ntype: humanoid\nsubtype: any race\nalignment: any alignment\nac: 15\nac_class: breastplate\nhp: 9\nhit_dice: "2d8"\nspeed: "30 ft."\nstats: [11, 12, 11, 12, 14, 16]\nskillsaves:\n  - deception: 5\n  - insight: 4\n  - persuasion: 5\nsenses: passive Perception 12\nlanguages: any two languages\ncr: "1/8"\nactions:\n  - name: Rapier\n    desc: "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 5 (1d8 + 1) piercing damage."\nreactions:\n  - name: Parry\n    desc: "The noble adds 2 to its AC against one melee attack that would hit it. To do so, the noble must see the attacker and be wielding a melee weapon."',
  },
  {
    name: 'Priest',
    cr: '2',
    source: 'srd',
    yaml: 'name: Priest\nsize: Medium\ntype: humanoid\nsubtype: any race\nalignment: any alignment\nac: 13\nac_class: chain shirt\nhp: 27\nhit_dice: "5d8 + 5"\nspeed: "25 ft."\nstats: [10, 10, 12, 13, 16, 13]\nskillsaves:\n  - medicine: 7\n  - persuasion: 3\n  - religion: 4\nsenses: passive Perception 13\nlanguages: any two languages\ncr: 2\ntraits:\n  - name: Divine Eminence\n    desc: "As a bonus action, the priest can expend a spell slot to cause its melee weapon attacks to magically deal an extra 10 (3d6) radiant damage to a target on a hit. This benefit lasts until the end of the turn. If the priest expends a spell slot of 2nd level or higher, the extra damage increases by 1d6 for each level above 1st."\n  - name: Spellcasting\n    desc: "The priest is a 5th-level spellcaster. Its spellcasting ability is Wisdom (spell save DC 13, +5 to hit with spell attacks). The priest has the following cleric spells prepared:\\n\\n- Cantrips (at will): light, sacred flame, thaumaturgy\\n- 1st level (4 slots): cure wounds, guiding bolt, sanctuary\\n- 2nd level (3 slots): lesser restoration, spiritual weapon\\n- 3rd level (2 slots): dispel magic, spirit guardians"\nactions:\n  - name: Mace\n    desc: "Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 3 (1d6) bludgeoning damage."',
  },
  {
    name: 'Scout',
    cr: '1/2',
    source: 'srd',
    yaml: 'name: Scout\nsize: Medium\ntype: humanoid\nsubtype: any race\nalignment: any alignment\nac: 13\nac_class: leather armor\nhp: 16\nhit_dice: "3d8 + 3"\nspeed: "30 ft."\nstats: [11, 14, 12, 11, 13, 11]\nskillsaves:\n  - nature: 4\n  - perception: 5\n  - stealth: 6\n  - survival: 5\nsenses: passive Perception 15\nlanguages: any one language (usually Common)\ncr: "1/2"\ntraits:\n  - name: Keen Hearing and Sight\n    desc: "The scout has advantage on Wisdom (Perception) checks that rely on hearing or sight."\nactions:\n  - name: Multiattack\n    desc: "The scout makes two melee attacks or two ranged attacks."\n  - name: Shortsword\n    desc: "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) piercing damage."\n  - name: Longbow\n    desc: "Ranged Weapon Attack: +4 to hit, range 150/600 ft., one target. Hit: 6 (1d8 + 2) piercing damage."',
  },
  {
    name: 'Spy',
    cr: '1',
    source: 'srd',
    yaml: 'name: Spy\nsize: Medium\ntype: humanoid\nsubtype: any race\nalignment: any alignment\nac: 12\nhp: 27\nhit_dice: "6d8"\nspeed: "30 ft."\nstats: [10, 15, 10, 12, 14, 16]\nskillsaves:\n  - deception: 5\n  - insight: 4\n  - investigation: 5\n  - perception: 6\n  - persuasion: 5\n  - stealth: 4\nsenses: passive Perception 16\nlanguages: any two languages\ncr: 1\ntraits:\n  - name: Cunning Action\n    desc: "On each of its turns, the spy can use a bonus action to take the Dash, Disengage, or Hide action."\n  - name: Sneak Attack (1/Turn)\n    desc: "The spy deals an extra 7 (2d6) damage when it hits a target with a weapon attack and has advantage on the attack roll, or when the target is within 5 ft. of an ally of the spy that isn\'t incapacitated and the spy doesn\'t have disadvantage on the attack roll."\nactions:\n  - name: Multiattack\n    desc: "The spy makes two melee attacks."\n  - name: Shortsword\n    desc: "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) piercing damage."\n  - name: Hand Crossbow\n    desc: "Ranged Weapon Attack: +4 to hit, range 30/120 ft., one target. Hit: 5 (1d6 + 2) piercing damage."',
  },
  {
    name: 'Thug',
    cr: '1/2',
    source: 'srd',
    yaml: 'name: Thug\nsize: Medium\ntype: humanoid\nsubtype: any race\nalignment: any non-good alignment\nac: 11\nac_class: leather armor\nhp: 32\nhit_dice: "5d8 + 10"\nspeed: "30 ft."\nstats: [15, 11, 14, 10, 10, 11]\nskillsaves:\n  - intimidation: 2\nsenses: passive Perception 10\nlanguages: any one language (usually Common)\ncr: "1/2"\ntraits:\n  - name: Pack Tactics\n    desc: "The thug has advantage on an attack roll against a creature if at least one of the thug\'s allies is within 5 ft. of the creature and the ally isn\'t incapacitated."\nactions:\n  - name: Multiattack\n    desc: "The thug makes two melee attacks."\n  - name: Mace\n    desc: "Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 5 (1d6 + 2) bludgeoning damage."\n  - name: Heavy Crossbow\n    desc: "Ranged Weapon Attack: +2 to hit, range 100/400 ft., one target. Hit: 5 (1d10) piercing damage."',
  },
  {
    name: 'Tribal Warrior',
    cr: '1/8',
    source: 'srd',
    yaml: 'name: Tribal Warrior\nsize: Medium\ntype: humanoid\nsubtype: any race\nalignment: any alignment\nac: 12\nac_class: hide armor\nhp: 11\nhit_dice: "2d8 + 2"\nspeed: "30 ft."\nstats: [13, 11, 12, 8, 11, 8]\nsenses: passive Perception 10\nlanguages: any one language\ncr: "1/8"\ntraits:\n  - name: Pack Tactics\n    desc: "The warrior has advantage on an attack roll against a creature if at least one of the warrior\'s allies is within 5 ft. of the creature and the ally isn\'t incapacitated."\nactions:\n  - name: Spear\n    desc: "Melee or Ranged Weapon Attack: +3 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 4 (1d6 + 1) piercing damage, or 5 (1d8 + 1) piercing damage if used with two hands to make a melee attack."',
  },
  {
    name: 'Veteran',
    cr: '3',
    source: 'srd',
    yaml: 'name: Veteran\nsize: Medium\ntype: humanoid\nsubtype: any race\nalignment: any alignment\nac: 17\nac_class: splint armor\nhp: 58\nhit_dice: "9d8 + 18"\nspeed: "30 ft."\nstats: [16, 13, 14, 10, 11, 10]\nskillsaves:\n  - athletics: 5\n  - perception: 2\nsenses: passive Perception 12\nlanguages: any one language (usually Common)\ncr: 3\nactions:\n  - name: Multiattack\n    desc: "The veteran makes two longsword attacks. If it has a shortsword drawn, it can also make a shortsword attack."\n  - name: Longsword\n    desc: "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8 + 3) slashing damage, or 8 (1d10 + 3) slashing damage if used with two hands."\n  - name: Shortsword\n    desc: "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6 + 3) piercing damage."\n  - name: Heavy Crossbow\n    desc: "Ranged Weapon Attack: +3 to hit, range 100/400 ft., one target. Hit: 6 (1d10 + 1) piercing damage."',
  },
];
