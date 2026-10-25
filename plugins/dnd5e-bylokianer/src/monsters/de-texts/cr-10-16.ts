// German texts of the SRD monsters of challenge ratings 10 to 16: traits, actions, reactions and legendary
// actions. Our own translation of the SRD 5.1, CC-BY-4.0 (see NOTICE.md).

import type { DeMonsterText } from '../model';

export const DE_TEXTS_CR10: Readonly<Record<string, DeMonsterText>> = {
  aboleth: {
    traits: [
      ['Amphibisch', 'Der Aboleth kann Luft und Wasser atmen.'],
      [
        'Schleimwolke',
        'Unter Wasser ist der Aboleth von verwandelndem Schleim umgeben. Eine Kreatur, die den Aboleth berührt oder ihn mit einem Nahkampfangriff trifft, während sie sich im Umkreis von 1,5 m um ihn befindet, muss einen Konstitutionsrettungswurf mit SG 14 ablegen. Bei einem Misserfolg ist die Kreatur für 1W4 Stunden erkrankt. Die erkrankte Kreatur kann nur unter Wasser atmen.',
      ],
      [
        'Sondierende Telepathie',
        'Kommuniziert eine Kreatur telepathisch mit dem Aboleth, erfährt der Aboleth die größten Wünsche der Kreatur, sofern er sie sehen kann.',
      ],
    ],
    actions: [
      ['Mehrfachangriff', 'Der Aboleth führt drei Tentakelangriffe aus.'],
      [
        'Tentakel',
        'Nahkampf-Waffenangriff: +9 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 12 (2W6 + 5) Wuchtschaden. Ist das Ziel eine Kreatur, muss es einen Konstitutionsrettungswurf mit SG 14 bestehen, sonst erkrankt es. Die Krankheit zeigt 1 Minute lang keine Wirkung und kann durch jede Magie entfernt werden, die Krankheiten heilt. Nach 1 Minute wird die Haut der erkrankten Kreatur durchscheinend und schleimig, die Kreatur kann keine Trefferpunkte zurückerhalten, außer sie ist unter Wasser, und die Krankheit kann nur noch durch Heilung oder einen anderen krankheitsheilenden Zauber des 6. Grades oder höher entfernt werden. Befindet sich die Kreatur außerhalb eines Gewässers, erleidet sie alle 10 Minuten 6 (1W12) Säureschaden, es sei denn, ihre Haut wird befeuchtet, bevor 10 Minuten vergangen sind.',
      ],
      [
        'Schwanz',
        'Nahkampf-Waffenangriff: +9 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 15 (3W6 + 5) Wuchtschaden.',
      ],
      [
        'Versklaven (3-mal täglich)',
        'Der Aboleth wählt eine Kreatur, die er im Umkreis von 9 m sehen kann, als Ziel. Das Ziel muss einen Weisheitsrettungswurf mit SG 14 bestehen, sonst ist es magisch von dem Aboleth bezaubert, bis der Aboleth stirbt oder sich auf einer anderen Existenzebene als das Ziel befindet. Das bezauberte Ziel steht unter der Kontrolle des Aboleths, kann keine Reaktionen ausführen, und der Aboleth und das Ziel können über jede Entfernung telepathisch miteinander kommunizieren.\nWann immer das bezauberte Ziel Schaden erleidet, kann es den Rettungswurf wiederholen. Bei einem Erfolg endet die Wirkung. Höchstens einmal alle 24 Stunden kann das Ziel den Rettungswurf außerdem wiederholen, wenn es mindestens 1,5 km von dem Aboleth entfernt ist.',
      ],
    ],
    legendary:
      'Der Aboleth kann 3 legendäre Aktionen ausführen und wählt dabei aus den unten aufgeführten Optionen. Es kann jeweils nur eine legendäre Aktion eingesetzt werden, und nur am Ende des Zuges einer anderen Kreatur. Der Aboleth erhält verbrauchte legendäre Aktionen zu Beginn seines Zuges zurück.',
    legendaryActions: [
      ['Wahrnehmen', 'Der Aboleth legt einen Weisheitswurf (Wahrnehmung) ab.'],
      ['Schwanzhieb', 'Der Aboleth führt einen Schwanzangriff aus.'],
      [
        'Psychischer Entzug (kostet 2 Aktionen)',
        'Eine von dem Aboleth bezauberte Kreatur erleidet 10 (3W6) psychischen Schaden, und der Aboleth erhält Trefferpunkte in Höhe des Schadens zurück, den die Kreatur erleidet.',
      ],
    ],
  },
  'adult-black-dragon': {
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
        'Nahkampf-Waffenangriff: +11 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 17 (2W10 + 6) Stichschaden plus 4 (1W8) Säureschaden.',
      ],
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +11 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 13 (2W6 + 6) Hiebschaden.',
      ],
      [
        'Schwanz',
        'Nahkampf-Waffenangriff: +11 auf Treffer, Reichweite 4,5 m, ein Ziel. Treffer: 15 (2W8 + 6) Wuchtschaden.',
      ],
      [
        'Furchterregende Präsenz',
        'Jede Kreatur nach Wahl des Drachen im Umkreis von 36 m um ihn, die sich des Drachen bewusst ist, muss einen Weisheitsrettungswurf mit SG 16 bestehen, sonst ist sie 1 Minute lang verängstigt. Eine Kreatur kann den Rettungswurf am Ende jedes ihrer Züge wiederholen und beendet die Wirkung bei einem Erfolg für sich. Ist der Rettungswurf einer Kreatur erfolgreich oder endet die Wirkung für sie, ist die Kreatur für die nächsten 24 Stunden immun gegen die Furchterregende Präsenz des Drachen.',
      ],
      [
        'Säureodem (Aufladung 5–6)',
        'Der Drache atmet Säure in einer 18-m-Linie aus, die 1,5 m breit ist. Jede Kreatur in dieser Linie muss einen Geschicklichkeitsrettungswurf mit SG 18 ablegen. Bei einem Misserfolg erleidet sie 54 (12W8) Säureschaden, bei einem Erfolg die Hälfte.',
      ],
    ],
    legendary:
      'Der Drache kann 3 legendäre Aktionen ausführen und wählt dabei aus den unten aufgeführten Optionen. Es kann jeweils nur eine legendäre Aktion eingesetzt werden, und nur am Ende des Zuges einer anderen Kreatur. Der Drache erhält verbrauchte legendäre Aktionen zu Beginn seines Zuges zurück.',
    legendaryActions: [
      ['Wahrnehmen', 'Der Drache legt einen Weisheitswurf (Wahrnehmung) ab.'],
      ['Schwanzangriff', 'Der Drache führt einen Schwanzangriff aus.'],
      [
        'Flügelangriff (kostet 2 Aktionen)',
        'Der Drache schlägt mit den Flügeln. Jede Kreatur im Umkreis von 3 m um den Drachen muss einen Geschicklichkeitsrettungswurf mit SG 19 bestehen, sonst erleidet sie 13 (2W6 + 6) Wuchtschaden und wird zu Boden geworfen. Der Drache kann dann bis zur Hälfte seiner Flugbewegungsrate fliegen.',
      ],
    ],
  },
  'adult-blue-dragon': {
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
        'Nahkampf-Waffenangriff: +12 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 18 (2W10 + 7) Stichschaden plus 5 (1W10) Blitzschaden.',
      ],
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +12 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 14 (2W6 + 7) Hiebschaden.',
      ],
      [
        'Schwanz',
        'Nahkampf-Waffenangriff: +12 auf Treffer, Reichweite 4,5 m, ein Ziel. Treffer: 16 (2W8 + 7) Wuchtschaden.',
      ],
      [
        'Furchterregende Präsenz',
        'Jede Kreatur nach Wahl des Drachen im Umkreis von 36 m um ihn, die sich des Drachen bewusst ist, muss einen Weisheitsrettungswurf mit SG 17 bestehen, sonst ist sie 1 Minute lang verängstigt. Eine Kreatur kann den Rettungswurf am Ende jedes ihrer Züge wiederholen und beendet die Wirkung bei einem Erfolg für sich. Ist der Rettungswurf einer Kreatur erfolgreich oder endet die Wirkung für sie, ist die Kreatur für die nächsten 24 Stunden immun gegen die Furchterregende Präsenz des Drachen.',
      ],
      [
        'Blitzodem (Aufladung 5–6)',
        'Der Drache atmet Blitze in einer 27-m-Linie aus, die 1,5 m breit ist. Jede Kreatur in dieser Linie muss einen Geschicklichkeitsrettungswurf mit SG 19 ablegen. Bei einem Misserfolg erleidet sie 66 (12W10) Blitzschaden, bei einem Erfolg die Hälfte.',
      ],
    ],
    legendary:
      'Der Drache kann 3 legendäre Aktionen ausführen und wählt dabei aus den unten aufgeführten Optionen. Es kann jeweils nur eine legendäre Aktion eingesetzt werden, und nur am Ende des Zuges einer anderen Kreatur. Der Drache erhält verbrauchte legendäre Aktionen zu Beginn seines Zuges zurück.',
    legendaryActions: [
      ['Wahrnehmen', 'Der Drache legt einen Weisheitswurf (Wahrnehmung) ab.'],
      ['Schwanzangriff', 'Der Drache führt einen Schwanzangriff aus.'],
      [
        'Flügelangriff (kostet 2 Aktionen)',
        'Der Drache schlägt mit den Flügeln. Jede Kreatur im Umkreis von 3 m um den Drachen muss einen Geschicklichkeitsrettungswurf mit SG 20 bestehen, sonst erleidet sie 14 (2W6 + 7) Wuchtschaden und wird zu Boden geworfen. Der Drache kann dann bis zur Hälfte seiner Flugbewegungsrate fliegen.',
      ],
    ],
  },
  'adult-brass-dragon': {
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
        'Nahkampf-Waffenangriff: +11 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 17 (2W10 + 6) Stichschaden.',
      ],
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +11 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 13 (2W6 + 6) Hiebschaden.',
      ],
      [
        'Schwanz',
        'Nahkampf-Waffenangriff: +11 auf Treffer, Reichweite 4,5 m, ein Ziel. Treffer: 15 (2W8 + 6) Wuchtschaden.',
      ],
      [
        'Furchterregende Präsenz',
        'Jede Kreatur nach Wahl des Drachen im Umkreis von 36 m um ihn, die sich des Drachen bewusst ist, muss einen Weisheitsrettungswurf mit SG 16 bestehen, sonst ist sie 1 Minute lang verängstigt. Eine Kreatur kann den Rettungswurf am Ende jedes ihrer Züge wiederholen und beendet die Wirkung bei einem Erfolg für sich. Ist der Rettungswurf einer Kreatur erfolgreich oder endet die Wirkung für sie, ist die Kreatur für die nächsten 24 Stunden immun gegen die Furchterregende Präsenz des Drachen.',
      ],
      [
        'Odemwaffen (Aufladung 5–6)',
        'Der Drache setzt eine der folgenden Odemwaffen ein.\nFeuerodem. Der Drache atmet Feuer in einer 18-m-Linie aus, die 1,5 m breit ist. Jede Kreatur in dieser Linie muss einen Geschicklichkeitsrettungswurf mit SG 18 ablegen. Bei einem Misserfolg erleidet sie 45 (13W6) Feuerschaden, bei einem Erfolg die Hälfte.\nSchlafodem. Der Drache atmet Schlafgas in einem 18-m-Kegel aus. Jede Kreatur in diesem Bereich muss einen Konstitutionsrettungswurf mit SG 18 bestehen, sonst wird sie für 10 Minuten bewusstlos. Die Wirkung endet für eine Kreatur, wenn sie Schaden erleidet oder jemand eine Aktion nutzt, um sie zu wecken.',
      ],
    ],
    legendary:
      'Der Drache kann 3 legendäre Aktionen ausführen und wählt dabei aus den unten aufgeführten Optionen. Es kann jeweils nur eine legendäre Aktion eingesetzt werden, und nur am Ende des Zuges einer anderen Kreatur. Der Drache erhält verbrauchte legendäre Aktionen zu Beginn seines Zuges zurück.',
    legendaryActions: [
      ['Wahrnehmen', 'Der Drache legt einen Weisheitswurf (Wahrnehmung) ab.'],
      ['Schwanzangriff', 'Der Drache führt einen Schwanzangriff aus.'],
      [
        'Flügelangriff (kostet 2 Aktionen)',
        'Der Drache schlägt mit den Flügeln. Jede Kreatur im Umkreis von 3 m um den Drachen muss einen Geschicklichkeitsrettungswurf mit SG 19 bestehen, sonst erleidet sie 13 (2W6 + 6) Wuchtschaden und wird zu Boden geworfen. Der Drache kann dann bis zur Hälfte seiner Flugbewegungsrate fliegen.',
      ],
    ],
  },
  'adult-bronze-dragon': {
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
        'Nahkampf-Waffenangriff: +12 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 18 (2W10 + 7) Stichschaden.',
      ],
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +12 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 14 (2W6 + 7) Hiebschaden.',
      ],
      [
        'Schwanz',
        'Nahkampf-Waffenangriff: +12 auf Treffer, Reichweite 4,5 m, ein Ziel. Treffer: 16 (2W8 + 7) Wuchtschaden.',
      ],
      [
        'Furchterregende Präsenz',
        'Jede Kreatur nach Wahl des Drachen im Umkreis von 36 m um ihn, die sich des Drachen bewusst ist, muss einen Weisheitsrettungswurf mit SG 17 bestehen, sonst ist sie 1 Minute lang verängstigt. Eine Kreatur kann den Rettungswurf am Ende jedes ihrer Züge wiederholen und beendet die Wirkung bei einem Erfolg für sich. Ist der Rettungswurf einer Kreatur erfolgreich oder endet die Wirkung für sie, ist die Kreatur für die nächsten 24 Stunden immun gegen die Furchterregende Präsenz des Drachen.',
      ],
      [
        'Odemwaffen (Aufladung 5–6)',
        'Der Drache setzt eine der folgenden Odemwaffen ein.\nBlitzodem. Der Drache atmet Blitze in einer 27-m-Linie aus, die 1,5 m breit ist. Jede Kreatur in dieser Linie muss einen Geschicklichkeitsrettungswurf mit SG 19 ablegen. Bei einem Misserfolg erleidet sie 66 (12W10) Blitzschaden, bei einem Erfolg die Hälfte.\nAbstoßungsodem. Der Drache atmet abstoßende Energie in einem 9-m-Kegel aus. Jede Kreatur in diesem Bereich muss einen Stärkerettungswurf mit SG 19 ablegen. Bei einem Misserfolg wird die Kreatur 18 m von dem Drachen weggestoßen.',
      ],
    ],
    legendary:
      'Der Drache kann 3 legendäre Aktionen ausführen und wählt dabei aus den unten aufgeführten Optionen. Es kann jeweils nur eine legendäre Aktion eingesetzt werden, und nur am Ende des Zuges einer anderen Kreatur. Der Drache erhält verbrauchte legendäre Aktionen zu Beginn seines Zuges zurück.',
    legendaryActions: [
      ['Wahrnehmen', 'Der Drache legt einen Weisheitswurf (Wahrnehmung) ab.'],
      ['Schwanzangriff', 'Der Drache führt einen Schwanzangriff aus.'],
      [
        'Flügelangriff (kostet 2 Aktionen)',
        'Der Drache schlägt mit den Flügeln. Jede Kreatur im Umkreis von 3 m um den Drachen muss einen Geschicklichkeitsrettungswurf mit SG 20 bestehen, sonst erleidet sie 14 (2W6 + 7) Wuchtschaden und wird zu Boden geworfen. Der Drache kann dann bis zur Hälfte seiner Flugbewegungsrate fliegen.',
      ],
    ],
  },
  'adult-copper-dragon': {
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
        'Nahkampf-Waffenangriff: +11 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 17 (2W10 + 6) Stichschaden.',
      ],
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +11 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 13 (2W6 + 6) Hiebschaden.',
      ],
      [
        'Schwanz',
        'Nahkampf-Waffenangriff: +11 auf Treffer, Reichweite 4,5 m, ein Ziel. Treffer: 15 (2W8 + 6) Wuchtschaden.',
      ],
      [
        'Furchterregende Präsenz',
        'Jede Kreatur nach Wahl des Drachen im Umkreis von 36 m um ihn, die sich des Drachen bewusst ist, muss einen Weisheitsrettungswurf mit SG 16 bestehen, sonst ist sie 1 Minute lang verängstigt. Eine Kreatur kann den Rettungswurf am Ende jedes ihrer Züge wiederholen und beendet die Wirkung bei einem Erfolg für sich. Ist der Rettungswurf einer Kreatur erfolgreich oder endet die Wirkung für sie, ist die Kreatur für die nächsten 24 Stunden immun gegen die Furchterregende Präsenz des Drachen.',
      ],
      [
        'Odemwaffen (Aufladung 5–6)',
        'Der Drache setzt eine der folgenden Odemwaffen ein.\nSäureodem. Der Drache atmet Säure in einer 18-m-Linie aus, die 1,5 m breit ist. Jede Kreatur in dieser Linie muss einen Geschicklichkeitsrettungswurf mit SG 18 ablegen. Bei einem Misserfolg erleidet sie 54 (12W8) Säureschaden, bei einem Erfolg die Hälfte.\nVerlangsamender Odem. Der Drache atmet Gas in einem 18-m-Kegel aus. Jede Kreatur in diesem Bereich muss einen Konstitutionsrettungswurf mit SG 18 ablegen. Bei einem Misserfolg kann die Kreatur keine Reaktionen ausführen, ihre Bewegungsrate ist halbiert, und sie kann in ihrem Zug nicht mehr als einen Angriff ausführen. Außerdem kann die Kreatur in ihrem Zug entweder eine Aktion oder eine Bonusaktion nutzen, aber nicht beides. Diese Wirkungen halten 1 Minute lang an. Die Kreatur kann den Rettungswurf am Ende jedes ihrer Züge wiederholen und beendet die Wirkungen bei einem Erfolg für sich.',
      ],
    ],
    legendary:
      'Der Drache kann 3 legendäre Aktionen ausführen und wählt dabei aus den unten aufgeführten Optionen. Es kann jeweils nur eine legendäre Aktion eingesetzt werden, und nur am Ende des Zuges einer anderen Kreatur. Der Drache erhält verbrauchte legendäre Aktionen zu Beginn seines Zuges zurück.',
    legendaryActions: [
      ['Wahrnehmen', 'Der Drache legt einen Weisheitswurf (Wahrnehmung) ab.'],
      ['Schwanzangriff', 'Der Drache führt einen Schwanzangriff aus.'],
      [
        'Flügelangriff (kostet 2 Aktionen)',
        'Der Drache schlägt mit den Flügeln. Jede Kreatur im Umkreis von 3 m um den Drachen muss einen Geschicklichkeitsrettungswurf mit SG 19 bestehen, sonst erleidet sie 13 (2W6 + 6) Wuchtschaden und wird zu Boden geworfen. Der Drache kann dann bis zur Hälfte seiner Flugbewegungsrate fliegen.',
      ],
    ],
  },
  'adult-green-dragon': {
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
        'Nahkampf-Waffenangriff: +11 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 17 (2W10 + 6) Stichschaden plus 7 (2W6) Giftschaden.',
      ],
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +11 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 13 (2W6 + 6) Hiebschaden.',
      ],
      [
        'Schwanz',
        'Nahkampf-Waffenangriff: +11 auf Treffer, Reichweite 4,5 m, ein Ziel. Treffer: 15 (2W8 + 6) Wuchtschaden.',
      ],
      [
        'Furchterregende Präsenz',
        'Jede Kreatur nach Wahl des Drachen im Umkreis von 36 m um ihn, die sich des Drachen bewusst ist, muss einen Weisheitsrettungswurf mit SG 16 bestehen, sonst ist sie 1 Minute lang verängstigt. Eine Kreatur kann den Rettungswurf am Ende jedes ihrer Züge wiederholen und beendet die Wirkung bei einem Erfolg für sich. Ist der Rettungswurf einer Kreatur erfolgreich oder endet die Wirkung für sie, ist die Kreatur für die nächsten 24 Stunden immun gegen die Furchterregende Präsenz des Drachen.',
      ],
      [
        'Giftodem (Aufladung 5–6)',
        'Der Drache atmet giftiges Gas in einem 18-m-Kegel aus. Jede Kreatur in diesem Bereich muss einen Konstitutionsrettungswurf mit SG 18 ablegen. Bei einem Misserfolg erleidet sie 56 (16W6) Giftschaden, bei einem Erfolg die Hälfte.',
      ],
    ],
    legendary:
      'Der Drache kann 3 legendäre Aktionen ausführen und wählt dabei aus den unten aufgeführten Optionen. Es kann jeweils nur eine legendäre Aktion eingesetzt werden, und nur am Ende des Zuges einer anderen Kreatur. Der Drache erhält verbrauchte legendäre Aktionen zu Beginn seines Zuges zurück.',
    legendaryActions: [
      ['Wahrnehmen', 'Der Drache legt einen Weisheitswurf (Wahrnehmung) ab.'],
      ['Schwanzangriff', 'Der Drache führt einen Schwanzangriff aus.'],
      [
        'Flügelangriff (kostet 2 Aktionen)',
        'Der Drache schlägt mit den Flügeln. Jede Kreatur im Umkreis von 3 m um den Drachen muss einen Geschicklichkeitsrettungswurf mit SG 19 bestehen, sonst erleidet sie 13 (2W6 + 6) Wuchtschaden und wird zu Boden geworfen. Der Drache kann dann bis zur Hälfte seiner Flugbewegungsrate fliegen.',
      ],
    ],
  },
  'adult-silver-dragon': {
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
        'Nahkampf-Waffenangriff: +13 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 19 (2W10 + 8) Stichschaden.',
      ],
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +13 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 15 (2W6 + 8) Hiebschaden.',
      ],
      [
        'Schwanz',
        'Nahkampf-Waffenangriff: +13 auf Treffer, Reichweite 4,5 m, ein Ziel. Treffer: 17 (2W8 + 8) Wuchtschaden.',
      ],
      [
        'Furchterregende Präsenz',
        'Jede Kreatur nach Wahl des Drachen im Umkreis von 36 m um ihn, die sich des Drachen bewusst ist, muss einen Weisheitsrettungswurf mit SG 18 bestehen, sonst ist sie 1 Minute lang verängstigt. Eine Kreatur kann den Rettungswurf am Ende jedes ihrer Züge wiederholen und beendet die Wirkung bei einem Erfolg für sich. Ist der Rettungswurf einer Kreatur erfolgreich oder endet die Wirkung für sie, ist die Kreatur für die nächsten 24 Stunden immun gegen die Furchterregende Präsenz des Drachen.',
      ],
      [
        'Odemwaffen (Aufladung 5–6)',
        'Der Drache setzt eine der folgenden Odemwaffen ein.\nKälteodem. Der Drache atmet einen eisigen Stoß in einem 18-m-Kegel aus. Jede Kreatur in diesem Bereich muss einen Konstitutionsrettungswurf mit SG 20 ablegen. Bei einem Misserfolg erleidet sie 58 (13W8) Kälteschaden, bei einem Erfolg die Hälfte.\nLähmender Odem. Der Drache atmet lähmendes Gas in einem 18-m-Kegel aus. Jede Kreatur in diesem Bereich muss einen Konstitutionsrettungswurf mit SG 20 bestehen, sonst ist sie 1 Minute lang gelähmt. Eine Kreatur kann den Rettungswurf am Ende jedes ihrer Züge wiederholen und beendet die Wirkung bei einem Erfolg für sich.',
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
  'adult-white-dragon': {
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
        'Nahkampf-Waffenangriff: +11 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 17 (2W10 + 6) Stichschaden plus 4 (1W8) Kälteschaden.',
      ],
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +11 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 13 (2W6 + 6) Hiebschaden.',
      ],
      [
        'Schwanz',
        'Nahkampf-Waffenangriff: +11 auf Treffer, Reichweite 4,5 m, ein Ziel. Treffer: 15 (2W8 + 6) Wuchtschaden.',
      ],
      [
        'Furchterregende Präsenz',
        'Jede Kreatur nach Wahl des Drachen im Umkreis von 36 m um ihn, die sich des Drachen bewusst ist, muss einen Weisheitsrettungswurf mit SG 14 bestehen, sonst ist sie 1 Minute lang verängstigt. Eine Kreatur kann den Rettungswurf am Ende jedes ihrer Züge wiederholen und beendet die Wirkung bei einem Erfolg für sich. Ist der Rettungswurf einer Kreatur erfolgreich oder endet die Wirkung für sie, ist die Kreatur für die nächsten 24 Stunden immun gegen die Furchterregende Präsenz des Drachen.',
      ],
      [
        'Kälteodem (Aufladung 5–6)',
        'Der Drache atmet einen eisigen Stoß in einem 18-m-Kegel aus. Jede Kreatur in diesem Bereich muss einen Konstitutionsrettungswurf mit SG 19 ablegen. Bei einem Misserfolg erleidet sie 54 (12W8) Kälteschaden, bei einem Erfolg die Hälfte.',
      ],
    ],
    legendary:
      'Der Drache kann 3 legendäre Aktionen ausführen und wählt dabei aus den unten aufgeführten Optionen. Es kann jeweils nur eine legendäre Aktion eingesetzt werden, und nur am Ende des Zuges einer anderen Kreatur. Der Drache erhält verbrauchte legendäre Aktionen zu Beginn seines Zuges zurück.',
    legendaryActions: [
      ['Wahrnehmen', 'Der Drache legt einen Weisheitswurf (Wahrnehmung) ab.'],
      ['Schwanzangriff', 'Der Drache führt einen Schwanzangriff aus.'],
      [
        'Flügelangriff (kostet 2 Aktionen)',
        'Der Drache schlägt mit den Flügeln. Jede Kreatur im Umkreis von 3 m um den Drachen muss einen Geschicklichkeitsrettungswurf mit SG 19 bestehen, sonst erleidet sie 13 (2W6 + 6) Wuchtschaden und wird zu Boden geworfen. Der Drache kann dann bis zur Hälfte seiner Flugbewegungsrate fliegen.',
      ],
    ],
  },
  archmage: {
    traits: [
      [
        'Magieresistenz',
        'Der Erzmagier ist bei Rettungswürfen gegen Zauber und andere magische Effekte im Vorteil.',
      ],
      [
        'Zauberwirken',
        'Der Erzmagier ist ein Zauberwirker der 18. Stufe. Sein Attribut zum Zauberwirken ist Intelligenz (Zauberrettungswurf-SG 17, +9 auf Treffer mit Zauberangriffen). Der Erzmagier kann Selbstverkleidung und Unsichtbarkeit beliebig oft wirken und hat folgende Magierzauber vorbereitet:\n\n- Zaubertricks (beliebig oft): Feuerpfeil, Licht, Magierhand, Taschenspielerei, Schockgriff\n- 1. Grad (4 Plätze): Magie entdecken, Identifizieren, Magierrüstung*, Magisches Geschoss\n- 2. Grad (3 Plätze): Gedanken wahrnehmen, Spiegelbilder, Nebelschritt\n- 3. Grad (3 Plätze): Gegenzauber, Fliegen, Blitz\n- 4. Grad (3 Plätze): Verbannung, Feuerschild, Steinhaut*\n- 5. Grad (3 Plätze): Kältekegel, Ausspähung, Energiewand\n- 6. Grad (1 Platz): Kugel der Unverwundbarkeit\n- 7. Grad (1 Platz): Teleportieren\n- 8. Grad (1 Platz): Gedankenleere*\n- 9. Grad (1 Platz): Zeitstopp\n\n* Der Erzmagier wirkt diese Zauber vor dem Kampf auf sich selbst.',
      ],
    ],
    actions: [
      [
        'Dolch',
        'Nah- oder Fernkampf-Waffenangriff: +6 auf Treffer, Reichweite 1,5 m oder Reichweite 6/18 m, ein Ziel. Treffer: 4 (1W4 + 2) Stichschaden.',
      ],
    ],
  },
  behir: {
    actions: [
      [
        'Mehrfachangriff',
        'Der Behir führt zwei Angriffe aus: einen mit seinem Biss und einen, um zu würgen.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +10 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 22 (3W10 + 6) Stichschaden.',
      ],
      [
        'Würgen',
        'Nahkampf-Waffenangriff: +10 auf Treffer, Reichweite 1,5 m, eine große oder kleinere Kreatur. Treffer: 17 (2W10 + 6) Wuchtschaden plus 17 (2W10 + 6) Hiebschaden. Das Ziel wird gepackt (Entkommen-SG 16), sofern der Behir nicht bereits eine Kreatur würgt, und das Ziel ist festgesetzt, bis der Griff endet.',
      ],
      [
        'Blitzodem (Aufladung 5–6)',
        'Der Behir atmet eine Blitzlinie aus, die 6 m lang und 1,5 m breit ist. Jede Kreatur in dieser Linie muss einen Geschicklichkeitsrettungswurf mit SG 16 ablegen. Bei einem Misserfolg erleidet sie 66 (12W10) Blitzschaden, bei einem Erfolg die Hälfte.',
      ],
      [
        'Verschlucken',
        'Der Behir führt einen Bissangriff gegen ein mittelgroßes oder kleineres Ziel aus, das er gepackt hält. Trifft der Angriff, wird das Ziel außerdem verschluckt, und der Griff endet. Solange das Ziel verschluckt ist, ist es blind und festgesetzt, hat vollständige Deckung gegen Angriffe und andere Effekte von außerhalb des Behirs und erleidet zu Beginn jedes Zuges des Behirs 21 (6W6) Säureschaden. Ein Behir kann jeweils nur eine Kreatur verschluckt haben.\nErleidet der Behir in einem einzigen Zug 30 oder mehr Schaden durch die verschluckte Kreatur, muss er am Ende dieses Zuges einen Konstitutionsrettungswurf mit SG 14 bestehen, sonst würgt er die Kreatur wieder hervor, die in einem Bereich im Umkreis von 3 m um den Behir zu Boden fällt. Stirbt der Behir, ist eine verschluckte Kreatur nicht länger festgesetzt und kann mit 4,5 m Bewegung aus dem Kadaver entkommen; sie liegt danach am Boden.',
      ],
    ],
  },
  deva: {
    traits: [
      [
        'Engelswaffen',
        'Die Waffenangriffe des Devas sind magisch. Trifft der Deva mit einer beliebigen Waffe, verursacht die Waffe zusätzlich 4W8 gleißenden Schaden (im Angriff enthalten).',
      ],
      [
        'Angeborenes Zauberwirken',
        'Das Attribut des Devas zum Zauberwirken ist Charisma (Zauberrettungswurf-SG 17). Der Deva kann die folgenden Zauber angeboren wirken und benötigt dafür nur verbale Komponenten:\nBeliebig oft: Gutes und Böses entdecken\nJe 1-mal täglich: Kommunion, Tote erwecken',
      ],
      [
        'Magieresistenz',
        'Der Deva ist bei Rettungswürfen gegen Zauber und andere magische Effekte im Vorteil.',
      ],
    ],
    actions: [
      ['Mehrfachangriff', 'Der Deva führt zwei Nahkampfangriffe aus.'],
      [
        'Streitkolben',
        'Nahkampf-Waffenangriff: +8 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 7 (1W6 + 4) Wuchtschaden plus 18 (4W8) gleißenden Schaden.',
      ],
      [
        'Heilende Berührung (3-mal täglich)',
        'Der Deva berührt eine andere Kreatur. Das Ziel erhält magisch 20 (4W8 + 2) Trefferpunkte zurück und wird von jedem Fluch, jeder Krankheit, jedem Gift, jeder Blindheit und jeder Taubheit befreit.',
      ],
      [
        'Gestalt wandeln',
        'Der Deva verwandelt sich magisch in einen Humanoiden oder ein Tier mit einem Herausforderungsgrad, der höchstens so hoch ist wie sein eigener, oder zurück in seine wahre Gestalt. Stirbt er, nimmt er wieder seine wahre Gestalt an. Ausrüstung, die er trägt oder hält, wird von der neuen Gestalt aufgenommen oder getragen (nach Wahl des Devas).\nIn einer neuen Gestalt behält der Deva seine Spielwerte und seine Fähigkeit zu sprechen, doch seine RK, Bewegungsarten, Stärke, Geschicklichkeit und besonderen Sinne werden durch die der neuen Gestalt ersetzt, und er erhält alle Spielwerte und Fähigkeiten (außer Klassenmerkmalen, legendären Aktionen und Hortaktionen), welche die neue Gestalt besitzt, ihm aber fehlen.',
      ],
    ],
  },
  djinni: {
    traits: [
      [
        'Elementares Ende',
        'Stirbt der Dschinn, löst sich sein Körper in eine warme Brise auf und lässt nur die Ausrüstung zurück, die der Dschinn getragen oder gehalten hat.',
      ],
      [
        'Angeborenes Zauberwirken',
        'Das Attribut des Dschinns zum angeborenen Zauberwirken ist Charisma (Zauberrettungswurf-SG 17, +9 auf Treffer mit Zauberangriffen). Er kann die folgenden Zauber angeboren wirken, ohne Materialkomponenten zu benötigen:\nBeliebig oft: Gutes und Böses entdecken, Magie entdecken, Donnerwoge\nJe 3-mal täglich: Speise und Trank erschaffen (kann statt Wasser Wein erschaffen), Zungen, Windwandeln\nJe 1-mal täglich: Elementar herbeirufen (nur Luftelementar), Erschaffung, Gasförmige Gestalt, Unsichtbarkeit, Mächtiges Trugbild, Ebenenwechsel',
      ],
    ],
    actions: [
      ['Mehrfachangriff', 'Der Dschinn führt drei Krummsäbelangriffe aus.'],
      [
        'Krummsäbel',
        'Nahkampf-Waffenangriff: +9 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 12 (2W6 + 5) Hiebschaden plus 3 (1W6) Blitz- oder Schallschaden (nach Wahl des Dschinns).',
      ],
      [
        'Wirbelwind erschaffen',
        'Ein wirbelnder Luftzylinder mit 1,5 m Radius und 9 m Höhe bildet sich magisch an einem Punkt, den der Dschinn im Umkreis von 36 m sehen kann. Der Wirbelwind hält an, solange der Dschinn sich konzentriert (als würde er sich auf einen Zauber konzentrieren). Jede Kreatur außer dem Dschinn, die den Wirbelwind betritt, muss einen Stärkerettungswurf mit SG 18 bestehen, sonst wird sie von ihm festgesetzt. Der Dschinn kann den Wirbelwind als Aktion bis zu 18 m weit bewegen, und vom Wirbelwind festgesetzte Kreaturen bewegen sich mit ihm. Der Wirbelwind endet, wenn der Dschinn ihn aus den Augen verliert.\nEine Kreatur kann ihre Aktion nutzen, um eine vom Wirbelwind festgesetzte Kreatur, auch sich selbst, mit einem erfolgreichen Stärkewurf gegen SG 18 zu befreien. Gelingt der Wurf, ist die Kreatur nicht länger festgesetzt und bewegt sich in den nächstgelegenen Bereich außerhalb des Wirbelwinds.',
      ],
    ],
  },
  efreeti: {
    traits: [
      [
        'Elementares Ende',
        'Stirbt der Ifrit, löst sich sein Körper in einem Feuerblitz und einer Rauchwolke auf und lässt nur die Ausrüstung zurück, die er getragen oder gehalten hat.',
      ],
      [
        'Angeborenes Zauberwirken',
        'Das Attribut des Ifrits zum angeborenen Zauberwirken ist Charisma (Zauberrettungswurf-SG 15, +7 auf Treffer mit Zauberangriffen). Er kann die folgenden Zauber angeboren wirken, ohne Materialkomponenten zu benötigen:\nBeliebig oft: Magie entdecken\n3-mal täglich: Vergrößern/Verkleinern, Zungen\nJe 1-mal täglich: Elementar herbeirufen (nur Feuerelementar), Gasförmige Gestalt, Unsichtbarkeit, Mächtiges Trugbild, Ebenenwechsel, Feuerwand',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Ifrit führt zwei Krummsäbelangriffe aus oder setzt zweimal Flamme schleudern ein.',
      ],
      [
        'Krummsäbel',
        'Nahkampf-Waffenangriff: +10 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 13 (2W6 + 6) Hiebschaden plus 7 (2W6) Feuerschaden.',
      ],
      [
        'Flamme schleudern',
        'Fernkampf-Zauberangriff: +7 auf Treffer, Reichweite 36 m, ein Ziel. Treffer: 17 (5W6) Feuerschaden.',
      ],
    ],
  },
  erinyes: {
    traits: [
      [
        'Höllische Waffen',
        'Die Waffenangriffe der Erinnye sind magisch und verursachen bei einem Treffer zusätzlich 13 (3W8) Giftschaden (in den Angriffen enthalten).',
      ],
      [
        'Magieresistenz',
        'Die Erinnye ist bei Rettungswürfen gegen Zauber und andere magische Effekte im Vorteil.',
      ],
    ],
    actions: [
      ['Mehrfachangriff', 'Die Erinnye führt drei Angriffe aus.'],
      [
        'Langschwert',
        'Nahkampf-Waffenangriff: +8 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 8 (1W8 + 4) Hiebschaden, oder 9 (1W10 + 4) Hiebschaden, wenn mit zwei Händen geführt plus 13 (3W8) Giftschaden.',
      ],
      [
        'Langbogen',
        'Fernkampf-Waffenangriff: +7 auf Treffer, Reichweite 45/180 m, ein Ziel. Treffer: 7 (1W8 + 3) Stichschaden plus 13 (3W8) Giftschaden, und das Ziel muss einen Konstitutionsrettungswurf mit SG 14 bestehen, sonst ist es vergiftet. Die Vergiftung hält an, bis sie durch den Zauber Schwache Genesung oder ähnliche Magie aufgehoben wird.',
      ],
    ],
    reactions: [
      [
        'Parade',
        'Die Erinnye erhöht ihre RK gegen einen Nahkampfangriff, der sie treffen würde, um 4. Dazu muss die Erinnye den Angreifer sehen und eine Nahkampfwaffe führen.',
      ],
    ],
  },
  'guardian-naga': {
    traits: [
      [
        'Erneuerung',
        'Stirbt die Naga, kehrt sie nach 1W6 Tagen ins Leben zurück und erhält alle ihre Trefferpunkte zurück. Nur der Zauber Wunsch kann verhindern, dass dieses Merkmal wirkt.',
      ],
      [
        'Zauberwirken',
        'Die Naga ist eine Zauberwirkerin der 11. Stufe. Ihr Attribut zum Zauberwirken ist Weisheit (Zauberrettungswurf-SG 16, +8 auf Treffer mit Zauberangriffen), und sie benötigt nur verbale Komponenten, um ihre Zauber zu wirken. Sie hat folgende Klerikerzauber vorbereitet:\n\n- Zaubertricks (beliebig oft): Ausbessern, Heilige Flamme, Thaumaturgie\n- 1. Grad (4 Plätze): Befehl, Wunden heilen, Schild des Glaubens\n- 2. Grad (3 Plätze): Gefühle besänftigen, Person festhalten\n- 3. Grad (3 Plätze): Fluch, Hellsehen\n- 4. Grad (3 Plätze): Verbannung, Bewegungsfreiheit\n- 5. Grad (2 Plätze): Flammenschlag, Geas\n- 6. Grad (1 Platz): Wahrer Blick',
      ],
    ],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +8 auf Treffer, Reichweite 3 m, eine Kreatur. Treffer: 8 (1W8 + 4) Stichschaden, und das Ziel muss einen Konstitutionsrettungswurf mit SG 15 ablegen. Bei einem Misserfolg erleidet es 45 (10W8) Giftschaden, bei einem Erfolg die Hälfte.',
      ],
      [
        'Gift spucken',
        'Fernkampf-Waffenangriff: +8 auf Treffer, Reichweite 4,5/9 m, eine Kreatur. Treffer: Das Ziel muss einen Konstitutionsrettungswurf mit SG 15 ablegen. Bei einem Misserfolg erleidet es 45 (10W8) Giftschaden, bei einem Erfolg die Hälfte.',
      ],
    ],
  },
  gynosphinx: {
    traits: [
      [
        'Unergründlich',
        'Die Sphinx ist immun gegen jede Wirkung, die ihre Gefühle erspüren oder ihre Gedanken lesen würde, sowie gegen jeden Erkenntniszauber, den sie zurückweist. Weisheitswürfe (Motiv erkennen), mit denen die Absichten oder die Aufrichtigkeit der Sphinx ergründet werden sollen, sind im Nachteil.',
      ],
      ['Magische Waffen', 'Die Waffenangriffe der Sphinx sind magisch.'],
      [
        'Zauberwirken',
        'Die Sphinx ist eine Zauberwirkerin der 9. Stufe. Ihr Attribut zum Zauberwirken ist Intelligenz (Zauberrettungswurf-SG 16, +8 auf Treffer mit Zauberangriffen). Sie benötigt keine Materialkomponenten, um ihre Zauber zu wirken. Die Sphinx hat folgende Magierzauber vorbereitet:\n\n- Zaubertricks (beliebig oft): Magierhand, Kleine Illusion, Taschenspielerei\n- 1. Grad (4 Plätze): Magie entdecken, Identifizieren, Schild\n- 2. Grad (3 Plätze): Dunkelheit, Gegenstand aufspüren, Suggestion\n- 3. Grad (3 Plätze): Magie bannen, Fluch brechen, Zungen\n- 4. Grad (3 Plätze): Verbannung, Mächtige Unsichtbarkeit\n- 5. Grad (1 Platz): Legendenkunde',
      ],
    ],
    actions: [
      ['Mehrfachangriff', 'Die Sphinx führt zwei Klauenangriffe aus.'],
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +9 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 13 (2W8 + 4) Hiebschaden.',
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
  'horned-devil': {
    traits: [
      ['Teufelssicht', 'Magische Dunkelheit behindert die Dunkelsicht des Teufels nicht.'],
      [
        'Magieresistenz',
        'Der Teufel ist bei Rettungswürfen gegen Zauber und andere magische Effekte im Vorteil.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Teufel führt drei Nahkampfangriffe aus: zwei mit seiner Gabel und einen mit seinem Schwanz. Er kann anstelle jedes Nahkampfangriffs Flamme schleudern einsetzen.',
      ],
      [
        'Gabel',
        'Nahkampf-Waffenangriff: +10 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 15 (2W8 + 6) Stichschaden.',
      ],
      [
        'Schwanz',
        'Nahkampf-Waffenangriff: +10 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 10 (1W8 + 6) Stichschaden. Ist das Ziel eine Kreatur, die weder untot noch ein Konstrukt ist, muss es einen Konstitutionsrettungswurf mit SG 17 bestehen, sonst verliert es durch eine höllische Wunde zu Beginn jedes seiner Züge 10 (3W6) Trefferpunkte. Jedes Mal, wenn der Teufel das verwundete Ziel mit diesem Angriff trifft, steigt der Schaden durch die Wunde um 10 (3W6). Jede Kreatur kann eine Aktion nutzen, um die Wunde mit einem erfolgreichen Weisheitswurf (Heilkunde) gegen SG 12 zu stillen. Die Wunde schließt sich auch, wenn das Ziel magische Heilung erhält.',
      ],
      [
        'Flamme schleudern',
        'Fernkampf-Zauberangriff: +7 auf Treffer, Reichweite 45 m, ein Ziel. Treffer: 14 (4W6) Feuerschaden. Ist das Ziel ein brennbarer Gegenstand, der nicht getragen oder gehalten wird, fängt er außerdem Feuer.',
      ],
    ],
  },
  'ice-devil': {
    traits: [
      ['Teufelssicht', 'Magische Dunkelheit behindert die Dunkelsicht des Teufels nicht.'],
      [
        'Magieresistenz',
        'Der Teufel ist bei Rettungswürfen gegen Zauber und andere magische Effekte im Vorteil.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Teufel führt drei Angriffe aus: einen mit seinem Biss, einen mit seinen Klauen und einen mit seinem Schwanz.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +10 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 12 (2W6 + 5) Stichschaden plus 10 (3W6) Kälteschaden.',
      ],
      [
        'Klauen',
        'Nahkampf-Waffenangriff: +10 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 10 (2W4 + 5) Hiebschaden plus 10 (3W6) Kälteschaden.',
      ],
      [
        'Schwanz',
        'Nahkampf-Waffenangriff: +10 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 12 (2W6 + 5) Wuchtschaden plus 10 (3W6) Kälteschaden.',
      ],
      [
        'Eiswand',
        'Der Teufel erschafft magisch eine undurchsichtige Eiswand auf einer festen Oberfläche, die er im Umkreis von 18 m sehen kann. Die Wand ist 0,3 m dick und bis zu 9 m lang und 3 m hoch, oder sie ist eine halbkugelförmige Kuppel mit bis zu 6 m Durchmesser.\nErscheint die Wand, wird jede Kreatur in ihrem Bereich auf dem kürzesten Weg aus ihm hinausgestoßen. Die Kreatur wählt, auf welcher Seite der Wand sie landet, sofern sie nicht kampfunfähig ist. Dann legt die Kreatur einen Geschicklichkeitsrettungswurf mit SG 17 ab. Bei einem Misserfolg erleidet sie 35 (10W6) Kälteschaden, bei einem Erfolg die Hälfte.\nDie Wand hält 1 Minute lang an oder bis der Teufel kampfunfähig wird oder stirbt. Die Wand kann beschädigt und durchbrochen werden; jeder 3-m-Abschnitt hat RK 5, 30 Trefferpunkte, Anfälligkeit für Feuerschaden und Immunität gegen Säure-, Kälte-, nekrotischen, Gift- und psychischen Schaden. Wird ein Abschnitt zerstört, hinterlässt er eine Schicht eisiger Luft in dem Bereich, den die Wand eingenommen hat. Wann immer eine Kreatur in einem Zug ihre Bewegung durch die eisige Luft beendet, freiwillig oder nicht, muss sie einen Konstitutionsrettungswurf mit SG 17 ablegen. Bei einem Misserfolg erleidet sie 17 (5W6) Kälteschaden, bei einem Erfolg die Hälfte. Die eisige Luft verflüchtigt sich, wenn der Rest der Wand verschwindet.',
      ],
    ],
  },
  'iron-golem': {
    traits: [
      [
        'Feuerabsorption',
        'Wann immer der Golem Feuerschaden ausgesetzt ist, erleidet er keinen Schaden und erhält stattdessen Trefferpunkte in Höhe des verursachten Feuerschadens zurück.',
      ],
      [
        'Unveränderliche Gestalt',
        'Der Golem ist immun gegen jeden Zauber und jede Wirkung, die seine Gestalt verändern würde.',
      ],
      [
        'Magieresistenz',
        'Der Golem ist bei Rettungswürfen gegen Zauber und andere magische Effekte im Vorteil.',
      ],
      ['Magische Waffen', 'Die Waffenangriffe des Golems sind magisch.'],
    ],
    actions: [
      ['Mehrfachangriff', 'Der Golem führt zwei Nahkampfangriffe aus.'],
      [
        'Hieb',
        'Nahkampf-Waffenangriff: +13 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 20 (3W8 + 7) Wuchtschaden.',
      ],
      [
        'Schwert',
        'Nahkampf-Waffenangriff: +13 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 23 (3W10 + 7) Hiebschaden.',
      ],
      [
        'Giftodem (Aufladung 5–6)',
        'Der Golem atmet giftiges Gas in einem 4,5-m-Kegel aus. Jede Kreatur in diesem Bereich muss einen Konstitutionsrettungswurf mit SG 19 ablegen. Bei einem Misserfolg erleidet sie 45 (10W8) Giftschaden, bei einem Erfolg die Hälfte.',
      ],
    ],
  },
  marilith: {
    traits: [
      [
        'Magieresistenz',
        'Die Marilith ist bei Rettungswürfen gegen Zauber und andere magische Effekte im Vorteil.',
      ],
      ['Magische Waffen', 'Die Waffenangriffe der Marilith sind magisch.'],
      ['Reaktionsschnell', 'Die Marilith kann in jedem Zug im Kampf eine Reaktion ausführen.'],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Die Marilith kann sieben Angriffe ausführen: sechs mit ihren Langschwertern und einen mit ihrem Schwanz.',
      ],
      [
        'Langschwert',
        'Nahkampf-Waffenangriff: +9 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 13 (2W8 + 4) Hiebschaden.',
      ],
      [
        'Schwanz',
        'Nahkampf-Waffenangriff: +9 auf Treffer, Reichweite 3 m, eine Kreatur. Treffer: 15 (2W10 + 4) Wuchtschaden. Ist das Ziel mittelgroß oder kleiner, wird es gepackt (Entkommen-SG 19). Bis der Griff endet, ist das Ziel festgesetzt, die Marilith trifft das Ziel mit ihrem Schwanz automatisch und kann keine Schwanzangriffe gegen andere Ziele ausführen.',
      ],
      [
        'Teleportieren',
        'Die Marilith teleportiert sich magisch samt der Ausrüstung, die sie trägt oder hält, bis zu 36 m weit in einen freien Bereich, den sie sehen kann.',
      ],
    ],
    reactions: [
      [
        'Parade',
        'Die Marilith erhöht ihre RK gegen einen Nahkampfangriff, der sie treffen würde, um 5. Dazu muss die Marilith den Angreifer sehen und eine Nahkampfwaffe führen.',
      ],
    ],
  },
  'mummy-lord': {
    traits: [
      [
        'Magieresistenz',
        'Der Mumienfürst ist bei Rettungswürfen gegen Zauber und andere magische Effekte im Vorteil.',
      ],
      [
        'Erneuerung',
        'Ein zerstörter Mumienfürst erhält nach 24 Stunden einen neuen Körper, sofern sein Herz unversehrt ist, erhält all seine Trefferpunkte zurück und wird wieder aktiv. Der neue Körper erscheint im Umkreis von 1,5 m um das Herz des Mumienfürsten.',
      ],
      [
        'Zauberwirken',
        'Der Mumienfürst ist ein Zauberwirker der 10. Stufe. Sein Attribut zum Zauberwirken ist Weisheit (Zauberrettungswurf-SG 17, +9 auf Treffer mit Zauberangriffen). Der Mumienfürst hat folgende Klerikerzauber vorbereitet:\n\n- Zaubertricks (beliebig oft): Heilige Flamme, Thaumaturgie\n- 1. Grad (4 Plätze): Befehl, Lenkendes Geschoss, Schild des Glaubens\n- 2. Grad (3 Plätze): Person festhalten, Stille, Spirituelle Waffe\n- 3. Grad (3 Plätze): Tote beleben, Magie bannen\n- 4. Grad (3 Plätze): Weissagung, Wächter des Glaubens\n- 5. Grad (2 Plätze): Ansteckung, Insektenplage\n- 6. Grad (1 Platz): Leid',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Mumienfürst kann seinen Grauenvollen Blick einsetzen und führt einen Angriff mit seiner Fäulnisfaust aus.',
      ],
      [
        'Fäulnisfaust',
        'Nahkampf-Waffenangriff: +9 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 14 (3W6 + 4) Wuchtschaden plus 21 (6W6) nekrotischen Schaden. Ist das Ziel eine Kreatur, muss es einen Konstitutionsrettungswurf mit SG 16 bestehen, sonst wird es mit Mumienfäule verflucht. Das verfluchte Ziel kann keine Trefferpunkte zurückerhalten, und sein Trefferpunktemaximum sinkt alle 24 Stunden um 10 (3W6). Senkt der Fluch das Trefferpunktemaximum des Ziels auf 0, stirbt das Ziel, und sein Körper zerfällt zu Staub. Der Fluch hält an, bis er durch den Zauber Fluch brechen oder andere Magie aufgehoben wird.',
      ],
      [
        'Grauenvoller Blick',
        'Der Mumienfürst wählt eine Kreatur, die er im Umkreis von 18 m sehen kann, als Ziel. Kann das Ziel den Mumienfürsten sehen, muss es einen Weisheitsrettungswurf mit SG 16 gegen diese Magie bestehen, sonst ist es bis zum Ende des nächsten Zuges des Mumienfürsten verängstigt. Misslingt dem Ziel der Rettungswurf um 5 oder mehr, ist es für dieselbe Dauer außerdem gelähmt. Ein Ziel, dessen Rettungswurf gelingt, ist für die nächsten 24 Stunden immun gegen den Grauenvollen Blick aller Mumien und Mumienfürsten.',
      ],
    ],
    legendary:
      'Der Mumienfürst kann 3 legendäre Aktionen ausführen und wählt dabei aus den unten aufgeführten Optionen. Es kann jeweils nur eine legendäre Aktion eingesetzt werden, und nur am Ende des Zuges einer anderen Kreatur. Der Mumienfürst erhält verbrauchte legendäre Aktionen zu Beginn seines Zuges zurück.',
    legendaryActions: [
      [
        'Angriff',
        'Der Mumienfürst führt einen Angriff mit seiner Fäulnisfaust aus oder setzt seinen Grauenvollen Blick ein.',
      ],
      [
        'Blendender Staub',
        'Blendender Staub und Sand wirbeln magisch um den Mumienfürsten. Jede Kreatur im Umkreis von 1,5 m um den Mumienfürsten muss einen Konstitutionsrettungswurf mit SG 16 bestehen, sonst ist sie bis zum Ende ihres nächsten Zuges blind.',
      ],
      [
        'Lästerwort (kostet 2 Aktionen)',
        'Der Mumienfürst spricht ein lästerliches Wort. Jede nicht untote Kreatur im Umkreis von 3 m um den Mumienfürsten, welche die magische Äußerung hören kann, muss einen Konstitutionsrettungswurf mit SG 16 bestehen, sonst ist sie bis zum Ende des nächsten Zuges des Mumienfürsten betäubt.',
      ],
      [
        'Negative Energie kanalisieren (kostet 2 Aktionen)',
        'Der Mumienfürst entfesselt magisch negative Energie. Kreaturen im Umkreis von 18 m um den Mumienfürsten, auch solche hinter Barrieren und um Ecken, können bis zum Ende des nächsten Zuges des Mumienfürsten keine Trefferpunkte zurückerhalten.',
      ],
      [
        'Sandwirbel (kostet 2 Aktionen)',
        'Der Mumienfürst verwandelt sich magisch in einen Wirbelwind aus Sand, bewegt sich bis zu 18 m und nimmt wieder seine normale Gestalt an. In Wirbelwindgestalt ist der Mumienfürst immun gegen jeden Schaden und kann weder gepackt, versteinert, zu Boden geworfen, festgesetzt noch betäubt werden. Ausrüstung, die der Mumienfürst trägt oder hält, bleibt in seinem Besitz.',
      ],
    ],
  },
  nalfeshnee: {
    traits: [
      [
        'Magieresistenz',
        'Der Nalfeshnee ist bei Rettungswürfen gegen Zauber und andere magische Effekte im Vorteil.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Nalfeshnee setzt Schreckensnimbus ein, wenn er kann. Dann führt er drei Angriffe aus: einen mit seinem Biss und zwei mit seinen Klauen.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +10 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 32 (5W10 + 5) Stichschaden.',
      ],
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +10 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 15 (3W6 + 5) Hiebschaden.',
      ],
      [
        'Schreckensnimbus (Aufladung 5–6)',
        'Der Nalfeshnee strahlt magisch funkelndes, vielfarbiges Licht aus. Jede Kreatur im Umkreis von 4,5 m um den Nalfeshnee, die das Licht sehen kann, muss einen Weisheitsrettungswurf mit SG 15 bestehen, sonst ist sie 1 Minute lang verängstigt. Eine Kreatur kann den Rettungswurf am Ende jedes ihrer Züge wiederholen und beendet die Wirkung bei einem Erfolg für sich. Ist der Rettungswurf einer Kreatur erfolgreich oder endet die Wirkung für sie, ist die Kreatur für die nächsten 24 Stunden immun gegen den Schreckensnimbus des Nalfeshnees.',
      ],
      [
        'Teleportieren',
        'Der Nalfeshnee teleportiert sich magisch samt der Ausrüstung, die er trägt oder hält, bis zu 36 m weit in einen freien Bereich, den er sehen kann.',
      ],
    ],
  },
  planetar: {
    traits: [
      [
        'Engelswaffen',
        'Die Waffenangriffe des Planetars sind magisch. Trifft der Planetar mit einer beliebigen Waffe, verursacht die Waffe zusätzlich 5W8 gleißenden Schaden (im Angriff enthalten).',
      ],
      ['Göttliches Gespür', 'Der Planetar erkennt, wenn er eine Lüge hört.'],
      [
        'Angeborenes Zauberwirken',
        'Das Attribut des Planetars zum Zauberwirken ist Charisma (Zauberrettungswurf-SG 20). Der Planetar kann die folgenden Zauber angeboren wirken, ohne Materialkomponenten zu benötigen:\nBeliebig oft: Gutes und Böses entdecken, Unsichtbarkeit (nur selbst)\nJe 3-mal täglich: Klingenbarriere, Gutes und Böses bannen, Flammenschlag, Tote erwecken\nJe 1-mal täglich: Kommunion, Wetterkontrolle, Insektenplage',
      ],
      [
        'Magieresistenz',
        'Der Planetar ist bei Rettungswürfen gegen Zauber und andere magische Effekte im Vorteil.',
      ],
    ],
    actions: [
      ['Mehrfachangriff', 'Der Planetar führt zwei Nahkampfangriffe aus.'],
      [
        'Zweihandschwert',
        'Nahkampf-Waffenangriff: +12 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 21 (4W6 + 7) Hiebschaden plus 22 (5W8) gleißenden Schaden.',
      ],
      [
        'Heilende Berührung (4-mal täglich)',
        'Der Planetar berührt eine andere Kreatur. Das Ziel erhält magisch 30 (6W8 + 3) Trefferpunkte zurück und wird von jedem Fluch, jeder Krankheit, jedem Gift, jeder Blindheit und jeder Taubheit befreit.',
      ],
    ],
  },
  'purple-worm': {
    traits: [
      [
        'Tunnelgräber',
        'Der Wurm kann sich mit halber Grabbewegungsrate durch festen Fels graben und hinterlässt einen Tunnel mit 3 m Durchmesser.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Wurm führt zwei Angriffe aus: einen mit seinem Biss und einen mit seinem Giftstachel.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +9 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 22 (3W8 + 9) Stichschaden. Ist das Ziel eine große oder kleinere Kreatur, muss es einen Geschicklichkeitsrettungswurf mit SG 19 bestehen, sonst wird es von dem Wurm verschluckt. Eine verschluckte Kreatur ist blind und festgesetzt, hat vollständige Deckung gegen Angriffe und andere Effekte von außerhalb des Wurms und erleidet zu Beginn jedes Zuges des Wurms 21 (6W6) Säureschaden.\nErleidet der Wurm in einem einzigen Zug 30 oder mehr Schaden durch eine Kreatur in seinem Inneren, muss er am Ende dieses Zuges einen Konstitutionsrettungswurf mit SG 21 bestehen, sonst würgt er alle verschluckten Kreaturen wieder hervor, die in einem Bereich im Umkreis von 3 m um den Wurm zu Boden fallen. Stirbt der Wurm, ist eine verschluckte Kreatur nicht länger festgesetzt und kann mit 6 m Bewegung aus dem Kadaver entkommen; sie liegt danach am Boden.',
      ],
      [
        'Schwanzstachel',
        'Nahkampf-Waffenangriff: +9 auf Treffer, Reichweite 3 m, eine Kreatur. Treffer: 19 (3W6 + 9) Stichschaden, und das Ziel muss einen Konstitutionsrettungswurf mit SG 19 ablegen. Bei einem Misserfolg erleidet es 42 (12W6) Giftschaden, bei einem Erfolg die Hälfte.',
      ],
    ],
  },
  rakshasa: {
    traits: [
      [
        'Eingeschränkte Magieimmunität',
        'Der Rakshasa kann von Zaubern des 6. Grades oder niedriger nicht beeinflusst oder entdeckt werden, es sei denn, er will es. Er ist bei Rettungswürfen gegen alle anderen Zauber und magischen Effekte im Vorteil.',
      ],
      [
        'Angeborenes Zauberwirken',
        'Das Attribut des Rakshasas zum angeborenen Zauberwirken ist Charisma (Zauberrettungswurf-SG 18, +10 auf Treffer mit Zauberangriffen). Der Rakshasa kann die folgenden Zauber angeboren wirken, ohne Materialkomponenten zu benötigen:\nBeliebig oft: Gedanken wahrnehmen, Selbstverkleidung, Magierhand, Kleine Illusion\nJe 3-mal täglich: Person bezaubern, Magie entdecken, Unsichtbarkeit, Mächtiges Trugbild, Suggestion\nJe 1-mal täglich: Person beherrschen, Fliegen, Ebenenwechsel, Wahrer Blick',
      ],
    ],
    actions: [
      ['Mehrfachangriff', 'Der Rakshasa führt zwei Klauenangriffe aus.'],
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 9 (2W6 + 2) Hiebschaden, und das Ziel wird verflucht, sofern es eine Kreatur ist. Der magische Fluch wirkt, wann immer das Ziel eine kurze oder lange Rast einlegt, und erfüllt seine Gedanken mit schrecklichen Bildern und Träumen. Das verfluchte Ziel zieht keinen Nutzen aus dem Beenden einer kurzen oder langen Rast. Der Fluch hält an, bis er durch den Zauber Fluch brechen oder ähnliche Magie aufgehoben wird.',
      ],
    ],
  },
  remorhaz: {
    traits: [
      [
        'Glühender Körper',
        'Eine Kreatur, die den Remorhaz berührt oder ihn mit einem Nahkampfangriff trifft, während sie sich im Umkreis von 1,5 m um ihn befindet, erleidet 10 (3W6) Feuerschaden.',
      ],
    ],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +11 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 40 (6W10 + 7) Stichschaden plus 10 (3W6) Feuerschaden. Ist das Ziel eine Kreatur, wird es gepackt (Entkommen-SG 17). Bis der Griff endet, ist das Ziel festgesetzt, und der Remorhaz kann kein anderes Ziel beißen.',
      ],
      [
        'Verschlucken',
        'Der Remorhaz führt einen Bissangriff gegen eine mittelgroße oder kleinere Kreatur aus, die er gepackt hält. Trifft der Angriff, erleidet die Kreatur den Schaden des Bisses und wird verschluckt, und der Griff endet. Solange die Kreatur verschluckt ist, ist sie blind und festgesetzt, hat vollständige Deckung gegen Angriffe und andere Effekte von außerhalb des Remorhazes und erleidet zu Beginn jedes Zuges des Remorhazes 21 (6W6) Säureschaden.\nErleidet der Remorhaz in einem einzigen Zug 30 oder mehr Schaden durch eine Kreatur in seinem Inneren, muss er am Ende dieses Zuges einen Konstitutionsrettungswurf mit SG 15 bestehen, sonst würgt er alle verschluckten Kreaturen wieder hervor, die in einem Bereich im Umkreis von 3 m um den Remorhaz zu Boden fallen. Stirbt der Remorhaz, ist eine verschluckte Kreatur nicht länger festgesetzt und kann mit 4,5 m Bewegung aus dem Kadaver entkommen; sie liegt danach am Boden.',
      ],
    ],
  },
  roc: {
    traits: [
      [
        'Scharfe Sicht',
        'Der Roch ist bei Weisheitswürfen (Wahrnehmung), die auf der Sicht beruhen, im Vorteil.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Roch führt zwei Angriffe aus: einen mit seinem Schnabel und einen mit seinen Krallen.',
      ],
      [
        'Schnabel',
        'Nahkampf-Waffenangriff: +13 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 27 (4W8 + 9) Stichschaden.',
      ],
      [
        'Krallen',
        'Nahkampf-Waffenangriff: +13 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 23 (4W6 + 9) Hiebschaden, und das Ziel wird gepackt (Entkommen-SG 19). Bis der Griff endet, ist das Ziel festgesetzt, und der Roch kann seine Krallen nicht gegen ein anderes Ziel einsetzen.',
      ],
    ],
  },
  'stone-golem': {
    traits: [
      [
        'Unveränderliche Gestalt',
        'Der Golem ist immun gegen jeden Zauber und jede Wirkung, die seine Gestalt verändern würde.',
      ],
      [
        'Magieresistenz',
        'Der Golem ist bei Rettungswürfen gegen Zauber und andere magische Effekte im Vorteil.',
      ],
      ['Magische Waffen', 'Die Waffenangriffe des Golems sind magisch.'],
    ],
    actions: [
      ['Mehrfachangriff', 'Der Golem führt zwei Hiebangriffe aus.'],
      [
        'Hieb',
        'Nahkampf-Waffenangriff: +10 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 19 (3W8 + 6) Wuchtschaden.',
      ],
      [
        'Verlangsamen (Aufladung 5–6)',
        'Der Golem wählt eine oder mehrere Kreaturen, die er im Umkreis von 3 m sehen kann, als Ziel. Jedes Ziel muss einen Weisheitsrettungswurf mit SG 17 gegen diese Magie ablegen. Bei einem Misserfolg kann ein Ziel keine Reaktionen ausführen, seine Bewegungsrate ist halbiert, und es kann in seinem Zug nicht mehr als einen Angriff ausführen. Außerdem kann das Ziel in seinem Zug entweder eine Aktion oder eine Bonusaktion nutzen, nicht beides. Diese Wirkungen halten 1 Minute lang an. Ein Ziel kann den Rettungswurf am Ende jedes seiner Züge wiederholen und beendet die Wirkung bei einem Erfolg für sich.',
      ],
    ],
  },
  'storm-giant': {
    traits: [
      ['Amphibisch', 'Der Riese kann Luft und Wasser atmen.'],
      [
        'Angeborenes Zauberwirken',
        'Das Attribut des Riesen zum angeborenen Zauberwirken ist Charisma (Zauberrettungswurf-SG 17). Er kann die folgenden Zauber angeboren wirken, ohne Materialkomponenten zu benötigen:\nBeliebig oft: Magie entdecken, Federfall, Schweben, Licht\nJe 3-mal täglich: Wetterkontrolle, Wasser atmen',
      ],
    ],
    actions: [
      ['Mehrfachangriff', 'Der Riese führt zwei Zweihandschwertangriffe aus.'],
      [
        'Zweihandschwert',
        'Nahkampf-Waffenangriff: +14 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 30 (6W6 + 9) Hiebschaden.',
      ],
      [
        'Fels',
        'Fernkampf-Waffenangriff: +14 auf Treffer, Reichweite 18/72 m, ein Ziel. Treffer: 35 (4W12 + 9) Wuchtschaden.',
      ],
      [
        'Blitzschlag (Aufladung 5–6)',
        'Der Riese schleudert einen magischen Blitz auf einen Punkt, den er im Umkreis von 150 m sehen kann. Jede Kreatur im Umkreis von 3 m um diesen Punkt muss einen Geschicklichkeitsrettungswurf mit SG 17 ablegen. Bei einem Misserfolg erleidet sie 54 (12W8) Blitzschaden, bei einem Erfolg die Hälfte.',
      ],
    ],
  },
  'vampire-bat': {
    traits: [
      [
        'Gestaltwandler',
        'Befindet sich der Vampir nicht im Sonnenlicht oder in fließendem Wasser, kann er seine Aktion nutzen, um sich in eine winzige Fledermaus oder eine mittelgroße Nebelwolke zu verwandeln oder zurück in seine wahre Gestalt.\nIn Fledermausgestalt kann der Vampir nicht sprechen, seine Bewegungsrate am Boden beträgt 1,5 m, und er hat eine Flugbewegungsrate von 9 m. Seine Spielwerte bleiben bis auf Größe und Bewegungsrate unverändert. Was er am Körper trägt, verwandelt sich mit ihm, nicht aber, was er in den Händen hält. Stirbt er, nimmt er wieder seine wahre Gestalt an.\nIn Nebelgestalt kann der Vampir keine Aktionen ausführen, nicht sprechen und keine Gegenstände handhaben. Er ist schwerelos, hat eine Flugbewegungsrate von 6 m, kann schweben und den Bereich einer feindseligen Kreatur betreten und dort anhalten. Außerdem kann der Nebel jeden Bereich, durch den Luft dringen kann, durchqueren, ohne sich zwängen zu müssen, aber kein Wasser durchdringen. Er ist bei Stärke-, Geschicklichkeits- und Konstitutionsrettungswürfen im Vorteil und immun gegen jeden nichtmagischen Schaden, außer dem Schaden durch Sonnenlicht.',
      ],
      [
        'Legendäre Resistenz (3-mal täglich)',
        'Misslingt dem Vampir ein Rettungswurf, kann er sich entscheiden, ihn stattdessen zu bestehen.',
      ],
      [
        'Nebelflucht',
        'Sinkt er außerhalb seiner Ruhestätte auf 0 Trefferpunkte, verwandelt sich der Vampir in eine Nebelwolke (wie beim Merkmal Gestaltwandler), statt bewusstlos zu werden, sofern er sich nicht im Sonnenlicht oder in fließendem Wasser befindet. Kann er sich nicht verwandeln, wird er zerstört.\nSolange er in Nebelgestalt 0 Trefferpunkte hat, kann er nicht in seine Vampirgestalt zurückkehren und muss seine Ruhestätte innerhalb von 2 Stunden erreichen, sonst wird er zerstört. An seiner Ruhestätte angekommen, nimmt er wieder seine Vampirgestalt an. Dann ist er gelähmt, bis er mindestens 1 Trefferpunkt zurückerhält. Nach 1 Stunde an seiner Ruhestätte mit 0 Trefferpunkten erhält er 1 Trefferpunkt zurück.',
      ],
      [
        'Regeneration',
        'Der Vampir erhält zu Beginn seines Zuges 20 Trefferpunkte zurück, sofern er mindestens 1 Trefferpunkt hat und sich nicht im Sonnenlicht oder in fließendem Wasser befindet. Erleidet der Vampir gleißenden Schaden oder Schaden durch Weihwasser, wirkt dieses Merkmal zu Beginn des nächsten Zuges des Vampirs nicht.',
      ],
      [
        'Spinnenklettern',
        'Der Vampir kann an schwierigen Oberflächen klettern, auch kopfüber an Decken, ohne einen Attributswurf ablegen zu müssen.',
      ],
      [
        'Schwächen des Vampirs',
        'Der Vampir hat folgende Schwächen:\nVerbot. Der Vampir kann einen Wohnsitz nicht ohne Einladung eines der Bewohner betreten.\nSchaden durch fließendes Wasser. Der Vampir erleidet 20 Säureschaden, wenn er seinen Zug in fließendem Wasser beendet.\nPfahl ins Herz. Wird dem Vampir eine Stichwaffe aus Holz ins Herz getrieben, während der Vampir an seiner Ruhestätte kampfunfähig ist, ist der Vampir gelähmt, bis der Pfahl entfernt wird.\nÜberempfindlichkeit gegen Sonnenlicht. Der Vampir erleidet 20 gleißenden Schaden, wenn er seinen Zug im Sonnenlicht beginnt. Im Sonnenlicht ist er bei Angriffswürfen und Attributswürfen im Nachteil.',
      ],
    ],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +9 auf Treffer, Reichweite 1,5 m, eine bereitwillige Kreatur oder eine Kreatur, die von dem Vampir gepackt wird, kampfunfähig oder festgesetzt ist. Treffer: 7 (1W6 + 4) Stichschaden plus 10 (3W6) nekrotischen Schaden. Das Trefferpunktemaximum des Ziels sinkt um den erlittenen nekrotischen Schaden, und der Vampir erhält Trefferpunkte in dieser Höhe zurück. Die Verringerung hält an, bis das Ziel eine lange Rast beendet. Das Ziel stirbt, wenn diese Wirkung sein Trefferpunktemaximum auf 0 senkt. Ein auf diese Weise getöteter und dann in der Erde begrabener Humanoider erhebt sich in der folgenden Nacht als Vampirbrut unter der Kontrolle des Vampirs.',
      ],
      [
        'Bezaubern',
        'Der Vampir wählt einen Humanoiden, den er im Umkreis von 9 m sehen kann, als Ziel. Kann das Ziel den Vampir sehen, muss es einen Weisheitsrettungswurf mit SG 17 gegen diese Magie bestehen, sonst ist es von dem Vampir bezaubert. Das bezauberte Ziel betrachtet den Vampir als vertrauten Freund, auf den es hört und den es beschützt. Obwohl das Ziel nicht unter der Kontrolle des Vampirs steht, nimmt es seine Bitten oder Handlungen so wohlwollend wie möglich auf, und es ist ein bereitwilliges Ziel für den Bissangriff des Vampirs.\nJedes Mal, wenn der Vampir oder seine Gefährten dem Ziel etwas Schädliches antun, kann es den Rettungswurf wiederholen und beendet die Wirkung bei einem Erfolg für sich. Andernfalls hält die Wirkung 24 Stunden lang an oder bis der Vampir zerstört wird, sich auf einer anderen Existenzebene als das Ziel befindet oder die Wirkung mit einer Bonusaktion beendet.',
      ],
      [
        'Kinder der Nacht (1-mal täglich)',
        'Der Vampir ruft magisch 2W4 Schwärme von Fledermäusen oder Ratten herbei, sofern die Sonne nicht aufgegangen ist. Im Freien kann der Vampir stattdessen 3W6 Wölfe herbeirufen. Die gerufenen Kreaturen treffen nach 1W4 Runden ein, handeln als Verbündete des Vampirs und gehorchen seinen gesprochenen Befehlen. Die Tiere bleiben 1 Stunde lang, bis der Vampir stirbt oder bis der Vampir sie mit einer Bonusaktion entlässt.',
      ],
    ],
    legendary:
      'Der Vampir in Fledermausgestalt kann 3 legendäre Aktionen ausführen und wählt dabei aus den unten aufgeführten Optionen. Es kann jeweils nur eine legendäre Aktion eingesetzt werden, und nur am Ende des Zuges einer anderen Kreatur. Der Vampir erhält verbrauchte legendäre Aktionen zu Beginn seines Zuges zurück.',
    legendaryActions: [
      [
        'Bewegen',
        'Der Vampir bewegt sich bis zu seiner Bewegungsrate, ohne Gelegenheitsangriffe zu provozieren.',
      ],
      ['Waffenloser Angriff', 'Der Vampir führt einen waffenlosen Angriff aus.'],
      ['Biss (kostet 2 Aktionen)', 'Der Vampir führt einen Bissangriff aus.'],
    ],
  },
  'vampire-mist': {
    traits: [
      [
        'Gestaltwandler',
        'Befindet sich der Vampir nicht im Sonnenlicht oder in fließendem Wasser, kann er seine Aktion nutzen, um sich in eine winzige Fledermaus oder eine mittelgroße Nebelwolke zu verwandeln oder zurück in seine wahre Gestalt.\nIn Fledermausgestalt kann der Vampir nicht sprechen, seine Bewegungsrate am Boden beträgt 1,5 m, und er hat eine Flugbewegungsrate von 9 m. Seine Spielwerte bleiben bis auf Größe und Bewegungsrate unverändert. Was er am Körper trägt, verwandelt sich mit ihm, nicht aber, was er in den Händen hält. Stirbt er, nimmt er wieder seine wahre Gestalt an.\nIn Nebelgestalt kann der Vampir keine Aktionen ausführen, nicht sprechen und keine Gegenstände handhaben. Er ist schwerelos, hat eine Flugbewegungsrate von 6 m, kann schweben und den Bereich einer feindseligen Kreatur betreten und dort anhalten. Außerdem kann der Vampir jeden Bereich, durch den Luft dringen kann, durchqueren, ohne sich zwängen zu müssen, aber kein Wasser durchdringen. Er ist bei Stärke-, Geschicklichkeits- und Konstitutionsrettungswürfen im Vorteil und immun gegen jeden nichtmagischen Schaden, außer dem Schaden durch Sonnenlicht.',
      ],
      [
        'Legendäre Resistenz (3-mal täglich)',
        'Misslingt dem Vampir ein Rettungswurf, kann er sich entscheiden, ihn stattdessen zu bestehen.',
      ],
      [
        'Nebelflucht',
        'Sinkt er außerhalb seiner Ruhestätte auf 0 Trefferpunkte, verwandelt sich der Vampir in eine Nebelwolke (wie beim Merkmal Gestaltwandler), statt bewusstlos zu werden, sofern er sich nicht im Sonnenlicht oder in fließendem Wasser befindet. Kann er sich nicht verwandeln, wird er zerstört.\nSolange er in Nebelgestalt 0 Trefferpunkte hat, kann er nicht in seine Vampirgestalt zurückkehren und muss seine Ruhestätte innerhalb von 2 Stunden erreichen, sonst wird er zerstört. An seiner Ruhestätte angekommen, nimmt er wieder seine Vampirgestalt an. Dann ist er gelähmt, bis er mindestens 1 Trefferpunkt zurückerhält. Nach 1 Stunde an seiner Ruhestätte mit 0 Trefferpunkten erhält er 1 Trefferpunkt zurück.',
      ],
      [
        'Regeneration',
        'Der Vampir erhält zu Beginn seines Zuges 20 Trefferpunkte zurück, sofern er mindestens 1 Trefferpunkt hat und sich nicht im Sonnenlicht oder in fließendem Wasser befindet. Erleidet der Vampir gleißenden Schaden oder Schaden durch Weihwasser, wirkt dieses Merkmal zu Beginn des nächsten Zuges des Vampirs nicht.',
      ],
      [
        'Spinnenklettern',
        'Der Vampir kann an schwierigen Oberflächen klettern, auch kopfüber an Decken, ohne einen Attributswurf ablegen zu müssen.',
      ],
      [
        'Schwächen des Vampirs',
        'Der Vampir hat folgende Schwächen:\nVerbot. Der Vampir kann einen Wohnsitz nicht ohne Einladung eines der Bewohner betreten.\nSchaden durch fließendes Wasser. Der Vampir erleidet 20 Säureschaden, wenn er seinen Zug in fließendem Wasser beendet.\nPfahl ins Herz. Wird dem Vampir eine Stichwaffe aus Holz ins Herz getrieben, während der Vampir an seiner Ruhestätte kampfunfähig ist, ist der Vampir gelähmt, bis der Pfahl entfernt wird.\nÜberempfindlichkeit gegen Sonnenlicht. Der Vampir erleidet 20 gleißenden Schaden, wenn er seinen Zug im Sonnenlicht beginnt. Im Sonnenlicht ist er bei Angriffswürfen und Attributswürfen im Nachteil.',
      ],
    ],
    legendary:
      'Der Vampir in Nebelgestalt kann 3 legendäre Aktionen ausführen und wählt dabei aus den unten aufgeführten Optionen. Es kann jeweils nur eine legendäre Aktion eingesetzt werden, und nur am Ende des Zuges einer anderen Kreatur. Der Vampir erhält verbrauchte legendäre Aktionen zu Beginn seines Zuges zurück.',
    legendaryActions: [
      [
        'Bewegen',
        'Der Vampir bewegt sich bis zu seiner Bewegungsrate, ohne Gelegenheitsangriffe zu provozieren.',
      ],
      ['Waffenloser Angriff', 'Der Vampir führt einen waffenlosen Angriff aus.'],
      ['Biss (kostet 2 Aktionen)', 'Der Vampir führt einen Bissangriff aus.'],
    ],
  },
  'vampire-vampire': {
    traits: [
      [
        'Gestaltwandler',
        'Befindet sich der Vampir nicht im Sonnenlicht oder in fließendem Wasser, kann er seine Aktion nutzen, um sich in eine winzige Fledermaus oder eine mittelgroße Nebelwolke zu verwandeln oder zurück in seine wahre Gestalt.\nIn Fledermausgestalt kann der Vampir nicht sprechen, seine Bewegungsrate am Boden beträgt 1,5 m, und er hat eine Flugbewegungsrate von 9 m. Seine Spielwerte bleiben bis auf Größe und Bewegungsrate unverändert. Was er am Körper trägt, verwandelt sich mit ihm, nicht aber, was er in den Händen hält. Stirbt er, nimmt er wieder seine wahre Gestalt an.\nIn Nebelgestalt kann der Vampir keine Aktionen ausführen, nicht sprechen und keine Gegenstände handhaben. Er ist schwerelos, hat eine Flugbewegungsrate von 6 m, kann schweben und den Bereich einer feindseligen Kreatur betreten und dort anhalten. Außerdem kann der Nebel jeden Bereich, durch den Luft dringen kann, durchqueren, ohne sich zwängen zu müssen, aber kein Wasser durchdringen. Er ist bei Stärke-, Geschicklichkeits- und Konstitutionsrettungswürfen im Vorteil und immun gegen jeden nichtmagischen Schaden, außer dem Schaden durch Sonnenlicht.',
      ],
      [
        'Legendäre Resistenz (3-mal täglich)',
        'Misslingt dem Vampir ein Rettungswurf, kann er sich entscheiden, ihn stattdessen zu bestehen.',
      ],
      [
        'Nebelflucht',
        'Sinkt er außerhalb seiner Ruhestätte auf 0 Trefferpunkte, verwandelt sich der Vampir in eine Nebelwolke (wie beim Merkmal Gestaltwandler), statt bewusstlos zu werden, sofern er sich nicht im Sonnenlicht oder in fließendem Wasser befindet. Kann er sich nicht verwandeln, wird er zerstört.\nSolange er in Nebelgestalt 0 Trefferpunkte hat, kann er nicht in seine Vampirgestalt zurückkehren und muss seine Ruhestätte innerhalb von 2 Stunden erreichen, sonst wird er zerstört. An seiner Ruhestätte angekommen, nimmt er wieder seine Vampirgestalt an. Dann ist er gelähmt, bis er mindestens 1 Trefferpunkt zurückerhält. Nach 1 Stunde an seiner Ruhestätte mit 0 Trefferpunkten erhält er 1 Trefferpunkt zurück.',
      ],
      [
        'Regeneration',
        'Der Vampir erhält zu Beginn seines Zuges 20 Trefferpunkte zurück, sofern er mindestens 1 Trefferpunkt hat und sich nicht im Sonnenlicht oder in fließendem Wasser befindet. Erleidet der Vampir gleißenden Schaden oder Schaden durch Weihwasser, wirkt dieses Merkmal zu Beginn des nächsten Zuges des Vampirs nicht.',
      ],
      [
        'Spinnenklettern',
        'Der Vampir kann an schwierigen Oberflächen klettern, auch kopfüber an Decken, ohne einen Attributswurf ablegen zu müssen.',
      ],
      [
        'Schwächen des Vampirs',
        'Der Vampir hat folgende Schwächen:\nVerbot. Der Vampir kann einen Wohnsitz nicht ohne Einladung eines der Bewohner betreten.\nSchaden durch fließendes Wasser. Der Vampir erleidet 20 Säureschaden, wenn er seinen Zug in fließendem Wasser beendet.\nPfahl ins Herz. Wird dem Vampir eine Stichwaffe aus Holz ins Herz getrieben, während der Vampir an seiner Ruhestätte kampfunfähig ist, ist der Vampir gelähmt, bis der Pfahl entfernt wird.\nÜberempfindlichkeit gegen Sonnenlicht. Der Vampir erleidet 20 gleißenden Schaden, wenn er seinen Zug im Sonnenlicht beginnt. Im Sonnenlicht ist er bei Angriffswürfen und Attributswürfen im Nachteil.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Vampir führt zwei Angriffe aus, von denen nur einer ein Bissangriff sein kann.',
      ],
      [
        'Waffenloser Angriff',
        'Nahkampf-Waffenangriff: +9 auf Treffer, Reichweite 1,5 m, eine Kreatur. Treffer: 8 (1W8 + 4) Wuchtschaden. Statt Schaden zu verursachen, kann der Vampir das Ziel packen (Entkommen-SG 18).',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +9 auf Treffer, Reichweite 1,5 m, eine bereitwillige Kreatur oder eine Kreatur, die von dem Vampir gepackt wird, kampfunfähig oder festgesetzt ist. Treffer: 7 (1W6 + 4) Stichschaden plus 10 (3W6) nekrotischen Schaden. Das Trefferpunktemaximum des Ziels sinkt um den erlittenen nekrotischen Schaden, und der Vampir erhält Trefferpunkte in dieser Höhe zurück. Die Verringerung hält an, bis das Ziel eine lange Rast beendet. Das Ziel stirbt, wenn diese Wirkung sein Trefferpunktemaximum auf 0 senkt. Ein auf diese Weise getöteter und dann in der Erde begrabener Humanoider erhebt sich in der folgenden Nacht als Vampirbrut unter der Kontrolle des Vampirs.',
      ],
      [
        'Bezaubern',
        'Der Vampir wählt einen Humanoiden, den er im Umkreis von 9 m sehen kann, als Ziel. Kann das Ziel den Vampir sehen, muss es einen Weisheitsrettungswurf mit SG 17 gegen diese Magie bestehen, sonst ist es von dem Vampir bezaubert. Das bezauberte Ziel betrachtet den Vampir als vertrauten Freund, auf den es hört und den es beschützt. Obwohl das Ziel nicht unter der Kontrolle des Vampirs steht, nimmt es seine Bitten oder Handlungen so wohlwollend wie möglich auf, und es ist ein bereitwilliges Ziel für den Bissangriff des Vampirs.\nJedes Mal, wenn der Vampir oder seine Gefährten dem Ziel etwas Schädliches antun, kann es den Rettungswurf wiederholen und beendet die Wirkung bei einem Erfolg für sich. Andernfalls hält die Wirkung 24 Stunden lang an oder bis der Vampir zerstört wird, sich auf einer anderen Existenzebene als das Ziel befindet oder die Wirkung mit einer Bonusaktion beendet.',
      ],
      [
        'Kinder der Nacht (1-mal täglich)',
        'Der Vampir ruft magisch 2W4 Schwärme von Fledermäusen oder Ratten herbei, sofern die Sonne nicht aufgegangen ist. Im Freien kann der Vampir stattdessen 3W6 Wölfe herbeirufen. Die gerufenen Kreaturen treffen nach 1W4 Runden ein, handeln als Verbündete des Vampirs und gehorchen seinen gesprochenen Befehlen. Die Tiere bleiben 1 Stunde lang, bis der Vampir stirbt oder bis der Vampir sie mit einer Bonusaktion entlässt.',
      ],
    ],
    legendary:
      'Der Vampir in Vampirgestalt kann 3 legendäre Aktionen ausführen und wählt dabei aus den unten aufgeführten Optionen. Es kann jeweils nur eine legendäre Aktion eingesetzt werden, und nur am Ende des Zuges einer anderen Kreatur. Der Vampir erhält verbrauchte legendäre Aktionen zu Beginn seines Zuges zurück.',
    legendaryActions: [
      [
        'Bewegen',
        'Der Vampir bewegt sich bis zu seiner Bewegungsrate, ohne Gelegenheitsangriffe zu provozieren.',
      ],
      ['Waffenloser Angriff', 'Der Vampir führt einen waffenlosen Angriff aus.'],
      ['Biss (kostet 2 Aktionen)', 'Der Vampir führt einen Bissangriff aus.'],
    ],
  },
  'young-gold-dragon': {
    traits: [['Amphibisch', 'Der Drache kann Luft und Wasser atmen.']],
    actions: [
      [
        'Mehrfachangriff',
        'Der Drache führt drei Angriffe aus: einen mit seinem Biss und zwei mit seinen Klauen.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +10 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 17 (2W10 + 6) Stichschaden.',
      ],
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +10 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 13 (2W6 + 6) Hiebschaden.',
      ],
      [
        'Odemwaffen (Aufladung 5–6)',
        'Der Drache setzt eine der folgenden Odemwaffen ein.\nFeuerodem. Der Drache atmet Feuer in einem 9-m-Kegel aus. Jede Kreatur in diesem Bereich muss einen Geschicklichkeitsrettungswurf mit SG 17 ablegen. Bei einem Misserfolg erleidet sie 55 (10W10) Feuerschaden, bei einem Erfolg die Hälfte.\nSchwächender Odem. Der Drache atmet Gas in einem 9-m-Kegel aus. Jede Kreatur in diesem Bereich muss einen Stärkerettungswurf mit SG 17 bestehen, sonst ist sie 1 Minute lang bei stärkebasierten Angriffswürfen, Stärkewürfen und Stärkerettungswürfen im Nachteil. Eine Kreatur kann den Rettungswurf am Ende jedes ihrer Züge wiederholen und beendet die Wirkung bei einem Erfolg für sich.',
      ],
    ],
  },
  'young-red-dragon': {
    actions: [
      [
        'Mehrfachangriff',
        'Der Drache führt drei Angriffe aus: einen mit seinem Biss und zwei mit seinen Klauen.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +10 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 17 (2W10 + 6) Stichschaden plus 3 (1W6) Feuerschaden.',
      ],
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +10 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 13 (2W6 + 6) Hiebschaden.',
      ],
      [
        'Feuerodem (Aufladung 5–6)',
        'Der Drache atmet Feuer in einem 9-m-Kegel aus. Jede Kreatur in diesem Bereich muss einen Geschicklichkeitsrettungswurf mit SG 17 ablegen. Bei einem Misserfolg erleidet sie 56 (16W6) Feuerschaden, bei einem Erfolg die Hälfte.',
      ],
    ],
  },
};
