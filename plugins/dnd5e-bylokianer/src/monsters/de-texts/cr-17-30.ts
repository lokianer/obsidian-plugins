// German texts of the SRD monsters of challenge ratings 17 to 30: traits, actions, reactions and legendary
// actions. Our own translation of the SRD 5.1, CC-BY-4.0 (see NOTICE.md).

import type { DeMonsterText } from '../model';

export const DE_TEXTS_CR17: Readonly<Record<string, DeMonsterText>> = {
  'adult-gold-dragon': {
    traits: [
      ['Amphibisch', 'Der Drache kann Luft und Wasser atmen.'],
      [
        'Legendäre Resistenz (3-mal täglich)',
        'Misslingt dem Drachen ein Rettungswurf, kann er sich entscheiden, ihn stattdessen zu bestehen.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Drache kann seine Furchterregende Präsenz einsetzen. Dann führt er drei Angriffe aus: einen mit seinem Biss und zwei mit seinen Klauen.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +14 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 19 (2W10 + 8) Stichschaden.',
      ],
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +14 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 15 (2W6 + 8) Hiebschaden.',
      ],
      [
        'Schwanz',
        'Nahkampf-Waffenangriff: +14 auf Treffer, Reichweite 4,5 m, ein Ziel. Treffer: 17 (2W8 + 8) Wuchtschaden.',
      ],
      [
        'Furchterregende Präsenz',
        'Jede Kreatur nach Wahl des Drachen im Umkreis von 36 m um ihn, die sich des Drachen bewusst ist, muss einen Weisheitsrettungswurf mit SG 21 bestehen, sonst ist sie 1 Minute lang verängstigt. Eine Kreatur kann den Rettungswurf am Ende jedes ihrer Züge wiederholen und beendet die Wirkung bei einem Erfolg für sich. Ist der Rettungswurf einer Kreatur erfolgreich oder endet die Wirkung für sie, ist die Kreatur für die nächsten 24 Stunden immun gegen die Furchterregende Präsenz des Drachen.',
      ],
      [
        'Odemwaffen (Aufladung 5–6)',
        'Der Drache setzt eine der folgenden Odemwaffen ein.\nFeuerodem. Der Drache atmet Feuer in einem 18-m-Kegel aus. Jede Kreatur in diesem Bereich muss einen Geschicklichkeitsrettungswurf mit SG 21 ablegen. Bei einem Misserfolg erleidet sie 66 (12W10) Feuerschaden, bei einem Erfolg die Hälfte.\nSchwächender Odem. Der Drache atmet Gas in einem 18-m-Kegel aus. Jede Kreatur in diesem Bereich muss einen Stärkerettungswurf mit SG 21 bestehen, sonst ist sie 1 Minute lang bei stärkebasierten Angriffswürfen, Stärkewürfen und Stärkerettungswürfen im Nachteil. Eine Kreatur kann den Rettungswurf am Ende jedes ihrer Züge wiederholen und beendet die Wirkung bei einem Erfolg für sich.',
      ],
    ],
    legendary:
      'Der Drache kann 3 legendäre Aktionen ausführen und wählt dabei aus den unten aufgeführten Optionen. Es kann jeweils nur eine legendäre Aktion eingesetzt werden, und nur am Ende des Zuges einer anderen Kreatur. Der Drache erhält verbrauchte legendäre Aktionen zu Beginn seines Zuges zurück.',
    legendaryActions: [
      ['Wahrnehmen', 'Der Drache legt einen Weisheitswurf (Wahrnehmung) ab.'],
      ['Schwanzangriff', 'Der Drache führt einen Schwanzangriff aus.'],
      [
        'Flügelangriff (kostet 2 Aktionen)',
        'Der Drache schlägt mit den Flügeln. Jede Kreatur im Umkreis von 3 m um den Drachen muss einen Geschicklichkeitsrettungswurf mit SG 22 bestehen, sonst erleidet sie 15 (2W6 + 8) Wuchtschaden und wird zu Boden geworfen. Der Drache kann dann bis zur Hälfte seiner Flugbewegungsrate fliegen.',
      ],
    ],
  },
  'adult-red-dragon': {
    traits: [
      [
        'Legendäre Resistenz (3-mal täglich)',
        'Misslingt dem Drachen ein Rettungswurf, kann er sich entscheiden, ihn stattdessen zu bestehen.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Drache kann seine Furchterregende Präsenz einsetzen. Dann führt er drei Angriffe aus: einen mit seinem Biss und zwei mit seinen Klauen.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +14 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 19 (2W10 + 8) Stichschaden plus 7 (2W6) Feuerschaden.',
      ],
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +14 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 15 (2W6 + 8) Hiebschaden.',
      ],
      [
        'Schwanz',
        'Nahkampf-Waffenangriff: +14 auf Treffer, Reichweite 4,5 m, ein Ziel. Treffer: 17 (2W8 + 8) Wuchtschaden.',
      ],
      [
        'Furchterregende Präsenz',
        'Jede Kreatur nach Wahl des Drachen im Umkreis von 36 m um ihn, die sich des Drachen bewusst ist, muss einen Weisheitsrettungswurf mit SG 19 bestehen, sonst ist sie 1 Minute lang verängstigt. Eine Kreatur kann den Rettungswurf am Ende jedes ihrer Züge wiederholen und beendet die Wirkung bei einem Erfolg für sich. Ist der Rettungswurf einer Kreatur erfolgreich oder endet die Wirkung für sie, ist die Kreatur für die nächsten 24 Stunden immun gegen die Furchterregende Präsenz des Drachen.',
      ],
      [
        'Feuerodem (Aufladung 5–6)',
        'Der Drache atmet Feuer in einem 18-m-Kegel aus. Jede Kreatur in diesem Bereich muss einen Geschicklichkeitsrettungswurf mit SG 21 ablegen. Bei einem Misserfolg erleidet sie 63 (18W6) Feuerschaden, bei einem Erfolg die Hälfte.',
      ],
    ],
    legendary:
      'Der Drache kann 3 legendäre Aktionen ausführen und wählt dabei aus den unten aufgeführten Optionen. Es kann jeweils nur eine legendäre Aktion eingesetzt werden, und nur am Ende des Zuges einer anderen Kreatur. Der Drache erhält verbrauchte legendäre Aktionen zu Beginn seines Zuges zurück.',
    legendaryActions: [
      ['Wahrnehmen', 'Der Drache legt einen Weisheitswurf (Wahrnehmung) ab.'],
      ['Schwanzangriff', 'Der Drache führt einen Schwanzangriff aus.'],
      [
        'Flügelangriff (kostet 2 Aktionen)',
        'Der Drache schlägt mit den Flügeln. Jede Kreatur im Umkreis von 3 m um den Drachen muss einen Geschicklichkeitsrettungswurf mit SG 22 bestehen, sonst erleidet sie 15 (2W6 + 8) Wuchtschaden und wird zu Boden geworfen. Der Drache kann dann bis zur Hälfte seiner Flugbewegungsrate fliegen.',
      ],
    ],
  },
  'ancient-black-dragon': {
    traits: [
      ['Amphibisch', 'Der Drache kann Luft und Wasser atmen.'],
      [
        'Legendäre Resistenz (3-mal täglich)',
        'Misslingt dem Drachen ein Rettungswurf, kann er sich entscheiden, ihn stattdessen zu bestehen.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Drache kann seine Furchterregende Präsenz einsetzen. Dann führt er drei Angriffe aus: einen mit seinem Biss und zwei mit seinen Klauen.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +15 auf Treffer, Reichweite 4,5 m, ein Ziel. Treffer: 19 (2W10 + 8) Stichschaden plus 9 (2W8) Säureschaden.',
      ],
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +15 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 15 (2W6 + 8) Hiebschaden.',
      ],
      [
        'Schwanz',
        'Nahkampf-Waffenangriff: +15 auf Treffer, Reichweite 6 m, ein Ziel. Treffer: 17 (2W8 + 8) Wuchtschaden.',
      ],
      [
        'Furchterregende Präsenz',
        'Jede Kreatur nach Wahl des Drachen im Umkreis von 36 m um ihn, die sich des Drachen bewusst ist, muss einen Weisheitsrettungswurf mit SG 19 bestehen, sonst ist sie 1 Minute lang verängstigt. Eine Kreatur kann den Rettungswurf am Ende jedes ihrer Züge wiederholen und beendet die Wirkung bei einem Erfolg für sich. Ist der Rettungswurf einer Kreatur erfolgreich oder endet die Wirkung für sie, ist die Kreatur für die nächsten 24 Stunden immun gegen die Furchterregende Präsenz des Drachen.',
      ],
      [
        'Säureodem (Aufladung 5–6)',
        'Der Drache atmet Säure in einer 27-m-Linie aus, die 3 m breit ist. Jede Kreatur in dieser Linie muss einen Geschicklichkeitsrettungswurf mit SG 22 ablegen. Bei einem Misserfolg erleidet sie 67 (15W8) Säureschaden, bei einem Erfolg die Hälfte.',
      ],
    ],
    legendary:
      'Der Drache kann 3 legendäre Aktionen ausführen und wählt dabei aus den unten aufgeführten Optionen. Es kann jeweils nur eine legendäre Aktion eingesetzt werden, und nur am Ende des Zuges einer anderen Kreatur. Der Drache erhält verbrauchte legendäre Aktionen zu Beginn seines Zuges zurück.',
    legendaryActions: [
      ['Wahrnehmen', 'Der Drache legt einen Weisheitswurf (Wahrnehmung) ab.'],
      ['Schwanzangriff', 'Der Drache führt einen Schwanzangriff aus.'],
      [
        'Flügelangriff (kostet 2 Aktionen)',
        'Der Drache schlägt mit den Flügeln. Jede Kreatur im Umkreis von 4,5 m um den Drachen muss einen Geschicklichkeitsrettungswurf mit SG 23 bestehen, sonst erleidet sie 15 (2W6 + 8) Wuchtschaden und wird zu Boden geworfen. Der Drache kann dann bis zur Hälfte seiner Flugbewegungsrate fliegen.',
      ],
    ],
  },
  'ancient-blue-dragon': {
    traits: [
      [
        'Legendäre Resistenz (3-mal täglich)',
        'Misslingt dem Drachen ein Rettungswurf, kann er sich entscheiden, ihn stattdessen zu bestehen.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Drache kann seine Furchterregende Präsenz einsetzen. Dann führt er drei Angriffe aus: einen mit seinem Biss und zwei mit seinen Klauen.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +16 auf Treffer, Reichweite 4,5 m, ein Ziel. Treffer: 20 (2W10 + 9) Stichschaden plus 11 (2W10) Blitzschaden.',
      ],
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +16 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 16 (2W6 + 9) Hiebschaden.',
      ],
      [
        'Schwanz',
        'Nahkampf-Waffenangriff: +16 auf Treffer, Reichweite 6 m, ein Ziel. Treffer: 18 (2W8 + 9) Wuchtschaden.',
      ],
      [
        'Furchterregende Präsenz',
        'Jede Kreatur nach Wahl des Drachen im Umkreis von 36 m um ihn, die sich des Drachen bewusst ist, muss einen Weisheitsrettungswurf mit SG 20 bestehen, sonst ist sie 1 Minute lang verängstigt. Eine Kreatur kann den Rettungswurf am Ende jedes ihrer Züge wiederholen und beendet die Wirkung bei einem Erfolg für sich. Ist der Rettungswurf einer Kreatur erfolgreich oder endet die Wirkung für sie, ist die Kreatur für die nächsten 24 Stunden immun gegen die Furchterregende Präsenz des Drachen.',
      ],
      [
        'Blitzodem (Aufladung 5–6)',
        'Der Drache atmet Blitze in einer 36-m-Linie aus, die 3 m breit ist. Jede Kreatur in dieser Linie muss einen Geschicklichkeitsrettungswurf mit SG 23 ablegen. Bei einem Misserfolg erleidet sie 88 (16W10) Blitzschaden, bei einem Erfolg die Hälfte.',
      ],
    ],
    legendary:
      'Der Drache kann 3 legendäre Aktionen ausführen und wählt dabei aus den unten aufgeführten Optionen. Es kann jeweils nur eine legendäre Aktion eingesetzt werden, und nur am Ende des Zuges einer anderen Kreatur. Der Drache erhält verbrauchte legendäre Aktionen zu Beginn seines Zuges zurück.',
    legendaryActions: [
      ['Wahrnehmen', 'Der Drache legt einen Weisheitswurf (Wahrnehmung) ab.'],
      ['Schwanzangriff', 'Der Drache führt einen Schwanzangriff aus.'],
      [
        'Flügelangriff (kostet 2 Aktionen)',
        'Der Drache schlägt mit den Flügeln. Jede Kreatur im Umkreis von 4,5 m um den Drachen muss einen Geschicklichkeitsrettungswurf mit SG 24 bestehen, sonst erleidet sie 16 (2W6 + 9) Wuchtschaden und wird zu Boden geworfen. Der Drache kann dann bis zur Hälfte seiner Flugbewegungsrate fliegen.',
      ],
    ],
  },
  'ancient-brass-dragon': {
    traits: [
      [
        'Legendäre Resistenz (3-mal täglich)',
        'Misslingt dem Drachen ein Rettungswurf, kann er sich entscheiden, ihn stattdessen zu bestehen.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Drache kann seine Furchterregende Präsenz einsetzen. Dann führt er drei Angriffe aus: einen mit seinem Biss und zwei mit seinen Klauen.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +14 auf Treffer, Reichweite 4,5 m, ein Ziel. Treffer: 19 (2W10 + 8) Stichschaden.',
      ],
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +14 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 15 (2W6 + 8) Hiebschaden.',
      ],
      [
        'Schwanz',
        'Nahkampf-Waffenangriff: +14 auf Treffer, Reichweite 6 m, ein Ziel. Treffer: 17 (2W8 + 8) Wuchtschaden.',
      ],
      [
        'Furchterregende Präsenz',
        'Jede Kreatur nach Wahl des Drachen im Umkreis von 36 m um ihn, die sich des Drachen bewusst ist, muss einen Weisheitsrettungswurf mit SG 18 bestehen, sonst ist sie 1 Minute lang verängstigt. Eine Kreatur kann den Rettungswurf am Ende jedes ihrer Züge wiederholen und beendet die Wirkung bei einem Erfolg für sich. Ist der Rettungswurf einer Kreatur erfolgreich oder endet die Wirkung für sie, ist die Kreatur für die nächsten 24 Stunden immun gegen die Furchterregende Präsenz des Drachen.',
      ],
      [
        'Odemwaffen (Aufladung 5–6)',
        'Der Drache setzt eine der folgenden Odemwaffen ein:\nFeuerodem. Der Drache atmet Feuer in einer 27-m-Linie aus, die 3 m breit ist. Jede Kreatur in dieser Linie muss einen Geschicklichkeitsrettungswurf mit SG 21 ablegen. Bei einem Misserfolg erleidet sie 56 (16W6) Feuerschaden, bei einem Erfolg die Hälfte.\nSchlafodem. Der Drache atmet Schlafgas in einem 27-m-Kegel aus. Jede Kreatur in diesem Bereich muss einen Konstitutionsrettungswurf mit SG 21 bestehen, sonst wird sie für 10 Minuten bewusstlos. Die Wirkung endet für eine Kreatur, wenn sie Schaden erleidet oder jemand eine Aktion nutzt, um sie zu wecken.',
      ],
      [
        'Gestalt wandeln',
        'Der Drache verwandelt sich magisch in einen Humanoiden oder ein Tier mit einem Herausforderungsgrad, der nicht höher ist als sein eigener, oder zurück in seine wahre Gestalt. Stirbt er, nimmt er wieder seine wahre Gestalt an. Ausrüstung, die er trägt oder hält, wird von der neuen Gestalt aufgenommen oder getragen (nach Wahl des Drachen).\nIn einer neuen Gestalt behält der Drache seine Gesinnung, Trefferpunkte, Trefferwürfel, Fähigkeit zu sprechen, Übungen, Legendäre Resistenz, Hortaktionen sowie seine Intelligenz-, Weisheits- und Charismawerte, außerdem diese Aktion. Seine übrigen Spielwerte und Fähigkeiten werden durch die der neuen Gestalt ersetzt, mit Ausnahme von Klassenmerkmalen oder legendären Aktionen dieser Gestalt.',
      ],
    ],
    legendary:
      'Der Drache kann 3 legendäre Aktionen ausführen und wählt dabei aus den unten aufgeführten Optionen. Es kann jeweils nur eine legendäre Aktion eingesetzt werden, und nur am Ende des Zuges einer anderen Kreatur. Der Drache erhält verbrauchte legendäre Aktionen zu Beginn seines Zuges zurück.',
    legendaryActions: [
      ['Wahrnehmen', 'Der Drache legt einen Weisheitswurf (Wahrnehmung) ab.'],
      ['Schwanzangriff', 'Der Drache führt einen Schwanzangriff aus.'],
      [
        'Flügelangriff (kostet 2 Aktionen)',
        'Der Drache schlägt mit den Flügeln. Jede Kreatur im Umkreis von 4,5 m um den Drachen muss einen Geschicklichkeitsrettungswurf mit SG 22 bestehen, sonst erleidet sie 15 (2W6 + 8) Wuchtschaden und wird zu Boden geworfen. Der Drache kann dann bis zur Hälfte seiner Flugbewegungsrate fliegen.',
      ],
    ],
  },
  'ancient-bronze-dragon': {
    traits: [
      ['Amphibisch', 'Der Drache kann Luft und Wasser atmen.'],
      [
        'Legendäre Resistenz (3-mal täglich)',
        'Misslingt dem Drachen ein Rettungswurf, kann er sich entscheiden, ihn stattdessen zu bestehen.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Drache kann seine Furchterregende Präsenz einsetzen. Dann führt er drei Angriffe aus: einen mit seinem Biss und zwei mit seinen Klauen.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +16 auf Treffer, Reichweite 4,5 m, ein Ziel. Treffer: 20 (2W10 + 9) Stichschaden.',
      ],
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +16 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 16 (2W6 + 9) Hiebschaden.',
      ],
      [
        'Schwanz',
        'Nahkampf-Waffenangriff: +16 auf Treffer, Reichweite 6 m, ein Ziel. Treffer: 18 (2W8 + 9) Wuchtschaden.',
      ],
      [
        'Furchterregende Präsenz',
        'Jede Kreatur nach Wahl des Drachen im Umkreis von 36 m um ihn, die sich des Drachen bewusst ist, muss einen Weisheitsrettungswurf mit SG 20 bestehen, sonst ist sie 1 Minute lang verängstigt. Eine Kreatur kann den Rettungswurf am Ende jedes ihrer Züge wiederholen und beendet die Wirkung bei einem Erfolg für sich. Ist der Rettungswurf einer Kreatur erfolgreich oder endet die Wirkung für sie, ist die Kreatur für die nächsten 24 Stunden immun gegen die Furchterregende Präsenz des Drachen.',
      ],
      [
        'Odemwaffen (Aufladung 5–6)',
        'Der Drache setzt eine der folgenden Odemwaffen ein.\nBlitzodem. Der Drache atmet Blitze in einer 36-m-Linie aus, die 3 m breit ist. Jede Kreatur in dieser Linie muss einen Geschicklichkeitsrettungswurf mit SG 23 ablegen. Bei einem Misserfolg erleidet sie 88 (16W10) Blitzschaden, bei einem Erfolg die Hälfte.\nAbstoßungsodem. Der Drache atmet abstoßende Energie in einem 9-m-Kegel aus. Jede Kreatur in diesem Bereich muss einen Stärkerettungswurf mit SG 23 ablegen. Bei einem Misserfolg wird die Kreatur 18 m von dem Drachen weggestoßen.',
      ],
      [
        'Gestalt wandeln',
        'Der Drache verwandelt sich magisch in einen Humanoiden oder ein Tier mit einem Herausforderungsgrad, der nicht höher ist als sein eigener, oder zurück in seine wahre Gestalt. Stirbt er, nimmt er wieder seine wahre Gestalt an. Ausrüstung, die er trägt oder hält, wird von der neuen Gestalt aufgenommen oder getragen (nach Wahl des Drachen).\nIn einer neuen Gestalt behält der Drache seine Gesinnung, Trefferpunkte, Trefferwürfel, Fähigkeit zu sprechen, Übungen, Legendäre Resistenz, Hortaktionen sowie seine Intelligenz-, Weisheits- und Charismawerte, außerdem diese Aktion. Seine übrigen Spielwerte und Fähigkeiten werden durch die der neuen Gestalt ersetzt, mit Ausnahme von Klassenmerkmalen oder legendären Aktionen dieser Gestalt.',
      ],
    ],
    legendary:
      'Der Drache kann 3 legendäre Aktionen ausführen und wählt dabei aus den unten aufgeführten Optionen. Es kann jeweils nur eine legendäre Aktion eingesetzt werden, und nur am Ende des Zuges einer anderen Kreatur. Der Drache erhält verbrauchte legendäre Aktionen zu Beginn seines Zuges zurück.',
    legendaryActions: [
      ['Wahrnehmen', 'Der Drache legt einen Weisheitswurf (Wahrnehmung) ab.'],
      ['Schwanzangriff', 'Der Drache führt einen Schwanzangriff aus.'],
      [
        'Flügelangriff (kostet 2 Aktionen)',
        'Der Drache schlägt mit den Flügeln. Jede Kreatur im Umkreis von 4,5 m um den Drachen muss einen Geschicklichkeitsrettungswurf mit SG 24 bestehen, sonst erleidet sie 16 (2W6 + 9) Wuchtschaden und wird zu Boden geworfen. Der Drache kann dann bis zur Hälfte seiner Flugbewegungsrate fliegen.',
      ],
    ],
  },
  'ancient-copper-dragon': {
    traits: [
      [
        'Legendäre Resistenz (3-mal täglich)',
        'Misslingt dem Drachen ein Rettungswurf, kann er sich entscheiden, ihn stattdessen zu bestehen.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Drache kann seine Furchterregende Präsenz einsetzen. Dann führt er drei Angriffe aus: einen mit seinem Biss und zwei mit seinen Klauen.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +15 auf Treffer, Reichweite 4,5 m, ein Ziel. Treffer: 19 (2W10 + 8) Stichschaden.',
      ],
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +15 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 15 (2W6 + 8) Hiebschaden.',
      ],
      [
        'Schwanz',
        'Nahkampf-Waffenangriff: +15 auf Treffer, Reichweite 6 m, ein Ziel. Treffer: 17 (2W8 + 8) Wuchtschaden.',
      ],
      [
        'Furchterregende Präsenz',
        'Jede Kreatur nach Wahl des Drachen im Umkreis von 36 m um ihn, die sich des Drachen bewusst ist, muss einen Weisheitsrettungswurf mit SG 19 bestehen, sonst ist sie 1 Minute lang verängstigt. Eine Kreatur kann den Rettungswurf am Ende jedes ihrer Züge wiederholen und beendet die Wirkung bei einem Erfolg für sich. Ist der Rettungswurf einer Kreatur erfolgreich oder endet die Wirkung für sie, ist die Kreatur für die nächsten 24 Stunden immun gegen die Furchterregende Präsenz des Drachen.',
      ],
      [
        'Odemwaffen (Aufladung 5–6)',
        'Der Drache setzt eine der folgenden Odemwaffen ein.\nSäureodem. Der Drache atmet Säure in einer 27-m-Linie aus, die 3 m breit ist. Jede Kreatur in dieser Linie muss einen Geschicklichkeitsrettungswurf mit SG 22 ablegen. Bei einem Misserfolg erleidet sie 63 (14W8) Säureschaden, bei einem Erfolg die Hälfte.\nVerlangsamender Odem. Der Drache atmet Gas in einem 27-m-Kegel aus. Jede Kreatur in diesem Bereich muss einen Konstitutionsrettungswurf mit SG 22 ablegen. Bei einem Misserfolg kann die Kreatur keine Reaktionen ausführen, ihre Bewegungsrate ist halbiert, und sie kann in ihrem Zug nicht mehr als einen Angriff ausführen. Außerdem kann die Kreatur in ihrem Zug entweder eine Aktion oder eine Bonusaktion nutzen, aber nicht beides. Diese Wirkungen halten 1 Minute lang an. Die Kreatur kann den Rettungswurf am Ende jedes ihrer Züge wiederholen und beendet die Wirkungen bei einem Erfolg für sich.',
      ],
      [
        'Gestalt wandeln',
        'Der Drache verwandelt sich magisch in einen Humanoiden oder ein Tier mit einem Herausforderungsgrad, der nicht höher ist als sein eigener, oder zurück in seine wahre Gestalt. Stirbt er, nimmt er wieder seine wahre Gestalt an. Ausrüstung, die er trägt oder hält, wird von der neuen Gestalt aufgenommen oder getragen (nach Wahl des Drachen).\nIn einer neuen Gestalt behält der Drache seine Gesinnung, Trefferpunkte, Trefferwürfel, Fähigkeit zu sprechen, Übungen, Legendäre Resistenz, Hortaktionen sowie seine Intelligenz-, Weisheits- und Charismawerte, außerdem diese Aktion. Seine übrigen Spielwerte und Fähigkeiten werden durch die der neuen Gestalt ersetzt, mit Ausnahme von Klassenmerkmalen oder legendären Aktionen dieser Gestalt.',
      ],
    ],
    legendary:
      'Der Drache kann 3 legendäre Aktionen ausführen und wählt dabei aus den unten aufgeführten Optionen. Es kann jeweils nur eine legendäre Aktion eingesetzt werden, und nur am Ende des Zuges einer anderen Kreatur. Der Drache erhält verbrauchte legendäre Aktionen zu Beginn seines Zuges zurück.',
    legendaryActions: [
      ['Wahrnehmen', 'Der Drache legt einen Weisheitswurf (Wahrnehmung) ab.'],
      ['Schwanzangriff', 'Der Drache führt einen Schwanzangriff aus.'],
      [
        'Flügelangriff (kostet 2 Aktionen)',
        'Der Drache schlägt mit den Flügeln. Jede Kreatur im Umkreis von 4,5 m um den Drachen muss einen Geschicklichkeitsrettungswurf mit SG 23 bestehen, sonst erleidet sie 15 (2W6 + 8) Wuchtschaden und wird zu Boden geworfen. Der Drache kann dann bis zur Hälfte seiner Flugbewegungsrate fliegen.',
      ],
    ],
  },
  'ancient-gold-dragon': {
    traits: [
      ['Amphibisch', 'Der Drache kann Luft und Wasser atmen.'],
      [
        'Legendäre Resistenz (3-mal täglich)',
        'Misslingt dem Drachen ein Rettungswurf, kann er sich entscheiden, ihn stattdessen zu bestehen.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Drache kann seine Furchterregende Präsenz einsetzen. Dann führt er drei Angriffe aus: einen mit seinem Biss und zwei mit seinen Klauen.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +17 auf Treffer, Reichweite 4,5 m, ein Ziel. Treffer: 21 (2W10 + 10) Stichschaden.',
      ],
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +17 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 17 (2W6 + 10) Hiebschaden.',
      ],
      [
        'Schwanz',
        'Nahkampf-Waffenangriff: +17 auf Treffer, Reichweite 6 m, ein Ziel. Treffer: 19 (2W8 + 10) Wuchtschaden.',
      ],
      [
        'Furchterregende Präsenz',
        'Jede Kreatur nach Wahl des Drachen im Umkreis von 36 m um ihn, die sich des Drachen bewusst ist, muss einen Weisheitsrettungswurf mit SG 24 bestehen, sonst ist sie 1 Minute lang verängstigt. Eine Kreatur kann den Rettungswurf am Ende jedes ihrer Züge wiederholen und beendet die Wirkung bei einem Erfolg für sich. Ist der Rettungswurf einer Kreatur erfolgreich oder endet die Wirkung für sie, ist die Kreatur für die nächsten 24 Stunden immun gegen die Furchterregende Präsenz des Drachen.',
      ],
      [
        'Odemwaffen (Aufladung 5–6)',
        'Der Drache setzt eine der folgenden Odemwaffen ein.\nFeuerodem. Der Drache atmet Feuer in einem 27-m-Kegel aus. Jede Kreatur in diesem Bereich muss einen Geschicklichkeitsrettungswurf mit SG 24 ablegen. Bei einem Misserfolg erleidet sie 71 (13W10) Feuerschaden, bei einem Erfolg die Hälfte.\nSchwächender Odem. Der Drache atmet Gas in einem 27-m-Kegel aus. Jede Kreatur in diesem Bereich muss einen Stärkerettungswurf mit SG 24 bestehen, sonst ist sie 1 Minute lang bei stärkebasierten Angriffswürfen, Stärkewürfen und Stärkerettungswürfen im Nachteil. Eine Kreatur kann den Rettungswurf am Ende jedes ihrer Züge wiederholen und beendet die Wirkung bei einem Erfolg für sich.',
      ],
      [
        'Gestalt wandeln',
        'Der Drache verwandelt sich magisch in einen Humanoiden oder ein Tier mit einem Herausforderungsgrad, der nicht höher ist als sein eigener, oder zurück in seine wahre Gestalt. Stirbt er, nimmt er wieder seine wahre Gestalt an. Ausrüstung, die er trägt oder hält, wird von der neuen Gestalt aufgenommen oder getragen (nach Wahl des Drachen).\nIn einer neuen Gestalt behält der Drache seine Gesinnung, Trefferpunkte, Trefferwürfel, Fähigkeit zu sprechen, Übungen, Legendäre Resistenz, Hortaktionen sowie seine Intelligenz-, Weisheits- und Charismawerte, außerdem diese Aktion. Seine übrigen Spielwerte und Fähigkeiten werden durch die der neuen Gestalt ersetzt, mit Ausnahme von Klassenmerkmalen oder legendären Aktionen dieser Gestalt.',
      ],
    ],
    legendary:
      'Der Drache kann 3 legendäre Aktionen ausführen und wählt dabei aus den unten aufgeführten Optionen. Es kann jeweils nur eine legendäre Aktion eingesetzt werden, und nur am Ende des Zuges einer anderen Kreatur. Der Drache erhält verbrauchte legendäre Aktionen zu Beginn seines Zuges zurück.',
    legendaryActions: [
      ['Wahrnehmen', 'Der Drache legt einen Weisheitswurf (Wahrnehmung) ab.'],
      ['Schwanzangriff', 'Der Drache führt einen Schwanzangriff aus.'],
      [
        'Flügelangriff (kostet 2 Aktionen)',
        'Der Drache schlägt mit den Flügeln. Jede Kreatur im Umkreis von 4,5 m um den Drachen muss einen Geschicklichkeitsrettungswurf mit SG 25 bestehen, sonst erleidet sie 17 (2W6 + 10) Wuchtschaden und wird zu Boden geworfen. Der Drache kann dann bis zur Hälfte seiner Flugbewegungsrate fliegen.',
      ],
    ],
  },
  'ancient-green-dragon': {
    traits: [
      ['Amphibisch', 'Der Drache kann Luft und Wasser atmen.'],
      [
        'Legendäre Resistenz (3-mal täglich)',
        'Misslingt dem Drachen ein Rettungswurf, kann er sich entscheiden, ihn stattdessen zu bestehen.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Drache kann seine Furchterregende Präsenz einsetzen. Dann führt er drei Angriffe aus: einen mit seinem Biss und zwei mit seinen Klauen.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +15 auf Treffer, Reichweite 4,5 m, ein Ziel. Treffer: 19 (2W10 + 8) Stichschaden plus 10 (3W6) Giftschaden.',
      ],
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +15 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 22 (4W6 + 8) Hiebschaden.',
      ],
      [
        'Schwanz',
        'Nahkampf-Waffenangriff: +15 auf Treffer, Reichweite 6 m, ein Ziel. Treffer: 17 (2W8 + 8) Wuchtschaden.',
      ],
      [
        'Furchterregende Präsenz',
        'Jede Kreatur nach Wahl des Drachen im Umkreis von 36 m um ihn, die sich des Drachen bewusst ist, muss einen Weisheitsrettungswurf mit SG 19 bestehen, sonst ist sie 1 Minute lang verängstigt. Eine Kreatur kann den Rettungswurf am Ende jedes ihrer Züge wiederholen und beendet die Wirkung bei einem Erfolg für sich. Ist der Rettungswurf einer Kreatur erfolgreich oder endet die Wirkung für sie, ist die Kreatur für die nächsten 24 Stunden immun gegen die Furchterregende Präsenz des Drachen.',
      ],
      [
        'Giftodem (Aufladung 5–6)',
        'Der Drache atmet giftiges Gas in einem 27-m-Kegel aus. Jede Kreatur in diesem Bereich muss einen Konstitutionsrettungswurf mit SG 22 ablegen. Bei einem Misserfolg erleidet sie 77 (22W6) Giftschaden, bei einem Erfolg die Hälfte.',
      ],
    ],
    legendary:
      'Der Drache kann 3 legendäre Aktionen ausführen und wählt dabei aus den unten aufgeführten Optionen. Es kann jeweils nur eine legendäre Aktion eingesetzt werden, und nur am Ende des Zuges einer anderen Kreatur. Der Drache erhält verbrauchte legendäre Aktionen zu Beginn seines Zuges zurück.',
    legendaryActions: [
      ['Wahrnehmen', 'Der Drache legt einen Weisheitswurf (Wahrnehmung) ab.'],
      ['Schwanzangriff', 'Der Drache führt einen Schwanzangriff aus.'],
      [
        'Flügelangriff (kostet 2 Aktionen)',
        'Der Drache schlägt mit den Flügeln. Jede Kreatur im Umkreis von 4,5 m um den Drachen muss einen Geschicklichkeitsrettungswurf mit SG 23 bestehen, sonst erleidet sie 15 (2W6 + 8) Wuchtschaden und wird zu Boden geworfen. Der Drache kann dann bis zur Hälfte seiner Flugbewegungsrate fliegen.',
      ],
    ],
  },
  'ancient-red-dragon': {
    traits: [
      [
        'Legendäre Resistenz (3-mal täglich)',
        'Misslingt dem Drachen ein Rettungswurf, kann er sich entscheiden, ihn stattdessen zu bestehen.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Drache kann seine Furchterregende Präsenz einsetzen. Dann führt er drei Angriffe aus: einen mit seinem Biss und zwei mit seinen Klauen.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +17 auf Treffer, Reichweite 4,5 m, ein Ziel. Treffer: 21 (2W10 + 10) Stichschaden plus 14 (4W6) Feuerschaden.',
      ],
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +17 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 17 (2W6 + 10) Hiebschaden.',
      ],
      [
        'Schwanz',
        'Nahkampf-Waffenangriff: +17 auf Treffer, Reichweite 6 m, ein Ziel. Treffer: 19 (2W8 + 10) Wuchtschaden.',
      ],
      [
        'Furchterregende Präsenz',
        'Jede Kreatur nach Wahl des Drachen im Umkreis von 36 m um ihn, die sich des Drachen bewusst ist, muss einen Weisheitsrettungswurf mit SG 21 bestehen, sonst ist sie 1 Minute lang verängstigt. Eine Kreatur kann den Rettungswurf am Ende jedes ihrer Züge wiederholen und beendet die Wirkung bei einem Erfolg für sich. Ist der Rettungswurf einer Kreatur erfolgreich oder endet die Wirkung für sie, ist die Kreatur für die nächsten 24 Stunden immun gegen die Furchterregende Präsenz des Drachen.',
      ],
      [
        'Feuerodem (Aufladung 5–6)',
        'Der Drache atmet Feuer in einem 27-m-Kegel aus. Jede Kreatur in diesem Bereich muss einen Geschicklichkeitsrettungswurf mit SG 24 ablegen. Bei einem Misserfolg erleidet sie 91 (26W6) Feuerschaden, bei einem Erfolg die Hälfte.',
      ],
    ],
    legendary:
      'Der Drache kann 3 legendäre Aktionen ausführen und wählt dabei aus den unten aufgeführten Optionen. Es kann jeweils nur eine legendäre Aktion eingesetzt werden, und nur am Ende des Zuges einer anderen Kreatur. Der Drache erhält verbrauchte legendäre Aktionen zu Beginn seines Zuges zurück.',
    legendaryActions: [
      ['Wahrnehmen', 'Der Drache legt einen Weisheitswurf (Wahrnehmung) ab.'],
      ['Schwanzangriff', 'Der Drache führt einen Schwanzangriff aus.'],
      [
        'Flügelangriff (kostet 2 Aktionen)',
        'Der Drache schlägt mit den Flügeln. Jede Kreatur im Umkreis von 4,5 m um den Drachen muss einen Geschicklichkeitsrettungswurf mit SG 25 bestehen, sonst erleidet sie 17 (2W6 + 10) Wuchtschaden und wird zu Boden geworfen. Der Drache kann dann bis zur Hälfte seiner Flugbewegungsrate fliegen.',
      ],
    ],
  },
  'ancient-silver-dragon': {
    traits: [
      [
        'Legendäre Resistenz (3-mal täglich)',
        'Misslingt dem Drachen ein Rettungswurf, kann er sich entscheiden, ihn stattdessen zu bestehen.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Drache kann seine Furchterregende Präsenz einsetzen. Dann führt er drei Angriffe aus: einen mit seinem Biss und zwei mit seinen Klauen.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +17 auf Treffer, Reichweite 4,5 m, ein Ziel. Treffer: 21 (2W10 + 10) Stichschaden.',
      ],
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +17 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 17 (2W6 + 10) Hiebschaden.',
      ],
      [
        'Schwanz',
        'Nahkampf-Waffenangriff: +17 auf Treffer, Reichweite 6 m, ein Ziel. Treffer: 19 (2W8 + 10) Wuchtschaden.',
      ],
      [
        'Furchterregende Präsenz',
        'Jede Kreatur nach Wahl des Drachen im Umkreis von 36 m um ihn, die sich des Drachen bewusst ist, muss einen Weisheitsrettungswurf mit SG 21 bestehen, sonst ist sie 1 Minute lang verängstigt. Eine Kreatur kann den Rettungswurf am Ende jedes ihrer Züge wiederholen und beendet die Wirkung bei einem Erfolg für sich. Ist der Rettungswurf einer Kreatur erfolgreich oder endet die Wirkung für sie, ist die Kreatur für die nächsten 24 Stunden immun gegen die Furchterregende Präsenz des Drachen.',
      ],
      [
        'Odemwaffen (Aufladung 5–6)',
        'Der Drache setzt eine der folgenden Odemwaffen ein.\nKälteodem. Der Drache atmet einen eisigen Stoß in einem 27-m-Kegel aus. Jede Kreatur in diesem Bereich muss einen Konstitutionsrettungswurf mit SG 24 ablegen. Bei einem Misserfolg erleidet sie 67 (15W8) Kälteschaden, bei einem Erfolg die Hälfte.\nLähmender Odem. Der Drache atmet lähmendes Gas in einem 27-m-Kegel aus. Jede Kreatur in diesem Bereich muss einen Konstitutionsrettungswurf mit SG 24 bestehen, sonst ist sie 1 Minute lang gelähmt. Eine Kreatur kann den Rettungswurf am Ende jedes ihrer Züge wiederholen und beendet die Wirkung bei einem Erfolg für sich.',
      ],
      [
        'Gestalt wandeln',
        'Der Drache verwandelt sich magisch in einen Humanoiden oder ein Tier mit einem Herausforderungsgrad, der nicht höher ist als sein eigener, oder zurück in seine wahre Gestalt. Stirbt er, nimmt er wieder seine wahre Gestalt an. Ausrüstung, die er trägt oder hält, wird von der neuen Gestalt aufgenommen oder getragen (nach Wahl des Drachen).\nIn einer neuen Gestalt behält der Drache seine Gesinnung, Trefferpunkte, Trefferwürfel, Fähigkeit zu sprechen, Übungen, Legendäre Resistenz, Hortaktionen sowie seine Intelligenz-, Weisheits- und Charismawerte, außerdem diese Aktion. Seine übrigen Spielwerte und Fähigkeiten werden durch die der neuen Gestalt ersetzt, mit Ausnahme von Klassenmerkmalen oder legendären Aktionen dieser Gestalt.',
      ],
    ],
    legendary:
      'Der Drache kann 3 legendäre Aktionen ausführen und wählt dabei aus den unten aufgeführten Optionen. Es kann jeweils nur eine legendäre Aktion eingesetzt werden, und nur am Ende des Zuges einer anderen Kreatur. Der Drache erhält verbrauchte legendäre Aktionen zu Beginn seines Zuges zurück.',
    legendaryActions: [
      ['Wahrnehmen', 'Der Drache legt einen Weisheitswurf (Wahrnehmung) ab.'],
      ['Schwanzangriff', 'Der Drache führt einen Schwanzangriff aus.'],
      [
        'Flügelangriff (kostet 2 Aktionen)',
        'Der Drache schlägt mit den Flügeln. Jede Kreatur im Umkreis von 4,5 m um den Drachen muss einen Geschicklichkeitsrettungswurf mit SG 25 bestehen, sonst erleidet sie 17 (2W6 + 10) Wuchtschaden und wird zu Boden geworfen. Der Drache kann dann bis zur Hälfte seiner Flugbewegungsrate fliegen.',
      ],
    ],
  },
  'ancient-white-dragon': {
    traits: [
      [
        'Eisgang',
        'Der Drache kann sich über eisige Oberflächen bewegen und an ihnen klettern, ohne einen Attributswurf ablegen zu müssen. Außerdem kostet ihn schwieriges Gelände aus Eis oder Schnee keine zusätzliche Bewegung.',
      ],
      [
        'Legendäre Resistenz (3-mal täglich)',
        'Misslingt dem Drachen ein Rettungswurf, kann er sich entscheiden, ihn stattdessen zu bestehen.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Drache kann seine Furchterregende Präsenz einsetzen. Dann führt er drei Angriffe aus: einen mit seinem Biss und zwei mit seinen Klauen.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +14 auf Treffer, Reichweite 4,5 m, ein Ziel. Treffer: 19 (2W10 + 8) Stichschaden plus 9 (2W8) Kälteschaden.',
      ],
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +14 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 15 (2W6 + 8) Hiebschaden.',
      ],
      [
        'Schwanz',
        'Nahkampf-Waffenangriff: +14 auf Treffer, Reichweite 6 m, ein Ziel. Treffer: 17 (2W8 + 8) Wuchtschaden.',
      ],
      [
        'Furchterregende Präsenz',
        'Jede Kreatur nach Wahl des Drachen im Umkreis von 36 m um ihn, die sich des Drachen bewusst ist, muss einen Weisheitsrettungswurf mit SG 16 bestehen, sonst ist sie 1 Minute lang verängstigt. Eine Kreatur kann den Rettungswurf am Ende jedes ihrer Züge wiederholen und beendet die Wirkung bei einem Erfolg für sich. Ist der Rettungswurf einer Kreatur erfolgreich oder endet die Wirkung für sie, ist die Kreatur für die nächsten 24 Stunden immun gegen die Furchterregende Präsenz des Drachen.',
      ],
      [
        'Kälteodem (Aufladung 5–6)',
        'Der Drache atmet einen eisigen Stoß in einem 27-m-Kegel aus. Jede Kreatur in diesem Bereich muss einen Konstitutionsrettungswurf mit SG 22 ablegen. Bei einem Misserfolg erleidet sie 72 (16W8) Kälteschaden, bei einem Erfolg die Hälfte.',
      ],
    ],
    legendary:
      'Der Drache kann 3 legendäre Aktionen ausführen und wählt dabei aus den unten aufgeführten Optionen. Es kann jeweils nur eine legendäre Aktion eingesetzt werden, und nur am Ende des Zuges einer anderen Kreatur. Der Drache erhält verbrauchte legendäre Aktionen zu Beginn seines Zuges zurück.',
    legendaryActions: [
      ['Wahrnehmen', 'Der Drache legt einen Weisheitswurf (Wahrnehmung) ab.'],
      ['Schwanzangriff', 'Der Drache führt einen Schwanzangriff aus.'],
      [
        'Flügelangriff (kostet 2 Aktionen)',
        'Der Drache schlägt mit den Flügeln. Jede Kreatur im Umkreis von 4,5 m um den Drachen muss einen Geschicklichkeitsrettungswurf mit SG 22 bestehen, sonst erleidet sie 15 (2W6 + 8) Wuchtschaden und wird zu Boden geworfen. Der Drache kann dann bis zur Hälfte seiner Flugbewegungsrate fliegen.',
      ],
    ],
  },
  androsphinx: {
    traits: [
      [
        'Unergründlich',
        'Die Sphinx ist immun gegen jede Wirkung, die ihre Gefühle erspüren oder ihre Gedanken lesen würde, sowie gegen jeden Erkenntniszauber, den sie zurückweist. Weisheitswürfe (Motiv erkennen), mit denen die Absichten oder die Aufrichtigkeit der Sphinx ergründet werden sollen, sind im Nachteil.',
      ],
      ['Magische Waffen', 'Die Waffenangriffe der Sphinx sind magisch.'],
      [
        'Zauberwirken',
        'Die Sphinx ist eine Zauberwirkerin der 12. Stufe. Ihr Attribut zum Zauberwirken ist Weisheit (Zauberrettungswurf-SG 18, +10 auf Treffer mit Zauberangriffen). Sie benötigt keine Materialkomponenten, um ihre Zauber zu wirken. Die Sphinx hat folgende Klerikerzauber vorbereitet:\n\n- Zaubertricks (beliebig oft): Heilige Flamme, Verschonung der Sterbenden, Thaumaturgie\n- 1. Grad (4 Plätze): Befehl, Gutes und Böses entdecken, Magie entdecken\n- 2. Grad (3 Plätze): Schwache Genesung, Zone der Wahrheit\n- 3. Grad (3 Plätze): Magie bannen, Zungen\n- 4. Grad (3 Plätze): Verbannung, Bewegungsfreiheit\n- 5. Grad (2 Plätze): Flammenschlag, Vollständige Genesung\n- 6. Grad (1 Platz): Heldenmahl',
      ],
    ],
    actions: [
      ['Mehrfachangriff', 'Die Sphinx führt zwei Klauenangriffe aus.'],
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +12 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 17 (2W10 + 6) Hiebschaden.',
      ],
      [
        'Brüllen (3-mal täglich)',
        'Die Sphinx stößt ein magisches Brüllen aus. Jedes Mal, wenn sie brüllt, bevor sie eine lange Rast beendet, ist das Brüllen lauter und die Wirkung eine andere, wie unten beschrieben. Jede Kreatur im Umkreis von 150 m um die Sphinx, die das Brüllen hören kann, muss einen Rettungswurf ablegen.\n\nErstes Brüllen. Jede Kreatur, der ein Weisheitsrettungswurf mit SG 18 misslingt, ist 1 Minute lang verängstigt. Eine verängstigte Kreatur kann den Rettungswurf am Ende jedes ihrer Züge wiederholen und beendet die Wirkung bei einem Erfolg für sich.\n\nZweites Brüllen. Jede Kreatur, der ein Weisheitsrettungswurf mit SG 18 misslingt, ist 1 Minute lang taub und verängstigt. Eine verängstigte Kreatur ist gelähmt und kann den Rettungswurf am Ende jedes ihrer Züge wiederholen und beendet die Wirkung bei einem Erfolg für sich.\n\nDrittes Brüllen. Jede Kreatur legt einen Konstitutionsrettungswurf mit SG 18 ab. Bei einem Misserfolg erleidet eine Kreatur 44 (8W10) Schallschaden und wird zu Boden geworfen. Bei einem Erfolg erleidet die Kreatur halb so viel Schaden und wird nicht zu Boden geworfen.',
      ],
    ],
    legendary:
      'Die Sphinx kann 3 legendäre Aktionen ausführen und wählt dabei aus den unten aufgeführten Optionen. Es kann jeweils nur eine legendäre Aktion eingesetzt werden, und nur am Ende des Zuges einer anderen Kreatur. Die Sphinx erhält verbrauchte legendäre Aktionen zu Beginn ihres Zuges zurück.',
    legendaryActions: [
      ['Klauenangriff', 'Die Sphinx führt einen Klauenangriff aus.'],
      [
        'Teleportieren (kostet 2 Aktionen)',
        'Die Sphinx teleportiert sich magisch samt der Ausrüstung, die sie trägt oder hält, bis zu 36 m weit in einen freien Bereich, den sie sehen kann.',
      ],
      [
        'Zauber wirken (kostet 3 Aktionen)',
        'Die Sphinx wirkt einen Zauber aus ihrer Liste vorbereiteter Zauber und verbraucht dabei wie üblich einen Zauberplatz.',
      ],
    ],
  },
  balor: {
    traits: [
      [
        'Todeszuckungen',
        'Stirbt der Balor, explodiert er, und jede Kreatur im Umkreis von 9 m um ihn muss einen Geschicklichkeitsrettungswurf mit SG 20 ablegen. Bei einem Misserfolg erleidet sie 70 (20W6) Feuerschaden, bei einem Erfolg die Hälfte. Die Explosion entzündet brennbare Gegenstände in diesem Bereich, die nicht getragen oder gehalten werden, und zerstört die Waffen des Balors.',
      ],
      [
        'Feueraura',
        'Zu Beginn jedes Zuges des Balors erleidet jede Kreatur im Umkreis von 1,5 m um ihn 10 (3W6) Feuerschaden, und brennbare Gegenstände in der Aura, die nicht getragen oder gehalten werden, entzünden sich. Eine Kreatur, die den Balor berührt oder ihn mit einem Nahkampfangriff trifft, während sie sich im Umkreis von 1,5 m um ihn befindet, erleidet 10 (3W6) Feuerschaden.',
      ],
      [
        'Magieresistenz',
        'Der Balor ist bei Rettungswürfen gegen Zauber und andere magische Effekte im Vorteil.',
      ],
      ['Magische Waffen', 'Die Waffenangriffe des Balors sind magisch.'],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Balor führt zwei Angriffe aus: einen mit seinem Langschwert und einen mit seiner Peitsche.',
      ],
      [
        'Langschwert',
        'Nahkampf-Waffenangriff: +14 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 21 (3W8 + 8) Hiebschaden plus 13 (3W8) Blitzschaden. Erzielt der Balor einen kritischen Treffer, würfelt er die Schadenswürfel dreimal statt zweimal.',
      ],
      [
        'Peitsche',
        'Nahkampf-Waffenangriff: +14 auf Treffer, Reichweite 9 m, ein Ziel. Treffer: 15 (2W6 + 8) Hiebschaden plus 10 (3W6) Feuerschaden, und das Ziel muss einen Stärkerettungswurf mit SG 20 bestehen, sonst wird es bis zu 7,5 m weit zu dem Balor hingezogen.',
      ],
      [
        'Teleportieren',
        'Der Balor teleportiert sich magisch samt der Ausrüstung, die er trägt oder hält, bis zu 36 m weit in einen freien Bereich, den er sehen kann.',
      ],
    ],
  },
  'dragon-turtle': {
    traits: [['Amphibisch', 'Die Drachenschildkröte kann Luft und Wasser atmen.']],
    actions: [
      [
        'Mehrfachangriff',
        'Die Drachenschildkröte führt drei Angriffe aus: einen mit ihrem Biss und zwei mit ihren Klauen. Sie kann anstelle der beiden Klauenangriffe einen Schwanzangriff ausführen.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +13 auf Treffer, Reichweite 4,5 m, ein Ziel. Treffer: 26 (3W12 + 7) Stichschaden.',
      ],
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +13 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 16 (2W8 + 7) Hiebschaden.',
      ],
      [
        'Schwanz',
        'Nahkampf-Waffenangriff: +13 auf Treffer, Reichweite 4,5 m, ein Ziel. Treffer: 26 (3W12 + 7) Wuchtschaden. Ist das Ziel eine Kreatur, muss es einen Stärkerettungswurf mit SG 20 bestehen, sonst wird es bis zu 3 m von der Drachenschildkröte weggestoßen und zu Boden geworfen.',
      ],
      [
        'Dampfodem (Aufladung 5–6)',
        'Die Drachenschildkröte atmet sengenden Dampf in einem 18-m-Kegel aus. Jede Kreatur in diesem Bereich muss einen Konstitutionsrettungswurf mit SG 18 ablegen. Bei einem Misserfolg erleidet sie 52 (15W6) Feuerschaden, bei einem Erfolg die Hälfte. Sich unter Wasser zu befinden, gewährt keine Resistenz gegen diesen Schaden.',
      ],
    ],
  },
  kraken: {
    traits: [
      ['Amphibisch', 'Der Kraken kann Luft und Wasser atmen.'],
      [
        'Bewegungsfreiheit',
        'Der Kraken ignoriert schwieriges Gelände, und magische Effekte können seine Bewegungsrate nicht verringern oder ihn festsetzen. Er kann 1,5 m Bewegung aufwenden, um sich aus nichtmagischen Fesseln oder einem Griff zu befreien.',
      ],
      [
        'Belagerungsmonster',
        'Der Kraken verursacht an Gegenständen und Bauwerken doppelten Schaden.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Kraken führt drei Tentakelangriffe aus, von denen er jeden durch einen Einsatz von Schleudern ersetzen kann.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 23 (3W8 + 10) Stichschaden. Ist das Ziel eine große oder kleinere Kreatur, die von dem Kraken gepackt wird, wird diese Kreatur verschluckt, und der Griff endet. Solange die Kreatur verschluckt ist, ist sie blind und festgesetzt, hat vollständige Deckung gegen Angriffe und andere Effekte von außerhalb des Krakens und erleidet zu Beginn jedes Zuges des Krakens 42 (12W6) Säureschaden. Erleidet der Kraken in einem einzigen Zug 50 oder mehr Schaden durch eine Kreatur in seinem Inneren, muss er am Ende dieses Zuges einen Konstitutionsrettungswurf mit SG 25 bestehen, sonst würgt er alle verschluckten Kreaturen wieder hervor, die in einem Bereich im Umkreis von 3 m um den Kraken zu Boden fallen. Stirbt der Kraken, ist eine verschluckte Kreatur nicht länger festgesetzt und kann mit 4,5 m Bewegung aus dem Kadaver entkommen; sie liegt danach am Boden.',
      ],
      [
        'Tentakel',
        'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 9 m, ein Ziel. Treffer: 20 (3W6 + 10) Wuchtschaden, und das Ziel wird gepackt (Entkommen-SG 18). Bis der Griff endet, ist das Ziel festgesetzt. Der Kraken hat zehn Tentakel, von denen jeder ein Ziel packen kann.',
      ],
      [
        'Schleudern',
        'Ein großer oder kleinerer Gegenstand, den der Kraken hält, oder eine Kreatur, die er gepackt hält, wird bis zu 18 m in eine zufällige Richtung geschleudert und zu Boden geworfen. Prallt ein geschleudertes Ziel gegen eine feste Oberfläche, erleidet es für je 3 m, die es geschleudert wurde, 3 (1W6) Wuchtschaden. Wird das Ziel gegen eine andere Kreatur geschleudert, muss diese Kreatur einen Geschicklichkeitsrettungswurf mit SG 18 bestehen, sonst erleidet sie denselben Schaden und wird zu Boden geworfen.',
      ],
      [
        'Blitzsturm',
        'Der Kraken erschafft magisch drei Blitze, von denen jeder ein Ziel treffen kann, das der Kraken im Umkreis von 36 m sehen kann. Ein Ziel muss einen Geschicklichkeitsrettungswurf mit SG 23 ablegen. Bei einem Misserfolg erleidet es 22 (4W10) Blitzschaden, bei einem Erfolg die Hälfte.',
      ],
    ],
    legendary:
      'Der Kraken kann 3 legendäre Aktionen ausführen und wählt dabei aus den unten aufgeführten Optionen. Es kann jeweils nur eine legendäre Aktion eingesetzt werden, und nur am Ende des Zuges einer anderen Kreatur. Der Kraken erhält verbrauchte legendäre Aktionen zu Beginn seines Zuges zurück.',
    legendaryActions: [
      [
        'Tentakelangriff oder Schleudern',
        'Der Kraken führt einen Tentakelangriff aus oder setzt Schleudern ein.',
      ],
      ['Blitzsturm (kostet 2 Aktionen)', 'Der Kraken setzt Blitzsturm ein.'],
      [
        'Tintenwolke (kostet 3 Aktionen)',
        'Unter Wasser stößt der Kraken eine Tintenwolke mit 18 m Radius aus. Die Wolke reicht um Ecken, und der Bereich ist für andere Kreaturen als den Kraken komplett verschleiert. Jede Kreatur außer dem Kraken, die dort ihren Zug beendet, muss einen Konstitutionsrettungswurf mit SG 23 ablegen. Bei einem Misserfolg erleidet sie 16 (3W10) Giftschaden, bei einem Erfolg die Hälfte. Eine starke Strömung zerstreut die Wolke, die ansonsten am Ende des nächsten Zuges des Krakens verschwindet.',
      ],
    ],
  },
  lich: {
    traits: [
      [
        'Legendäre Resistenz (3-mal täglich)',
        'Misslingt dem Leichnam ein Rettungswurf, kann er sich entscheiden, ihn stattdessen zu bestehen.',
      ],
      [
        'Erneuerung',
        'Besitzt er ein Phylakterium, erhält ein zerstörter Leichnam nach 1W10 Tagen einen neuen Körper, erhält all seine Trefferpunkte zurück und wird wieder aktiv. Der neue Körper erscheint im Umkreis von 1,5 m um das Phylakterium.',
      ],
      [
        'Zauberwirken',
        'Der Leichnam ist ein Zauberwirker der 18. Stufe. Sein Attribut zum Zauberwirken ist Intelligenz (Zauberrettungswurf-SG 20, +12 auf Treffer mit Zauberangriffen). Der Leichnam hat folgende Magierzauber vorbereitet:\n\n- Zaubertricks (beliebig oft): Magierhand, Taschenspielerei, Froststrahl\n- 1. Grad (4 Plätze): Magie entdecken, Magisches Geschoss, Schild, Donnerwoge\n- 2. Grad (3 Plätze): Säurepfeil, Gedanken wahrnehmen, Unsichtbarkeit, Spiegelbilder\n- 3. Grad (3 Plätze): Tote beleben, Gegenzauber, Magie bannen, Feuerball\n- 4. Grad (3 Plätze): Pesthauch, Dimensionstür\n- 5. Grad (3 Plätze): Todeswolke, Ausspähung\n- 6. Grad (1 Platz): Auflösung, Kugel der Unverwundbarkeit\n- 7. Grad (1 Platz): Finger des Todes, Ebenenwechsel\n- 8. Grad (1 Platz): Monster beherrschen, Machtwort: Betäubung\n- 9. Grad (1 Platz): Machtwort: Tod',
      ],
      [
        'Resistenz gegen Vertreiben',
        'Der Leichnam ist bei Rettungswürfen gegen jeden Effekt, der Untote vertreibt, im Vorteil.',
      ],
    ],
    actions: [
      [
        'Lähmende Berührung',
        'Nahkampf-Zauberangriff: +12 auf Treffer, Reichweite 1,5 m, eine Kreatur. Treffer: 10 (3W6) Kälteschaden. Das Ziel muss einen Konstitutionsrettungswurf mit SG 18 bestehen, sonst ist es 1 Minute lang gelähmt. Das Ziel kann den Rettungswurf am Ende jedes seiner Züge wiederholen und beendet die Wirkung bei einem Erfolg für sich.',
      ],
    ],
    legendary:
      'Der Leichnam kann 3 legendäre Aktionen ausführen und wählt dabei aus den unten aufgeführten Optionen. Es kann jeweils nur eine legendäre Aktion eingesetzt werden, und nur am Ende des Zuges einer anderen Kreatur. Der Leichnam erhält verbrauchte legendäre Aktionen zu Beginn seines Zuges zurück.',
    legendaryActions: [
      ['Zaubertrick', 'Der Leichnam wirkt einen Zaubertrick.'],
      [
        'Lähmende Berührung (kostet 2 Aktionen)',
        'Der Leichnam setzt seine Lähmende Berührung ein.',
      ],
      [
        'Furchterregender Blick (kostet 2 Aktionen)',
        'Der Leichnam richtet seinen Blick auf eine Kreatur, die er im Umkreis von 3 m sehen kann. Das Ziel muss einen Weisheitsrettungswurf mit SG 18 gegen diese Magie bestehen, sonst ist es 1 Minute lang verängstigt. Das verängstigte Ziel kann den Rettungswurf am Ende jedes seiner Züge wiederholen und beendet die Wirkung bei einem Erfolg für sich. Ist der Rettungswurf eines Ziels erfolgreich oder endet die Wirkung für es, ist das Ziel für die nächsten 24 Stunden immun gegen den Blick des Leichnams.',
      ],
      [
        'Leben stören (kostet 3 Aktionen)',
        'Jede lebende Kreatur im Umkreis von 6 m um den Leichnam muss einen Konstitutionsrettungswurf mit SG 18 gegen diese Magie ablegen. Bei einem Misserfolg erleidet sie 21 (6W6) nekrotischen Schaden, bei einem Erfolg die Hälfte.',
      ],
    ],
  },
  'pit-fiend': {
    traits: [
      [
        'Aura der Furcht',
        'Jede dem Unhold feindlich gesinnte Kreatur, die ihren Zug im Umkreis von 6 m um den Unhold beginnt, muss einen Weisheitsrettungswurf mit SG 21 ablegen, sofern der Unhold nicht kampfunfähig ist. Bei einem Misserfolg ist die Kreatur bis zum Beginn ihres nächsten Zuges verängstigt. Ist der Rettungswurf einer Kreatur erfolgreich, ist die Kreatur für die nächsten 24 Stunden immun gegen die Aura der Furcht des Unholds.',
      ],
      [
        'Magieresistenz',
        'Der Unhold ist bei Rettungswürfen gegen Zauber und andere magische Effekte im Vorteil.',
      ],
      ['Magische Waffen', 'Die Waffenangriffe des Unholds sind magisch.'],
      [
        'Angeborenes Zauberwirken',
        'Das Attribut des Unholds zum Zauberwirken ist Charisma (Zauberrettungswurf-SG 21). Der Unhold kann die folgenden Zauber angeboren wirken, ohne Materialkomponenten zu benötigen:\nBeliebig oft: Magie entdecken, Feuerball\nJe 3-mal täglich: Monster festhalten, Feuerwand',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Unhold führt vier Angriffe aus: einen mit seinem Biss, einen mit seiner Klaue, einen mit seinem Streitkolben und einen mit seinem Schwanz.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +14 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 22 (4W6 + 8) Stichschaden. Das Ziel muss einen Konstitutionsrettungswurf mit SG 21 bestehen, sonst ist es vergiftet. Solange es auf diese Weise vergiftet ist, kann das Ziel keine Trefferpunkte zurückerhalten und erleidet zu Beginn jedes seiner Züge 21 (6W6) Giftschaden. Das vergiftete Ziel kann den Rettungswurf am Ende jedes seiner Züge wiederholen und beendet die Wirkung bei einem Erfolg für sich.',
      ],
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +14 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 17 (2W8 + 8) Hiebschaden.',
      ],
      [
        'Streitkolben',
        'Nahkampf-Waffenangriff: +14 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 15 (2W6 + 8) Wuchtschaden plus 21 (6W6) Feuerschaden.',
      ],
      [
        'Schwanz',
        'Nahkampf-Waffenangriff: +14 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 24 (3W10 + 8) Wuchtschaden.',
      ],
    ],
  },
  solar: {
    traits: [
      [
        'Engelswaffen',
        'Die Waffenangriffe des Solars sind magisch. Trifft der Solar mit einer beliebigen Waffe, verursacht die Waffe zusätzlich 6W8 gleißenden Schaden (im Angriff enthalten).',
      ],
      ['Göttliches Gespür', 'Der Solar erkennt, wenn er eine Lüge hört.'],
      [
        'Angeborenes Zauberwirken',
        'Das Attribut des Solars zum Zauberwirken ist Charisma (Zauberrettungswurf-SG 25). Er kann die folgenden Zauber angeboren wirken, ohne Materialkomponenten zu benötigen:\nBeliebig oft: Gutes und Böses entdecken, Unsichtbarkeit (nur selbst)\nJe 3-mal täglich: Klingenbarriere, Gutes und Böses bannen, Auferstehung\nJe 1-mal täglich: Kommunion, Wetterkontrolle',
      ],
      [
        'Magieresistenz',
        'Der Solar ist bei Rettungswürfen gegen Zauber und andere magische Effekte im Vorteil.',
      ],
    ],
    actions: [
      ['Mehrfachangriff', 'Der Solar führt zwei Zweihandschwertangriffe aus.'],
      [
        'Zweihandschwert',
        'Nahkampf-Waffenangriff: +15 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 22 (4W6 + 8) Hiebschaden plus 27 (6W8) gleißenden Schaden.',
      ],
      [
        'Todbringender Langbogen',
        'Fernkampf-Waffenangriff: +13 auf Treffer, Reichweite 45/180 m, ein Ziel. Treffer: 15 (2W8 + 6) Stichschaden plus 27 (6W8) gleißenden Schaden. Ist das Ziel eine Kreatur mit 190 oder weniger Trefferpunkten, muss es einen Konstitutionsrettungswurf mit SG 15 bestehen, sonst stirbt es.',
      ],
      [
        'Fliegendes Schwert',
        'Der Solar lässt sein Zweihandschwert los, das daraufhin magisch in einem freien Bereich im Umkreis von 1,5 m schwebt. Kann der Solar das Schwert sehen, kann er ihm als Bonusaktion gedanklich befehlen, bis zu 15 m weit zu fliegen und entweder einen Angriff gegen ein Ziel auszuführen oder in die Hände des Solars zurückzukehren. Wird das schwebende Schwert zum Ziel eines Effekts, gilt es als von dem Solar gehalten. Das schwebende Schwert fällt zu Boden, wenn der Solar stirbt.',
      ],
      [
        'Heilende Berührung (4-mal täglich)',
        'Der Solar berührt eine andere Kreatur. Das Ziel erhält magisch 40 (8W8 + 4) Trefferpunkte zurück und wird von jedem Fluch, jeder Krankheit, jedem Gift, jeder Blindheit und jeder Taubheit befreit.',
      ],
    ],
    legendary:
      'Der Solar kann 3 legendäre Aktionen ausführen und wählt dabei aus den unten aufgeführten Optionen. Es kann jeweils nur eine legendäre Aktion eingesetzt werden, und nur am Ende des Zuges einer anderen Kreatur. Der Solar erhält verbrauchte legendäre Aktionen zu Beginn seines Zuges zurück.',
    legendaryActions: [
      [
        'Teleportieren',
        'Der Solar teleportiert sich magisch samt der Ausrüstung, die er trägt oder hält, bis zu 36 m weit in einen freien Bereich, den er sehen kann.',
      ],
      [
        'Sengende Explosion (kostet 2 Aktionen)',
        'Der Solar strahlt magische, göttliche Energie aus. Jede Kreatur seiner Wahl in einem Radius von 3 m muss einen Geschicklichkeitsrettungswurf mit SG 23 ablegen. Bei einem Misserfolg erleidet sie 14 (4W6) Feuerschaden plus 14 (4W6) gleißenden Schaden, bei einem Erfolg die Hälfte.',
      ],
      [
        'Blendender Blick (kostet 3 Aktionen)',
        'Der Solar wählt eine Kreatur, die er im Umkreis von 9 m sehen kann, als Ziel. Kann das Ziel ihn sehen, muss es einen Konstitutionsrettungswurf mit SG 15 bestehen, sonst ist es blind, bis Magie wie der Zauber Schwache Genesung die Blindheit aufhebt.',
      ],
    ],
  },
  tarrasque: {
    traits: [
      [
        'Legendäre Resistenz (3-mal täglich)',
        'Misslingt dem Tarrasque ein Rettungswurf, kann er sich entscheiden, ihn stattdessen zu bestehen.',
      ],
      [
        'Magieresistenz',
        'Der Tarrasque ist bei Rettungswürfen gegen Zauber und andere magische Effekte im Vorteil.',
      ],
      [
        'Reflektierender Panzer',
        'Wann immer der Tarrasque zum Ziel des Zaubers Magisches Geschoss, eines Linienzaubers oder eines Zaubers mit Fernkampfangriffswurf wird, wirf einen W6. Bei 1 bis 5 ist der Tarrasque nicht betroffen. Bei einer 6 ist der Tarrasque nicht betroffen, und die Wirkung wird auf den Zaubernden zurückgeworfen, als ginge sie von dem Tarrasque aus, sodass der Zaubernde zum Ziel wird.',
      ],
      [
        'Belagerungsmonster',
        'Der Tarrasque verursacht an Gegenständen und Bauwerken doppelten Schaden.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Tarrasque kann seine Furchterregende Präsenz einsetzen. Dann führt er fünf Angriffe aus: einen mit seinem Biss, zwei mit seinen Klauen, einen mit seinen Hörnern und einen mit seinem Schwanz. Er kann statt seines Bisses Verschlucken einsetzen.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +19 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 36 (4W12 + 10) Stichschaden. Ist das Ziel eine Kreatur, wird es gepackt (Entkommen-SG 20). Bis der Griff endet, ist das Ziel festgesetzt, und der Tarrasque kann kein anderes Ziel beißen.',
      ],
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +19 auf Treffer, Reichweite 4,5 m, ein Ziel. Treffer: 28 (4W8 + 10) Hiebschaden.',
      ],
      [
        'Hörner',
        'Nahkampf-Waffenangriff: +19 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 32 (4W10 + 10) Stichschaden.',
      ],
      [
        'Schwanz',
        'Nahkampf-Waffenangriff: +19 auf Treffer, Reichweite 6 m, ein Ziel. Treffer: 24 (4W6 + 10) Wuchtschaden. Ist das Ziel eine Kreatur, muss es einen Stärkerettungswurf mit SG 20 bestehen, sonst wird es zu Boden geworfen.',
      ],
      [
        'Furchterregende Präsenz',
        'Jede Kreatur nach Wahl des Tarrasques im Umkreis von 36 m um ihn, die sich des Tarrasques bewusst ist, muss einen Weisheitsrettungswurf mit SG 17 bestehen, sonst ist sie 1 Minute lang verängstigt. Eine Kreatur kann den Rettungswurf am Ende jedes ihrer Züge wiederholen, im Nachteil, wenn der Tarrasque in Sichtlinie ist, und beendet die Wirkung bei einem Erfolg für sich. Ist der Rettungswurf einer Kreatur erfolgreich oder endet die Wirkung für sie, ist die Kreatur für die nächsten 24 Stunden immun gegen die Furchterregende Präsenz des Tarrasques.',
      ],
      [
        'Verschlucken',
        'Der Tarrasque führt einen Bissangriff gegen eine große oder kleinere Kreatur aus, die er gepackt hält. Trifft der Angriff, erleidet das Ziel den Schaden des Bisses, wird verschluckt, und der Griff endet. Solange die Kreatur verschluckt ist, ist sie blind und festgesetzt, hat vollständige Deckung gegen Angriffe und andere Effekte von außerhalb des Tarrasques und erleidet zu Beginn jedes Zuges des Tarrasques 56 (16W6) Säureschaden.\nErleidet der Tarrasque in einem einzigen Zug 60 oder mehr Schaden durch eine Kreatur in seinem Inneren, muss er am Ende dieses Zuges einen Konstitutionsrettungswurf mit SG 20 bestehen, sonst würgt er alle verschluckten Kreaturen wieder hervor, die in einem Bereich im Umkreis von 3 m um den Tarrasque zu Boden fallen. Stirbt der Tarrasque, ist eine verschluckte Kreatur nicht länger festgesetzt und kann mit 9 m Bewegung aus dem Kadaver entkommen; sie liegt danach am Boden.',
      ],
    ],
    legendary:
      'Der Tarrasque kann 3 legendäre Aktionen ausführen und wählt dabei aus den unten aufgeführten Optionen. Es kann jeweils nur eine legendäre Aktion eingesetzt werden, und nur am Ende des Zuges einer anderen Kreatur. Der Tarrasque erhält verbrauchte legendäre Aktionen zu Beginn seines Zuges zurück.',
    legendaryActions: [
      ['Angriff', 'Der Tarrasque führt einen Klauen- oder Schwanzangriff aus.'],
      ['Bewegen', 'Der Tarrasque bewegt sich bis zur Hälfte seiner Bewegungsrate.'],
      [
        'Zubeißen (kostet 2 Aktionen)',
        'Der Tarrasque führt einen Bissangriff aus oder setzt Verschlucken ein.',
      ],
    ],
  },
};
