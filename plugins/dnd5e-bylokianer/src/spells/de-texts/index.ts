// The German texts of all SRD spells, by spell index.

import type { DeText } from '../model';
import { DE_TEXTS_0 } from './level-0';
import { DE_TEXTS_1 } from './level-1';
import { DE_TEXTS_2 } from './level-2';
import { DE_TEXTS_3 } from './level-3';
import { DE_TEXTS_4 } from './level-4';
import { DE_TEXTS_5 } from './level-5';
import { DE_TEXTS_6 } from './level-6';
import { DE_TEXTS_7 } from './level-7';
import { DE_TEXTS_8 } from './level-8';
import { DE_TEXTS_9 } from './level-9';

export const DE_TEXTS: Readonly<Record<string, DeText>> = {
  ...DE_TEXTS_0,
  ...DE_TEXTS_1,
  ...DE_TEXTS_2,
  ...DE_TEXTS_3,
  ...DE_TEXTS_4,
  ...DE_TEXTS_5,
  ...DE_TEXTS_6,
  ...DE_TEXTS_7,
  ...DE_TEXTS_8,
  ...DE_TEXTS_9,
};
