import { describe, expect, it } from 'vitest';

// @ts-expect-error -- a plain script module without types
import { segmentSpells } from '../scripts/catalogue/parse-spells.mjs';

// Invented entries in the books' layouts, with the OCR noise of scanned pages.
const english = [
  'EMBER THREAD',
  '1st-level evo cation',
  'Casting Time: 1 action Range: 30 feet Components: V, S, M (a red thread) Duration: Instantaneous',
  'A thread of fire leaps out.',
  'At Higher Levels. More fire.',
  '',
  'GLOOM LANTERN 2nd-level illusion (ritual)',
  'Casting Time: 1 minute Range: Self',
  '',
  'Components: V Duration: Concentration, up to 1 hour',
  'The light dims.',
  'SPARK',
  'Evocation cantrip',
  'Casting Time: 1 action Range: Touch Components: S Duration: 1 round',
  'A spark.',
].join('\n');

const italian = [
  'FILO DI BRACE Invocazione di 1° livello (mago, stregone)',
  'Tempo di lancio: azione Gittata: 9 metri',
  'Componenti: V, S',
  'Durata: istantanea',
  'Un filo di fuoco.',
  'SCINTILLA',
  'Trucchetto di Invocazione (mago)',
  'Tempo di lancio: azione',
  'Gittata: contatto',
  'Componenti: S',
  'Durata: concentrazione, fino a 1 minuto',
  'Una scintilla.',
].join('\n');

describe('segmentSpells', () => {
  it('cuts English entries with OCR noise', () => {
    const spells = segmentSpells(english, 'en');
    expect(spells.map((s: { name: string }) => s.name)).toEqual([
      'EMBER THREAD',
      'GLOOM LANTERN',
      'SPARK',
    ]);
    expect(spells[0]).toMatchObject({
      levelLine: '1st-level evo cation',
      casting: '1 action',
      range: '30 feet',
      components: 'V, S, M (a red thread)',
      duration: 'Instantaneous',
      body: 'A thread of fire leaps out.\nAt Higher Levels. More fire.',
    });
    expect(spells[1]).toMatchObject({
      levelLine: '2nd-level illusion (ritual)',
      casting: '1 minute',
      range: 'Self',
      components: 'V',
      duration: 'Concentration, up to 1 hour',
      body: 'The light dims.',
    });
    expect(spells[2]).toMatchObject({ levelLine: 'Evocation cantrip', body: 'A spark.' });
  });

  it('cuts Italian entries', () => {
    const spells = segmentSpells(italian, 'it');
    expect(spells).toHaveLength(2);
    expect(spells[0]).toMatchObject({
      name: 'FILO DI BRACE',
      levelLine: 'Invocazione di 1° livello (mago, stregone)',
      casting: 'azione',
      range: '9 metri',
      components: 'V, S',
      duration: 'istantanea',
      body: 'Un filo di fuoco.',
    });
    expect(spells[1]).toMatchObject({
      name: 'SCINTILLA',
      levelLine: 'Trucchetto di Invocazione (mago)',
      range: 'contatto',
      duration: 'concentrazione, fino a 1 minuto',
    });
  });
});
