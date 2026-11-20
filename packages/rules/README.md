# @obsidian-plugins/rules

Shared, pure TypeScript for D&D 5e characters: the rules as data (classes, subclasses, species,
backgrounds, feats, armour, weapons — 2014 and 2024) and a calculation engine that turns a
character's choices into its sheet (scores, saves, skills, hit points, armour class, attacks,
spellcasting, resources), every number with its sources. No Obsidian API, no DOM; unit-tested in
Node.

The SRD data in `data/srd-5.2.1/` is from the System Reference Document 5.2.1 by Wizards of the
Coast LLC, licensed under CC-BY-4.0
(https://creativecommons.org/licenses/by/4.0/legalcode).

The German texts in `data/srd-5.2.1/` (the `de` fields) are the official German SRD 5.2.1; its
attribution statement:

> Dieses Werk enthält Material aus dem Systemreferenzdokument 5.2.1 („SRD 5.2.1“) von Wizards of the Coast LLC, verfügbar unter https://www.dndbeyond.com/srd. Das SRD 5.2.1 ist lizenziert gemäß Creative Commons Namensnennung 4.0 International Public License (verfügbar unter https://creativecommons.org/licenses/by/4.0/legalcode.de).

Code licence MIT (see the repository root).
