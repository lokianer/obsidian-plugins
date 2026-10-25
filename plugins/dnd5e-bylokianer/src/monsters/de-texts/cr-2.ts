// German texts of the SRD monsters of challenge rating 2: traits, actions, reactions and legendary
// actions. Our own translation of the SRD 5.1, CC-BY-4.0 (see NOTICE.md).

import type { DeMonsterText } from '../model';

export const DE_TEXTS_CR2: Readonly<Record<string, DeMonsterText>> = {
  ankheg: {
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 10 (2W6 + 3) Hiebschaden plus 3 (1W6) Säureschaden. Ist das Ziel eine große oder kleinere Kreatur, wird es gepackt (Entkommen-SG 13). Bis der Griff endet, kann der Ankheg nur die gepackte Kreatur beißen und ist bei Angriffswürfen dafür im Vorteil.',
      ],
      [
        'Säurespritzer (Aufladung 6)',
        'Der Ankheg spuckt Säure in einer Linie aus, die 9 m lang und 1,5 m breit ist, sofern er keine Kreatur gepackt hält. Jede Kreatur in dieser Linie muss einen Geschicklichkeitsrettungswurf mit SG 13 ablegen. Bei einem Misserfolg erleidet sie 10 (3W6) Säureschaden, bei einem Erfolg die Hälfte.',
      ],
    ],
  },
  'awakened-tree': {
    traits: [
      [
        'Falsches Erscheinungsbild',
        'Solange der Baum sich nicht bewegt, ist er nicht von einem gewöhnlichen Baum zu unterscheiden.',
      ],
    ],
    actions: [
      [
        'Hieb',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 14 (3W6 + 4) Wuchtschaden.',
      ],
    ],
  },
  azer: {
    traits: [
      [
        'Glühender Körper',
        'Eine Kreatur, die den Azer berührt oder ihn mit einem Nahkampfangriff trifft, während sie sich im Umkreis von 1,5 m um ihn befindet, erleidet 5 (1W10) Feuerschaden.',
      ],
      [
        'Glühende Waffen',
        'Wenn der Azer mit einer metallenen Nahkampfwaffe trifft, verursacht er zusätzlich 3 (1W6) Feuerschaden (im Angriff enthalten).',
      ],
      [
        'Leuchten',
        'Der Azer verbreitet helles Licht in einem Radius von 3 m und dämmriges Licht für weitere 3 m.',
      ],
    ],
    actions: [
      [
        'Kriegshammer',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 7 (1W8 + 3) Wuchtschaden, oder 8 (1W10 + 3) Wuchtschaden, wenn mit zwei Händen geführt plus 3 (1W6) Feuerschaden.',
      ],
    ],
  },
  'bandit-captain': {
    actions: [
      [
        'Mehrfachangriff',
        'Der Hauptmann führt drei Nahkampfangriffe aus: zwei mit seinem Krummsäbel und einen mit seinem Dolch. Oder der Hauptmann führt zwei Fernkampfangriffe mit seinen Dolchen aus.',
      ],
      [
        'Krummsäbel',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 6 (1W6 + 3) Hiebschaden.',
      ],
      [
        'Dolch',
        'Nah- oder Fernkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m oder Reichweite 6/18 m, ein Ziel. Treffer: 5 (1W4 + 3) Stichschaden.',
      ],
    ],
    reactions: [
      [
        'Parade',
        'Der Hauptmann erhöht seine RK gegen einen Nahkampfangriff, der ihn treffen würde, um 2. Dazu muss der Hauptmann den Angreifer sehen und eine Nahkampfwaffe führen.',
      ],
    ],
  },
  berserker: {
    traits: [
      [
        'Rücksichtslos',
        'Zu Beginn seines Zuges kann der Berserker sich in diesem Zug Vorteil auf alle Angriffswürfe mit Nahkampfwaffen verschaffen, doch Angriffswürfe gegen ihn sind bis zum Beginn seines nächsten Zuges im Vorteil.',
      ],
    ],
    actions: [
      [
        'Zweihandaxt',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 9 (1W12 + 3) Hiebschaden.',
      ],
    ],
  },
  'black-dragon-wyrmling': {
    traits: [['Amphibisch', 'Der Drache kann Luft und Wasser atmen.']],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 7 (1W10 + 2) Stichschaden plus 2 (1W4) Säureschaden.',
      ],
      [
        'Säureodem (Aufladung 5–6)',
        'Der Drache atmet Säure in einer 4,5-m-Linie aus, die 1,5 m breit ist. Jede Kreatur in dieser Linie muss einen Geschicklichkeitsrettungswurf mit SG 11 ablegen. Bei einem Misserfolg erleidet sie 22 (5W8) Säureschaden, bei einem Erfolg die Hälfte.',
      ],
    ],
  },
  'bronze-dragon-wyrmling': {
    traits: [['Amphibisch', 'Der Drache kann Luft und Wasser atmen.']],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 8 (1W10 + 3) Stichschaden.',
      ],
      [
        'Odemwaffen (Aufladung 5–6)',
        'Der Drache setzt eine der folgenden Odemwaffen ein.\nBlitzodem. Der Drache atmet Blitze in einer 12-m-Linie aus, die 1,5 m breit ist. Jede Kreatur in dieser Linie muss einen Geschicklichkeitsrettungswurf mit SG 12 ablegen. Bei einem Misserfolg erleidet sie 16 (3W10) Blitzschaden, bei einem Erfolg die Hälfte.\nAbstoßungsodem. Der Drache atmet abstoßende Energie in einem 9-m-Kegel aus. Jede Kreatur in diesem Bereich muss einen Stärkerettungswurf mit SG 12 ablegen. Bei einem Misserfolg wird die Kreatur 9 m von dem Drachen weggestoßen.',
      ],
    ],
  },
  centaur: {
    traits: [
      [
        'Sturmangriff',
        'Bewegt sich der Zentaur mindestens 9 m geradlinig auf ein Ziel zu und trifft es dann im selben Zug mit einem Pikenangriff, erleidet das Ziel zusätzlich 10 (3W6) Stichschaden.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Zentaur führt zwei Angriffe aus: einen mit seiner Pike und einen mit seinen Hufen, oder zwei mit seinem Langbogen.',
      ],
      [
        'Pike',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 9 (1W10 + 4) Stichschaden.',
      ],
      [
        'Hufe',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 11 (2W6 + 4) Wuchtschaden.',
      ],
      [
        'Langbogen',
        'Fernkampf-Waffenangriff: +4 auf Treffer, Reichweite 45/180 m, ein Ziel. Treffer: 6 (1W8 + 2) Stichschaden.',
      ],
    ],
  },
  'cult-fanatic': {
    traits: [
      [
        'Dunkle Hingabe',
        'Der Fanatiker ist bei Rettungswürfen gegen Bezauberung und Furcht im Vorteil.',
      ],
      [
        'Zauberwirken',
        'Der Fanatiker ist ein Zauberwirker der 4. Stufe. Sein Attribut zum Zauberwirken ist Weisheit (Zauberrettungswurf-SG 11, +3 auf Treffer mit Zauberangriffen). Der Fanatiker hat folgende Klerikerzauber vorbereitet:\n\nZaubertricks (beliebig oft): Licht, Heilige Flamme, Thaumaturgie\n\n- 1. Grad (4 Plätze): Befehl, Wunden verursachen, Schild des Glaubens\n- 2. Grad (3 Plätze): Person festhalten, Spirituelle Waffe',
      ],
    ],
    actions: [
      ['Mehrfachangriff', 'Der Fanatiker führt zwei Nahkampfangriffe aus.'],
      [
        'Dolch',
        'Nah- oder Fernkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m oder Reichweite 6/18 m, eine Kreatur. Treffer: 4 (1W4 + 2) Stichschaden.',
      ],
    ],
  },
  druid: {
    traits: [
      [
        'Zauberwirken',
        'Der Druide ist ein Zauberwirker der 4. Stufe. Sein Attribut zum Zauberwirken ist Weisheit (Zauberrettungswurf-SG 12, +4 auf Treffer mit Zauberangriffen). Er hat folgende Druidenzauber vorbereitet:\n\n- Zaubertricks (beliebig oft): Druidenkunst, Flamme erzeugen, Shillelagh\n- 1. Grad (4 Plätze): Verstricken, Weiter Schritt, Mit Tieren sprechen, Donnerwoge\n- 2. Grad (3 Plätze): Tierbote, Rindenhaut',
      ],
    ],
    actions: [
      [
        'Kampfstab',
        'Nahkampf-Waffenangriff: +2 auf Treffer (+4 auf Treffer mit Shillelagh), Reichweite 1,5 m, ein Ziel. Treffer: 3 (1W6) Wuchtschaden, 4 (1W8) Wuchtschaden, wenn mit zwei Händen geführt, oder 6 (1W8 + 2) Wuchtschaden mit Shillelagh.',
      ],
    ],
  },
  ettercap: {
    traits: [
      [
        'Spinnenklettern',
        'Der Ettercap kann an schwierigen Oberflächen klettern, auch kopfüber an Decken, ohne einen Attributswurf ablegen zu müssen.',
      ],
      [
        'Netzgespür',
        'Solange der Ettercap ein Netz berührt, kennt er den genauen Aufenthaltsort jeder anderen Kreatur, die dasselbe Netz berührt.',
      ],
      ['Netzläufer', 'Der Ettercap ignoriert Bewegungseinschränkungen durch Spinnweben.'],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Ettercap führt zwei Angriffe aus: einen mit seinem Biss und einen mit seinen Klauen.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, eine Kreatur. Treffer: 6 (1W8 + 2) Stichschaden plus 4 (1W8) Giftschaden. Das Ziel muss einen Konstitutionsrettungswurf mit SG 11 bestehen, sonst ist es 1 Minute lang vergiftet. Die Kreatur kann den Rettungswurf am Ende jedes ihrer Züge wiederholen und beendet die Wirkung bei einem Erfolg für sich.',
      ],
      [
        'Klauen',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 7 (2W4 + 2) Hiebschaden.',
      ],
      [
        'Netz (Aufladung 5–6)',
        'Fernkampf-Waffenangriff: +4 auf Treffer, Reichweite 9/18 m, eine große oder kleinere Kreatur. Treffer: Die Kreatur ist durch Spinnweben festgesetzt. Als Aktion kann die festgesetzte Kreatur einen Stärkewurf gegen SG 11 ablegen und sich bei einem Erfolg aus den Spinnweben befreien. Die Wirkung endet, wenn die Spinnweben zerstört werden. Die Spinnweben haben RK 10 und 5 Trefferpunkte, sind anfällig für Feuerschaden und immun gegen Wuchtschaden.',
      ],
    ],
  },
  gargoyle: {
    traits: [
      [
        'Falsches Erscheinungsbild',
        'Solange der Gargyl sich nicht bewegt, ist er nicht von einer unbelebten Statue zu unterscheiden.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Gargyl führt zwei Angriffe aus: einen mit seinem Biss und einen mit seinen Klauen.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 5 (1W6 + 2) Stichschaden.',
      ],
      [
        'Klauen',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 5 (1W6 + 2) Hiebschaden.',
      ],
    ],
  },
  'gelatinous-cube': {
    traits: [
      [
        'Schleimwürfel',
        'Der Würfel füllt seinen gesamten Bereich aus. Andere Kreaturen können den Bereich betreten, doch eine Kreatur, die das tut, ist dem Verschlingen des Würfels ausgesetzt und beim Rettungswurf im Nachteil.\nKreaturen im Inneren des Würfels sind sichtbar, haben aber vollständige Deckung.\nEine Kreatur im Umkreis von 1,5 m um den Würfel kann eine Aktion nutzen, um eine Kreatur oder einen Gegenstand aus dem Würfel herauszuziehen. Dazu ist ein erfolgreicher Stärkewurf gegen SG 12 nötig, und die Kreatur, die es versucht, erleidet 10 (3W6) Säureschaden.\nDer Würfel kann gleichzeitig nur eine große Kreatur oder bis zu vier mittelgroße oder kleinere Kreaturen in sich aufnehmen.',
      ],
      [
        'Durchsichtig',
        'Selbst wenn der Würfel gut sichtbar ist, ist ein erfolgreicher Weisheitswurf (Wahrnehmung) gegen SG 15 nötig, um einen Würfel zu entdecken, der sich weder bewegt noch angegriffen hat. Eine Kreatur, die den Bereich des Würfels betreten will, ohne sich des Würfels bewusst zu sein, wird von dem Würfel überrascht.',
      ],
    ],
    actions: [
      [
        'Pseudopodium',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, eine Kreatur. Treffer: 10 (3W6) Säureschaden.',
      ],
      [
        'Verschlingen',
        'Der Würfel bewegt sich bis zu seiner Bewegungsrate. Dabei kann er die Bereiche großer oder kleinerer Kreaturen betreten. Wann immer der Würfel den Bereich einer Kreatur betritt, muss die Kreatur einen Geschicklichkeitsrettungswurf mit SG 12 ablegen.\nBei einem Erfolg kann die Kreatur wählen, 1,5 m nach hinten oder zur Seite des Würfels gestoßen zu werden. Eine Kreatur, die sich nicht wegstoßen lässt, erleidet die Folgen eines misslungenen Rettungswurfs.\nBei einem Misserfolg betritt der Würfel den Bereich der Kreatur, und die Kreatur erleidet 10 (3W6) Säureschaden und wird verschlungen. Die verschlungene Kreatur kann nicht atmen, ist festgesetzt und erleidet zu Beginn jedes Zuges des Würfels 21 (6W6) Säureschaden. Bewegt sich der Würfel, bewegt sich die verschlungene Kreatur mit ihm.\nEine verschlungene Kreatur kann versuchen zu entkommen, indem sie eine Aktion nutzt, um einen Stärkewurf gegen SG 12 abzulegen. Bei einem Erfolg entkommt die Kreatur und betritt einen Bereich ihrer Wahl im Umkreis von 1,5 m um den Würfel.',
      ],
    ],
  },
  ghast: {
    traits: [
      [
        'Gestank',
        'Jede Kreatur, die ihren Zug im Umkreis von 1,5 m um den Ghast beginnt, muss einen Konstitutionsrettungswurf mit SG 10 bestehen, sonst ist sie bis zum Beginn ihres nächsten Zuges vergiftet. Bei einem erfolgreichen Rettungswurf ist die Kreatur 24 Stunden lang immun gegen den Gestank des Ghasts.',
      ],
      [
        'Dem Vertreiben trotzen',
        'Der Ghast und alle Ghule im Umkreis von 9 m um ihn sind bei Rettungswürfen gegen Effekte, die Untote vertreiben, im Vorteil.',
      ],
    ],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +3 auf Treffer, Reichweite 1,5 m, eine Kreatur. Treffer: 12 (2W8 + 3) Stichschaden.',
      ],
      [
        'Klauen',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 10 (2W6 + 3) Hiebschaden. Ist das Ziel eine Kreatur, die nicht untot ist, muss es einen Konstitutionsrettungswurf mit SG 10 bestehen, sonst ist es 1 Minute lang gelähmt. Das Ziel kann den Rettungswurf am Ende jedes seiner Züge wiederholen und beendet die Wirkung bei einem Erfolg für sich.',
      ],
    ],
  },
  'giant-boar': {
    traits: [
      [
        'Sturmangriff',
        'Bewegt sich das Wildschwein mindestens 6 m geradlinig auf ein Ziel zu und trifft es dann im selben Zug mit einem Hauerangriff, erleidet das Ziel zusätzlich 7 (2W6) Hiebschaden. Ist das Ziel eine Kreatur, muss es einen Stärkerettungswurf mit SG 13 bestehen, sonst wird es zu Boden geworfen.',
      ],
      [
        'Unerbittlich (Aufladung nach einer kurzen oder langen Rast)',
        'Erleidet das Wildschwein 10 oder weniger Schaden, der seine Trefferpunkte auf 0 senken würde, sinken sie stattdessen auf 1.',
      ],
    ],
    actions: [
      [
        'Hauer',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 10 (2W6 + 3) Hiebschaden.',
      ],
    ],
  },
  'giant-constrictor-snake': {
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 3 m, eine Kreatur. Treffer: 11 (2W6 + 4) Stichschaden.',
      ],
      [
        'Würgen',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 1,5 m, eine Kreatur. Treffer: 13 (2W8 + 4) Wuchtschaden, und das Ziel wird gepackt (Entkommen-SG 16). Bis der Griff endet, ist die Kreatur festgesetzt, und die Schlange kann kein anderes Ziel würgen.',
      ],
    ],
  },
  'giant-elk': {
    traits: [
      [
        'Sturmangriff',
        'Bewegt sich der Elch mindestens 6 m geradlinig auf ein Ziel zu und trifft es dann im selben Zug mit einem Rammangriff, erleidet das Ziel zusätzlich 7 (2W6) Schaden. Ist das Ziel eine Kreatur, muss es einen Stärkerettungswurf mit SG 14 bestehen, sonst wird es zu Boden geworfen.',
      ],
    ],
    actions: [
      [
        'Rammen',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 11 (2W6 + 4) Wuchtschaden.',
      ],
      [
        'Hufe',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 1,5 m, eine liegende Kreatur. Treffer: 22 (4W8 + 4) Wuchtschaden.',
      ],
    ],
  },
  'gibbering-mouther': {
    traits: [
      [
        'Entarteter Boden',
        'Der Boden in einem Radius von 3 m um den Schlinger ist teigiges, schwieriges Gelände. Jede Kreatur, die ihren Zug in diesem Bereich beginnt, muss einen Stärkerettungswurf mit SG 10 bestehen, sonst sinkt ihre Bewegungsrate bis zum Beginn ihres nächsten Zuges auf 0.',
      ],
      [
        'Brabbeln',
        'Der Schlinger brabbelt zusammenhanglos, solange er eine Kreatur sehen kann und nicht kampfunfähig ist. Jede Kreatur, die ihren Zug im Umkreis von 6 m um den Schlinger beginnt und ihn hören kann, muss einen Weisheitsrettungswurf mit SG 10 bestehen. Bei einem Misserfolg kann die Kreatur bis zum Beginn ihres nächsten Zuges keine Reaktionen ausführen und würfelt mit einem W8, was sie in ihrem Zug tut. Bei 1 bis 4 tut die Kreatur nichts. Bei 5 oder 6 führt die Kreatur weder eine Aktion noch eine Bonusaktion aus und nutzt ihre gesamte Bewegung, um sich in eine zufällig bestimmte Richtung zu bewegen. Bei 7 oder 8 führt die Kreatur einen Nahkampfangriff gegen eine zufällig bestimmte Kreatur in ihrer Reichweite aus oder tut nichts, wenn sie keinen solchen Angriff ausführen kann.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Schlinger führt einen Bissangriff aus und setzt, wenn möglich, seinen Blendenden Speichel ein.',
      ],
      [
        'Bisse',
        'Nahkampf-Waffenangriff: +2 auf Treffer, Reichweite 1,5 m, eine Kreatur. Treffer: 17 (5W6) Stichschaden. Ist das Ziel mittelgroß oder kleiner, muss es einen Stärkerettungswurf mit SG 10 bestehen, sonst wird es zu Boden geworfen. Wird das Ziel durch diesen Schaden getötet, wird es von dem Schlinger aufgenommen.',
      ],
      [
        'Blendender Speichel (Aufladung 5–6)',
        'Der Schlinger spuckt einen chemischen Klumpen auf einen Punkt, den er im Umkreis von 4,5 m sehen kann. Der Klumpen explodiert beim Aufprall in einem blendenden Lichtblitz. Jede Kreatur im Umkreis von 1,5 m um den Blitz muss einen Geschicklichkeitsrettungswurf mit SG 13 bestehen, sonst ist sie bis zum Ende des nächsten Zuges des Schlingers blind.',
      ],
    ],
  },
  'green-dragon-wyrmling': {
    traits: [['Amphibisch', 'Der Drache kann Luft und Wasser atmen.']],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 7 (1W10 + 2) Stichschaden plus 3 (1W6) Giftschaden.',
      ],
      [
        'Giftodem (Aufladung 5–6)',
        'Der Drache atmet giftiges Gas in einem 4,5-m-Kegel aus. Jede Kreatur in diesem Bereich muss einen Konstitutionsrettungswurf mit SG 11 ablegen. Bei einem Misserfolg erleidet sie 21 (6W6) Giftschaden, bei einem Erfolg die Hälfte.',
      ],
    ],
  },
  grick: {
    traits: [
      [
        'Steintarnung',
        'Der Grick ist bei Geschicklichkeitswürfen (Heimlichkeit), um sich in felsigem Gelände zu verstecken, im Vorteil.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Grick führt einen Angriff mit seinen Tentakeln aus. Trifft dieser Angriff, kann der Grick einen Schnabelangriff gegen dasselbe Ziel ausführen.',
      ],
      [
        'Tentakel',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 9 (2W6 + 2) Hiebschaden.',
      ],
      [
        'Schnabel',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 5 (1W6 + 2) Stichschaden.',
      ],
    ],
  },
  griffon: {
    traits: [
      [
        'Scharfe Sicht',
        'Der Greif ist bei Weisheitswürfen (Wahrnehmung), die auf der Sicht beruhen, im Vorteil.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Greif führt zwei Angriffe aus: einen mit seinem Schnabel und einen mit seinen Klauen.',
      ],
      [
        'Schnabel',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 8 (1W8 + 4) Stichschaden.',
      ],
      [
        'Klauen',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 11 (2W6 + 4) Hiebschaden.',
      ],
    ],
  },
  'hunter-shark': {
    traits: [
      [
        'Blutrausch',
        'Der Hai ist bei Nahkampfangriffswürfen gegen jede Kreatur im Vorteil, die nicht alle ihre Trefferpunkte hat.',
      ],
      ['Wasseratmung', 'Der Hai kann nur unter Wasser atmen.'],
    ],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 13 (2W8 + 4) Stichschaden.',
      ],
    ],
  },
  merrow: {
    traits: [['Amphibisch', 'Der Merrow kann Luft und Wasser atmen.']],
    actions: [
      [
        'Mehrfachangriff',
        'Der Merrow führt zwei Angriffe aus: einen mit seinem Biss und einen mit seinen Klauen oder seiner Harpune.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 8 (1W8 + 4) Stichschaden.',
      ],
      [
        'Klauen',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 9 (2W4 + 4) Hiebschaden.',
      ],
      [
        'Harpune',
        'Nah- oder Fernkampf-Waffenangriff: +6 auf Treffer, Reichweite 1,5 m oder Reichweite 6/18 m, ein Ziel. Treffer: 11 (2W6 + 4) Stichschaden. Ist das Ziel eine riesige oder kleinere Kreatur, muss es einen Stärke-Wettstreit gegen den Merrow gewinnen, sonst wird es bis zu 6 m weit zu dem Merrow hingezogen.',
      ],
    ],
  },
  mimic: {
    traits: [
      [
        'Gestaltwandler',
        'Der Mimik kann seine Aktion nutzen, um sich in einen Gegenstand zu verwandeln oder zurück in seine wahre, amorphe Gestalt. Seine Spielwerte sind in jeder Gestalt gleich. Ausrüstung, die er trägt oder hält, wird nicht verwandelt. Stirbt er, nimmt er wieder seine wahre Gestalt an.',
      ],
      [
        'Klebrig (nur Objektgestalt)',
        'Der Mimik klebt an allem fest, was ihn berührt. Eine riesige oder kleinere Kreatur, die an dem Mimik klebt, ist außerdem von ihm gepackt (Entkommen-SG 13). Attributswürfe, um diesem Griff zu entkommen, sind im Nachteil.',
      ],
      [
        'Falsches Erscheinungsbild (nur Objektgestalt)',
        'Solange der Mimik sich nicht bewegt, ist er nicht von einem gewöhnlichen Gegenstand zu unterscheiden.',
      ],
      [
        'Ringer',
        'Der Mimik ist bei Angriffswürfen gegen jede Kreatur, die er gepackt hält, im Vorteil.',
      ],
    ],
    actions: [
      [
        'Pseudopodium',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 7 (1W8 + 3) Wuchtschaden. Befindet sich der Mimik in Gegenstandsgestalt, ist das Ziel seinem Merkmal Klebrig ausgesetzt.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 7 (1W8 + 3) Stichschaden plus 4 (1W8) Säureschaden.',
      ],
    ],
  },
  'minotaur-skeleton': {
    traits: [
      [
        'Sturmangriff',
        'Bewegt sich das Skelett mindestens 3 m geradlinig auf ein Ziel zu und trifft es dann im selben Zug mit einem Aufspießangriff, erleidet das Ziel zusätzlich 9 (2W8) Stichschaden. Ist das Ziel eine Kreatur, muss es einen Stärkerettungswurf mit SG 14 bestehen, sonst wird es bis zu 3 m weggestoßen und zu Boden geworfen.',
      ],
    ],
    actions: [
      [
        'Zweihandaxt',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 17 (2W12 + 4) Hiebschaden.',
      ],
      [
        'Aufspießen',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 13 (2W8 + 4) Stichschaden.',
      ],
    ],
  },
  'ochre-jelly': {
    traits: [
      [
        'Amorph',
        'Die Gallerte kann sich durch einen Bereich bewegen, der nur 2,5 cm breit ist, ohne sich zwängen zu müssen.',
      ],
      [
        'Spinnenklettern',
        'Die Gallerte kann an schwierigen Oberflächen klettern, auch kopfüber an Decken, ohne einen Attributswurf ablegen zu müssen.',
      ],
    ],
    actions: [
      [
        'Pseudopodium',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 9 (2W6 + 2) Wuchtschaden plus 3 (1W6) Säureschaden.',
      ],
    ],
    reactions: [
      [
        'Teilen',
        'Erleidet eine mittelgroße oder größere Gallerte Blitz- oder Hiebschaden, teilt sie sich in zwei neue Gallerten, sofern sie mindestens 10 Trefferpunkte hat. Jede neue Gallerte hat Trefferpunkte in Höhe der Hälfte der Trefferpunkte der ursprünglichen Gallerte, abgerundet. Neue Gallerten sind eine Größenkategorie kleiner als die ursprüngliche Gallerte.',
      ],
    ],
  },
  ogre: {
    actions: [
      [
        'Zweihandknüppel',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 13 (2W8 + 4) Wuchtschaden.',
      ],
      [
        'Wurfspeer',
        'Nah- oder Fernkampf-Waffenangriff: +6 auf Treffer, Reichweite 1,5 m oder Reichweite 9/36 m, ein Ziel. Treffer: 11 (2W6 + 4) Stichschaden.',
      ],
    ],
  },
  'ogre-zombie': {
    traits: [
      [
        'Untote Zähigkeit',
        'Senkt Schaden den Zombie auf 0 Trefferpunkte, muss er einen Konstitutionsrettungswurf mit SG 5 + erlittener Schaden ablegen, es sei denn, der Schaden ist gleißend oder stammt von einem kritischen Treffer. Bei einem Erfolg sinkt der Zombie stattdessen auf 1 Trefferpunkt.',
      ],
    ],
    actions: [
      [
        'Morgenstern',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 13 (2W8 + 4) Wuchtschaden.',
      ],
    ],
  },
  pegasus: {
    actions: [
      [
        'Hufe',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 11 (2W6 + 4) Wuchtschaden.',
      ],
    ],
  },
  plesiosaurus: {
    traits: [['Atem anhalten', 'Der Plesiosaurus kann 1 Stunde lang den Atem anhalten.']],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 14 (3W6 + 4) Stichschaden.',
      ],
    ],
  },
  'polar-bear': {
    traits: [
      [
        'Scharfer Geruchssinn',
        'Der Bär ist bei Weisheitswürfen (Wahrnehmung), die auf dem Geruchssinn beruhen, im Vorteil.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Bär führt zwei Angriffe aus: einen mit seinem Biss und einen mit seinen Klauen.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 9 (1W8 + 5) Stichschaden.',
      ],
      [
        'Klauen',
        'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 12 (2W6 + 5) Hiebschaden.',
      ],
    ],
  },
  priest: {
    traits: [
      [
        'Göttliche Erhabenheit',
        'Als Bonusaktion kann der Priester einen Zauberplatz verbrauchen, damit seine Nahkampfwaffenangriffe einem Ziel bei einem Treffer magisch zusätzlich 10 (3W6) gleißenden Schaden zufügen. Dieser Vorteil hält bis zum Ende des Zuges an. Verbraucht der Priester einen Zauberplatz des 2. Grades oder höher, steigt der zusätzliche Schaden für jeden Grad über dem 1. um 1W6.',
      ],
      [
        'Zauberwirken',
        'Der Priester ist ein Zauberwirker der 5. Stufe. Sein Attribut zum Zauberwirken ist Weisheit (Zauberrettungswurf-SG 13, +5 auf Treffer mit Zauberangriffen). Der Priester hat folgende Klerikerzauber vorbereitet:\n\n- Zaubertricks (beliebig oft): Licht, Heilige Flamme, Thaumaturgie\n- 1. Grad (4 Plätze): Wunden heilen, Lenkendes Geschoss, Heiligtum\n- 2. Grad (3 Plätze): Schwache Genesung, Spirituelle Waffe\n- 3. Grad (2 Plätze): Magie bannen, Geistwächter',
      ],
    ],
    actions: [
      [
        'Streitkolben',
        'Nahkampf-Waffenangriff: +2 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 3 (1W6) Wuchtschaden.',
      ],
    ],
  },
  rhinoceros: {
    traits: [
      [
        'Sturmangriff',
        'Bewegt sich das Nashorn mindestens 6 m geradlinig auf ein Ziel zu und trifft es dann im selben Zug mit einem Aufspießangriff, erleidet das Ziel zusätzlich 9 (2W8) Wuchtschaden. Ist das Ziel eine Kreatur, muss es einen Stärkerettungswurf mit SG 15 bestehen, sonst wird es zu Boden geworfen.',
      ],
    ],
    actions: [
      [
        'Aufspießen',
        'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 14 (2W8 + 5) Wuchtschaden.',
      ],
    ],
  },
  'rug-of-smothering': {
    traits: [
      [
        'Antimagie-Anfälligkeit',
        'Im Bereich eines Antimagiefelds ist der Teppich kampfunfähig. Wird er zum Ziel von Magie bannen, muss er einen Konstitutionsrettungswurf gegen den Zauberrettungswurf-SG des Zaubernden bestehen, sonst wird er für 1 Minute bewusstlos.',
      ],
      [
        'Schadensübertragung',
        'Solange er eine Kreatur gepackt hält, erleidet der Teppich nur die Hälfte des Schadens, der ihm zugefügt wird, und die von dem Teppich gepackte Kreatur erleidet die andere Hälfte.',
      ],
      [
        'Falsches Erscheinungsbild',
        'Solange der Teppich sich nicht bewegt, ist er nicht von einem gewöhnlichen Teppich zu unterscheiden.',
      ],
    ],
    actions: [
      [
        'Ersticken',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, eine mittelgroße oder kleinere Kreatur. Treffer: Die Kreatur wird gepackt (Entkommen-SG 13). Bis der Griff endet, ist das Ziel festgesetzt, blind und in Gefahr zu ersticken, und der Teppich kann kein anderes Ziel ersticken. Außerdem erleidet das Ziel zu Beginn jedes seiner Züge 10 (2W6 + 3) Wuchtschaden.',
      ],
    ],
  },
  'saber-toothed-tiger': {
    traits: [
      [
        'Scharfer Geruchssinn',
        'Der Tiger ist bei Weisheitswürfen (Wahrnehmung), die auf dem Geruchssinn beruhen, im Vorteil.',
      ],
      [
        'Anspringen',
        'Bewegt sich der Tiger mindestens 6 m geradlinig auf eine Kreatur zu und trifft sie dann im selben Zug mit einem Klauenangriff, muss das Ziel einen Stärkerettungswurf mit SG 14 bestehen, sonst wird es zu Boden geworfen. Liegt das Ziel am Boden, kann der Tiger als Bonusaktion einen Bissangriff gegen es ausführen.',
      ],
    ],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 10 (1W10 + 5) Stichschaden.',
      ],
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 12 (2W6 + 5) Hiebschaden.',
      ],
    ],
  },
  'sea-hag': {
    traits: [
      ['Amphibisch', 'Die Vettel kann Luft und Wasser atmen.'],
      [
        'Schreckliches Aussehen',
        'Jeder Humanoide, der seinen Zug im Umkreis von 9 m um die Vettel beginnt und die wahre Gestalt der Vettel sehen kann, muss einen Weisheitsrettungswurf mit SG 11 ablegen. Bei einem Misserfolg ist die Kreatur 1 Minute lang verängstigt. Eine Kreatur kann den Rettungswurf am Ende jedes ihrer Züge wiederholen, im Nachteil, wenn die Vettel in Sichtlinie ist, und beendet die Wirkung bei einem Erfolg für sich. Ist der Rettungswurf einer Kreatur erfolgreich oder endet die Wirkung für sie, ist die Kreatur für die nächsten 24 Stunden immun gegen das Schreckliche Aussehen der Vettel.\nSofern das Ziel nicht überrascht ist und die wahre Gestalt der Vettel nicht plötzlich enthüllt wird, kann das Ziel die Augen abwenden und dem ersten Rettungswurf entgehen. Bis zum Beginn ihres nächsten Zuges ist eine Kreatur, welche die Augen abwendet, bei Angriffswürfen gegen die Vettel im Nachteil.',
      ],
    ],
    actions: [
      [
        'Klauen',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 10 (2W6 + 3) Hiebschaden.',
      ],
      [
        'Todesblick',
        'Die Vettel wählt eine verängstigte Kreatur, die sie im Umkreis von 9 m sehen kann, als Ziel. Kann das Ziel die Vettel sehen, muss es einen Weisheitsrettungswurf mit SG 11 gegen diese Magie bestehen, sonst sinkt es auf 0 Trefferpunkte.',
      ],
      [
        'Illusorisches Erscheinungsbild',
        'Die Vettel hüllt sich und alles, was sie trägt oder hält, in eine magische Illusion, durch die sie wie eine hässliche Kreatur ihrer ungefähren Größe und humanoiden Gestalt aussieht. Die Wirkung endet, wenn die Vettel sie mit einer Bonusaktion beendet oder stirbt.\nDie durch diese Wirkung hervorgerufenen Veränderungen halten einer körperlichen Untersuchung nicht stand. So könnte die Vettel keine Klauen zu haben scheinen, doch wer ihre Hand berührt, könnte die Klauen spüren. Ansonsten muss eine Kreatur eine Aktion nutzen, um die Illusion in Augenschein zu nehmen, und einen Intelligenzwurf (Nachforschungen) gegen SG 16 bestehen, um zu erkennen, dass die Vettel verkleidet ist.',
      ],
    ],
  },
  'silver-dragon-wyrmling': {
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 9 (1W10 + 4) Stichschaden.',
      ],
      [
        'Odemwaffen (Aufladung 5–6)',
        'Der Drache setzt eine der folgenden Odemwaffen ein.\nKälteodem. Der Drache atmet einen eisigen Stoß in einem 4,5-m-Kegel aus. Jede Kreatur in diesem Bereich muss einen Konstitutionsrettungswurf mit SG 13 ablegen. Bei einem Misserfolg erleidet sie 18 (4W8) Kälteschaden, bei einem Erfolg die Hälfte.\nLähmender Odem. Der Drache atmet lähmendes Gas in einem 4,5-m-Kegel aus. Jede Kreatur in diesem Bereich muss einen Konstitutionsrettungswurf mit SG 13 bestehen, sonst ist sie 1 Minute lang gelähmt. Eine Kreatur kann den Rettungswurf am Ende jedes ihrer Züge wiederholen und beendet die Wirkung bei einem Erfolg für sich.',
      ],
    ],
  },
  'swarm-of-poisonous-snakes': {
    traits: [
      [
        'Schwarm',
        'Der Schwarm kann den Bereich einer anderen Kreatur besetzen und umgekehrt, und der Schwarm kann sich durch jede Öffnung bewegen, die groß genug für eine winzige Schlange ist. Der Schwarm kann keine Trefferpunkte zurückerhalten und keine temporären Trefferpunkte erhalten.',
      ],
    ],
    actions: [
      [
        'Bisse',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 0 m, eine Kreatur im Bereich des Schwarms. Treffer: 7 (2W6) Stichschaden, oder 3 (1W6) Stichschaden, wenn der Schwarm die Hälfte seiner Trefferpunkte oder weniger hat. Das Ziel muss einen Konstitutionsrettungswurf mit SG 10 ablegen. Bei einem Misserfolg erleidet es 14 (4W6) Giftschaden, bei einem Erfolg die Hälfte.',
      ],
    ],
  },
  'wererat-human': {
    traits: [
      [
        'Gestaltwandler',
        'Die Werratte kann ihre Aktion nutzen, um sich in eine Ratten-Humanoiden-Mischgestalt oder eine Riesenratte zu verwandeln oder zurück in ihre wahre, humanoide Gestalt. Ihre Spielwerte sind bis auf die Größe in jeder Gestalt gleich. Ausrüstung, die sie trägt oder hält, wird nicht verwandelt. Stirbt sie, nimmt sie wieder ihre wahre Gestalt an.',
      ],
      [
        'Scharfer Geruchssinn',
        'Die Werratte ist bei Weisheitswürfen (Wahrnehmung), die auf dem Geruchssinn beruhen, im Vorteil.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Die Werratte führt zwei Angriffe aus, von denen nur einer ein Biss sein kann.',
      ],
      [
        'Kurzschwert',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 5 (1W6 + 2) Stichschaden.',
      ],
      [
        'Handarmbrust',
        'Fernkampf-Waffenangriff: +4 auf Treffer, Reichweite 9/36 m, ein Ziel. Treffer: 5 (1W6 + 2) Stichschaden.',
      ],
    ],
  },
  'wererat-hybrid': {
    traits: [
      [
        'Gestaltwandler',
        'Die Werratte kann ihre Aktion nutzen, um sich in eine Ratten-Humanoiden-Mischgestalt oder eine Riesenratte zu verwandeln oder zurück in ihre wahre, humanoide Gestalt. Ihre Spielwerte sind bis auf die Größe in jeder Gestalt gleich. Ausrüstung, die sie trägt oder hält, wird nicht verwandelt. Stirbt sie, nimmt sie wieder ihre wahre Gestalt an.',
      ],
      [
        'Scharfer Geruchssinn',
        'Die Werratte ist bei Weisheitswürfen (Wahrnehmung), die auf dem Geruchssinn beruhen, im Vorteil.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Die Werratte führt zwei Angriffe aus, von denen nur einer ein Biss sein kann.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 4 (1W4 + 2) Stichschaden. Ist das Ziel ein Humanoider, muss es einen Konstitutionsrettungswurf mit SG 11 bestehen, sonst wird es mit der Lykanthropie der Werratte verflucht.',
      ],
      [
        'Kurzschwert',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 5 (1W6 + 2) Stichschaden.',
      ],
      [
        'Handarmbrust',
        'Fernkampf-Waffenangriff: +4 auf Treffer, Reichweite 9/36 m, ein Ziel. Treffer: 5 (1W6 + 2) Stichschaden.',
      ],
    ],
  },
  'wererat-rat': {
    traits: [
      [
        'Gestaltwandler',
        'Die Werratte kann ihre Aktion nutzen, um sich in eine Ratten-Humanoiden-Mischgestalt oder eine Riesenratte zu verwandeln oder zurück in ihre wahre, humanoide Gestalt. Ihre Spielwerte sind bis auf die Größe in jeder Gestalt gleich. Ausrüstung, die sie trägt oder hält, wird nicht verwandelt. Stirbt sie, nimmt sie wieder ihre wahre Gestalt an.',
      ],
      [
        'Scharfer Geruchssinn',
        'Die Werratte ist bei Weisheitswürfen (Wahrnehmung), die auf dem Geruchssinn beruhen, im Vorteil.',
      ],
    ],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 4 (1W4 + 2) Stichschaden. Ist das Ziel ein Humanoider, muss es einen Konstitutionsrettungswurf mit SG 11 bestehen, sonst wird es mit der Lykanthropie der Werratte verflucht.',
      ],
    ],
  },
  'white-dragon-wyrmling': {
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 7 (1W10 + 2) Stichschaden plus 2 (1W4) Kälteschaden.',
      ],
      [
        'Kälteodem (Aufladung 5–6)',
        'Der Drache atmet einen eisigen Hagelstoß in einem 4,5-m-Kegel aus. Jede Kreatur in diesem Bereich muss einen Konstitutionsrettungswurf mit SG 12 ablegen. Bei einem Misserfolg erleidet sie 22 (5W8) Kälteschaden, bei einem Erfolg die Hälfte.',
      ],
    ],
  },
  'will-o-wisp': {
    traits: [
      [
        'Leben verzehren',
        'Als Bonusaktion kann das Irrlicht eine Kreatur, die es im Umkreis von 1,5 m sehen kann und die 0 Trefferpunkte hat und noch lebt, als Ziel wählen. Das Ziel muss einen Konstitutionsrettungswurf mit SG 10 gegen diese Magie bestehen, sonst stirbt es. Stirbt das Ziel, erhält das Irrlicht 10 (3W6) Trefferpunkte zurück.',
      ],
      ['Flüchtig', 'Das Irrlicht kann nichts tragen oder halten.'],
      [
        'Körperlose Bewegung',
        'Das Irrlicht kann sich durch andere Kreaturen und Gegenstände bewegen, als wären sie schwieriges Gelände. Beendet es seinen Zug in einem Gegenstand, erleidet es 5 (1W10) Energieschaden.',
      ],
      [
        'Veränderliches Leuchten',
        'Das Irrlicht verbreitet helles Licht in einem Radius von 1,5 bis 6 m und dämmriges Licht für weitere Meter in Höhe des gewählten Radius. Das Irrlicht kann den Radius als Bonusaktion ändern.',
      ],
    ],
    actions: [
      [
        'Schock',
        'Nahkampf-Zauberangriff: +4 auf Treffer, Reichweite 1,5 m, eine Kreatur. Treffer: 9 (2W8) Blitzschaden.',
      ],
      [
        'Unsichtbarkeit',
        'Das Irrlicht und sein Licht werden magisch unsichtbar, bis es angreift oder Leben verzehren einsetzt oder bis seine Konzentration endet (als würde es sich auf einen Zauber konzentrieren).',
      ],
    ],
  },
};
