// The SRD 5.2.1 (CC-BY-4.0, Wizards of the Coast) as rules data; see the package README for the
// attribution.

import armor from '../data/srd-5.2.1/armor.json';
import backgrounds from '../data/srd-5.2.1/backgrounds.json';
import classes from '../data/srd-5.2.1/classes.json';
import feats from '../data/srd-5.2.1/feats.json';
import skills from '../data/srd-5.2.1/skills.json';
import species from '../data/srd-5.2.1/species.json';
import subclasses from '../data/srd-5.2.1/subclasses.json';
import weapons from '../data/srd-5.2.1/weapons.json';
import type { RulesData } from './model';

export const SRD_52 = {
  classes,
  subclasses,
  species,
  backgrounds,
  feats,
  armor,
  weapons,
  skills,
} as unknown as RulesData;
