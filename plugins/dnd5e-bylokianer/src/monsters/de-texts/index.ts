// The German texts of all SRD monsters, by monster index.

import type { DeMonsterText } from '../model';
import { DE_TEXTS_CR0 } from './cr-0';
import { DE_TEXTS_CR1 } from './cr-1';
import { DE_TEXTS_CR2 } from './cr-2';
import { DE_TEXTS_CR3 } from './cr-3-4';
import { DE_TEXTS_CR5 } from './cr-5';
import { DE_TEXTS_CR6 } from './cr-6-9';
import { DE_TEXTS_CR10 } from './cr-10-16';
import { DE_TEXTS_CR17 } from './cr-17-30';

export const DE_TEXTS: Readonly<Record<string, DeMonsterText>> = {
  ...DE_TEXTS_CR0,
  ...DE_TEXTS_CR1,
  ...DE_TEXTS_CR2,
  ...DE_TEXTS_CR3,
  ...DE_TEXTS_CR5,
  ...DE_TEXTS_CR6,
  ...DE_TEXTS_CR10,
  ...DE_TEXTS_CR17,
};
