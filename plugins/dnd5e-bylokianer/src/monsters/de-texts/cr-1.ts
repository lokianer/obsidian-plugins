// German texts of the SRD monsters of challenge rating 1: traits, actions, reactions and legendary
// actions. Our own translation of the SRD 5.1, CC-BY-4.0 (see NOTICE.md).

import type { DeMonsterText } from '../model';

export const DE_TEXTS_CR1: Readonly<Record<string, DeMonsterText>> = {
  'animated-armor': {
    traits: [
      [
        'Antimagie-Anfälligkeit',
        'Im Bereich eines Antimagiefelds ist die Rüstung kampfunfähig. Wird sie zum Ziel von Magie bannen, muss sie einen Konstitutionsrettungswurf gegen den Zauberrettungswurf-SG des Zaubernden bestehen, sonst wird sie für 1 Minute bewusstlos.',
      ],
      [
        'Falsches Erscheinungsbild',
        'Solange die Rüstung sich nicht bewegt, ist sie nicht von einer gewöhnlichen Rüstung zu unterscheiden.',
      ],
    ],
    actions: [
      ['Mehrfachangriff', 'Die Rüstung führt zwei Nahkampfangriffe aus.'],
      [
        'Hieb',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 5 (1W6 + 2) Wuchtschaden.',
      ],
    ],
  },
  'brass-dragon-wyrmling': {
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 7 (1W10 + 2) Stichschaden.',
      ],
      [
        'Odemwaffen (Aufladung 5–6)',
        'Der Drache setzt eine der folgenden Odemwaffen ein.\nFeuerodem. Der Drache atmet Feuer in einer 6-m-Linie aus, die 1,5 m breit ist. Jede Kreatur in dieser Linie muss einen Geschicklichkeitsrettungswurf mit SG 11 ablegen. Bei einem Misserfolg erleidet sie 14 (4W6) Feuerschaden, bei einem Erfolg die Hälfte.\nSchlafodem. Der Drache atmet Schlafgas in einem 4,5-m-Kegel aus. Jede Kreatur in diesem Bereich muss einen Konstitutionsrettungswurf mit SG 11 bestehen, sonst wird sie für 1 Minute bewusstlos. Die Wirkung endet für eine Kreatur, wenn sie Schaden erleidet oder jemand eine Aktion nutzt, um sie zu wecken.',
      ],
    ],
  },
  'brown-bear': {
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
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 8 (1W8 + 4) Stichschaden.',
      ],
      [
        'Klauen',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 11 (2W6 + 4) Hiebschaden.',
      ],
    ],
  },
  bugbear: {
    traits: [
      [
        'Rohling',
        'Eine Nahkampfwaffe verursacht einen zusätzlichen Schadenswürfel, wenn der Grottenschrat mit ihr trifft (im Angriff enthalten).',
      ],
      [
        'Überraschungsangriff',
        'Überrascht der Grottenschrat eine Kreatur und trifft sie in der ersten Kampfrunde mit einem Angriff, erleidet das Ziel durch den Angriff zusätzlich 7 (2W6) Schaden.',
      ],
    ],
    actions: [
      [
        'Morgenstern',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 11 (2W8 + 2) Stichschaden.',
      ],
      [
        'Wurfspeer',
        'Nah- oder Fernkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m oder Reichweite 9/36 m, ein Ziel. Treffer: 9 (2W6 + 2) Stichschaden im Nahkampf oder 5 (1W6 + 2) Stichschaden im Fernkampf.',
      ],
    ],
  },
  'copper-dragon-wyrmling': {
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 7 (1W10 + 2) Stichschaden.',
      ],
      [
        'Odemwaffen (Aufladung 5–6)',
        'Der Drache setzt eine der folgenden Odemwaffen ein.\nSäureodem. Der Drache atmet Säure in einer 6-m-Linie aus, die 1,5 m breit ist. Jede Kreatur in dieser Linie muss einen Geschicklichkeitsrettungswurf mit SG 11 ablegen. Bei einem Misserfolg erleidet sie 18 (4W8) Säureschaden, bei einem Erfolg die Hälfte.\nVerlangsamender Odem. Der Drache atmet Gas in einem 4,5-m-Kegel aus. Jede Kreatur in diesem Bereich muss einen Konstitutionsrettungswurf mit SG 11 ablegen. Bei einem Misserfolg kann die Kreatur keine Reaktionen ausführen, ihre Bewegungsrate ist halbiert, und sie kann in ihrem Zug nicht mehr als einen Angriff ausführen. Außerdem kann die Kreatur in ihrem Zug entweder eine Aktion oder eine Bonusaktion nutzen, aber nicht beides. Diese Wirkungen halten 1 Minute lang an. Die Kreatur kann den Rettungswurf am Ende jedes ihrer Züge wiederholen und beendet die Wirkungen bei einem Erfolg für sich.',
      ],
    ],
  },
  'death-dog': {
    traits: [
      [
        'Zweiköpfig',
        'Der Hund ist bei Weisheitswürfen (Wahrnehmung) und bei Rettungswürfen gegen Blindheit, Bezauberung, Taubheit, Furcht, Betäubung und Bewusstlosigkeit im Vorteil.',
      ],
    ],
    actions: [
      ['Mehrfachangriff', 'Der Hund führt zwei Bissangriffe aus.'],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 5 (1W6 + 2) Stichschaden. Ist das Ziel eine Kreatur, muss es einen Konstitutionsrettungswurf mit SG 12 gegen Krankheit bestehen, sonst ist es vergiftet, bis die Krankheit geheilt ist. Alle 24 Stunden muss die Kreatur den Rettungswurf wiederholen; bei einem Misserfolg sinkt ihr Trefferpunktemaximum um 5 (1W10). Diese Verringerung hält an, bis die Krankheit geheilt ist. Die Kreatur stirbt, wenn die Krankheit ihr Trefferpunktemaximum auf 0 senkt.',
      ],
    ],
  },
  'dire-wolf': {
    traits: [
      [
        'Scharfes Gehör und scharfer Geruchssinn',
        'Der Wolf ist bei Weisheitswürfen (Wahrnehmung), die auf dem Gehör oder dem Geruchssinn beruhen, im Vorteil.',
      ],
      [
        'Rudeltaktik',
        'Der Wolf ist bei Angriffswürfen gegen eine Kreatur im Vorteil, wenn sich mindestens ein nicht kampfunfähiger Verbündeter des Wolfs im Umkreis von 1,5 m um die Kreatur befindet.',
      ],
    ],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 10 (2W6 + 3) Stichschaden. Ist das Ziel eine Kreatur, muss es einen Stärkerettungswurf mit SG 13 bestehen, sonst wird es zu Boden geworfen.',
      ],
    ],
  },
  dryad: {
    traits: [
      [
        'Angeborenes Zauberwirken',
        'Das Attribut der Dryade zum angeborenen Zauberwirken ist Charisma (Zauberrettungswurf-SG 14). Die Dryade kann die folgenden Zauber angeboren wirken, ohne Materialkomponenten zu benötigen:\nBeliebig oft: Druidenkunst\nJe 3-mal täglich: Verstricken, Gute Beeren\nJe 1-mal täglich: Rindenhaut, Spurloses Gehen, Shillelagh',
      ],
      [
        'Magieresistenz',
        'Die Dryade ist bei Rettungswürfen gegen Zauber und andere magische Effekte im Vorteil.',
      ],
      [
        'Mit Tieren und Pflanzen sprechen',
        'Die Dryade kann mit Tieren und Pflanzen kommunizieren, als hätten sie eine gemeinsame Sprache.',
      ],
      [
        'Baumwandeln',
        'Einmal in ihrem Zug kann die Dryade 3 m ihrer Bewegung nutzen, um magisch in einen lebenden Baum in ihrer Reichweite zu treten und aus einem zweiten lebenden Baum im Umkreis von 18 m um den ersten wieder herauszutreten; sie erscheint in einem freien Bereich im Umkreis von 1,5 m um den zweiten Baum. Beide Bäume müssen groß oder größer sein.',
      ],
    ],
    actions: [
      [
        'Knüppel',
        'Nahkampf-Waffenangriff: +2 auf Treffer (+6 auf Treffer mit Shillelagh), Reichweite 1,5 m, ein Ziel. Treffer: 2 (1W4) Wuchtschaden oder 8 (1W8 + 4) Wuchtschaden mit Shillelagh.',
      ],
      [
        'Feenzauber',
        'Die Dryade wählt einen Humanoiden oder ein Tier, den oder das sie im Umkreis von 9 m sehen kann, als Ziel. Kann das Ziel die Dryade sehen, muss es einen Weisheitsrettungswurf mit SG 14 bestehen, sonst ist es magisch bezaubert. Die bezauberte Kreatur betrachtet die Dryade als vertraute Freundin, auf die sie hört und die sie beschützt. Obwohl das Ziel nicht unter der Kontrolle der Dryade steht, nimmt es ihre Bitten oder Handlungen so wohlwollend wie möglich auf.\nJedes Mal, wenn die Dryade oder ihre Verbündeten dem Ziel etwas Schädliches antun, kann es den Rettungswurf wiederholen und beendet die Wirkung bei einem Erfolg für sich. Andernfalls hält die Wirkung 24 Stunden lang an oder bis die Dryade stirbt, sich auf einer anderen Existenzebene als das Ziel befindet oder die Wirkung als Bonusaktion beendet. Ist der Rettungswurf eines Ziels erfolgreich, ist das Ziel für die nächsten 24 Stunden immun gegen den Feenzauber der Dryade.\nDie Dryade kann gleichzeitig höchstens einen Humanoiden und bis zu drei Tiere bezaubert haben.',
      ],
    ],
  },
  duergar: {
    traits: [
      [
        'Duergar-Widerstandskraft',
        'Der Duergar ist bei Rettungswürfen gegen Gift, Zauber und Illusionen sowie gegen Bezauberung und Lähmung im Vorteil.',
      ],
      [
        'Sonnenlichtempfindlichkeit',
        'Im Sonnenlicht ist der Duergar bei Angriffswürfen sowie bei Weisheitswürfen (Wahrnehmung), die auf der Sicht beruhen, im Nachteil.',
      ],
    ],
    actions: [
      [
        'Vergrößern (Aufladung nach einer kurzen oder langen Rast)',
        '1 Minute lang wächst der Duergar magisch samt allem, was er trägt oder hält. Solange er vergrößert ist, ist der Duergar groß, verdoppelt die Schadenswürfel seiner stärkebasierten Waffenangriffe (in den Angriffen enthalten) und ist bei Stärkewürfen und Stärkerettungswürfen im Vorteil. Fehlt dem Duergar der Platz, um groß zu werden, erreicht er die größtmögliche Größe im verfügbaren Raum.',
      ],
      [
        'Kriegspicke',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 6 (1W8 + 2) Stichschaden oder 11 (2W8 + 2) Stichschaden in vergrößertem Zustand.',
      ],
      [
        'Wurfspeer',
        'Nah- oder Fernkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m oder Reichweite 9/36 m, ein Ziel. Treffer: 5 (1W6 + 2) Stichschaden oder 9 (2W6 + 2) Stichschaden in vergrößertem Zustand.',
      ],
      [
        'Unsichtbarkeit (Aufladung nach einer kurzen oder langen Rast)',
        'Der Duergar wird magisch unsichtbar, bis er angreift, einen Zauber wirkt oder Vergrößern einsetzt oder bis seine Konzentration unterbrochen wird, bis zu 1 Stunde (als würde er sich auf einen Zauber konzentrieren). Ausrüstung, die der Duergar trägt oder hält, ist mit ihm unsichtbar.',
      ],
    ],
  },
  ghoul: {
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +2 auf Treffer, Reichweite 1,5 m, eine Kreatur. Treffer: 9 (2W6 + 2) Stichschaden.',
      ],
      [
        'Klauen',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 7 (2W4 + 2) Hiebschaden. Ist das Ziel eine Kreatur, die weder ein Elf noch untot ist, muss es einen Konstitutionsrettungswurf mit SG 10 bestehen, sonst ist es 1 Minute lang gelähmt. Das Ziel kann den Rettungswurf am Ende jedes seiner Züge wiederholen und beendet die Wirkung bei einem Erfolg für sich.',
      ],
    ],
  },
  'giant-eagle': {
    traits: [
      [
        'Scharfe Sicht',
        'Der Adler ist bei Weisheitswürfen (Wahrnehmung), die auf der Sicht beruhen, im Vorteil.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Adler führt zwei Angriffe aus: einen mit seinem Schnabel und einen mit seinen Krallen.',
      ],
      [
        'Schnabel',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 6 (1W6 + 3) Stichschaden.',
      ],
      [
        'Krallen',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 10 (2W6 + 3) Hiebschaden.',
      ],
    ],
  },
  'giant-hyena': {
    traits: [
      [
        'Amoklauf',
        'Senkt die Hyäne in ihrem Zug eine Kreatur mit einem Nahkampfangriff auf 0 Trefferpunkte, kann die Hyäne eine Bonusaktion nutzen, um sich bis zur Hälfte ihrer Bewegungsrate zu bewegen und einen Bissangriff auszuführen.',
      ],
    ],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 10 (2W6 + 3) Stichschaden.',
      ],
    ],
  },
  'giant-octopus': {
    traits: [
      ['Atem anhalten', 'Außerhalb des Wassers kann der Krake 1 Stunde lang den Atem anhalten.'],
      [
        'Unterwassertarnung',
        'Der Krake ist bei Geschicklichkeitswürfen (Heimlichkeit) unter Wasser im Vorteil.',
      ],
      ['Wasseratmung', 'Der Krake kann nur unter Wasser atmen.'],
    ],
    actions: [
      [
        'Tentakel',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 4,5 m, ein Ziel. Treffer: 10 (2W6 + 3) Wuchtschaden. Ist das Ziel eine Kreatur, wird es gepackt (Entkommen-SG 16). Bis der Griff endet, ist das Ziel festgesetzt, und der Krake kann seine Tentakel nicht gegen ein anderes Ziel einsetzen.',
      ],
      [
        'Tintenwolke (Aufladung nach einer kurzen oder langen Rast)',
        'Eine Tintenwolke mit 6 m Radius breitet sich rings um den Kraken aus, sofern er unter Wasser ist. Der Bereich ist 1 Minute lang komplett verschleiert, doch eine starke Strömung kann die Tinte zerstreuen. Nachdem er die Tinte ausgestoßen hat, kann der Krake die Aktion Spurten als Bonusaktion ausführen.',
      ],
    ],
  },
  'giant-spider': {
    traits: [
      [
        'Spinnenklettern',
        'Die Spinne kann an schwierigen Oberflächen klettern, auch kopfüber an Decken, ohne einen Attributswurf ablegen zu müssen.',
      ],
      [
        'Netzgespür',
        'Solange die Spinne ein Netz berührt, kennt sie den genauen Aufenthaltsort jeder anderen Kreatur, die dasselbe Netz berührt.',
      ],
      ['Netzläufer', 'Die Spinne ignoriert Bewegungseinschränkungen durch Spinnweben.'],
    ],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, eine Kreatur. Treffer: 7 (1W8 + 3) Stichschaden, und das Ziel muss einen Konstitutionsrettungswurf mit SG 11 ablegen. Bei einem Misserfolg erleidet es 9 (2W8) Giftschaden, bei einem Erfolg die Hälfte. Senkt der Giftschaden das Ziel auf 0 Trefferpunkte, ist das Ziel stabil, aber 1 Stunde lang vergiftet, selbst nachdem es Trefferpunkte zurückerhalten hat, und solange es auf diese Weise vergiftet ist, ist es gelähmt.',
      ],
      [
        'Netz (Aufladung 5–6)',
        'Fernkampf-Waffenangriff: +5 auf Treffer, Reichweite 9/18 m, eine Kreatur. Treffer: Das Ziel ist durch Spinnweben festgesetzt. Als Aktion kann das festgesetzte Ziel einen Stärkewurf gegen SG 12 ablegen und die Spinnweben bei einem Erfolg zerreißen. Die Spinnweben können auch angegriffen und zerstört werden (RK 10; TP 5; Anfälligkeit für Feuerschaden; Immunität gegen Wucht-, Gift- und psychischen Schaden).',
      ],
    ],
  },
  'giant-toad': {
    traits: [
      ['Amphibisch', 'Die Kröte kann Luft und Wasser atmen.'],
      [
        'Sprung aus dem Stand',
        'Der Weitsprung der Kröte reicht bis zu 6 m, ihr Hochsprung bis zu 3 m, mit oder ohne Anlauf.',
      ],
    ],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 7 (1W10 + 2) Stichschaden plus 5 (1W10) Giftschaden, und das Ziel wird gepackt (Entkommen-SG 13). Bis der Griff endet, ist das Ziel festgesetzt, und die Kröte kann kein anderes Ziel beißen.',
      ],
      [
        'Verschlucken',
        'Die Kröte führt einen Bissangriff gegen ein mittelgroßes oder kleineres Ziel aus, das sie gepackt hält. Trifft der Angriff, wird das Ziel verschluckt, und der Griff endet. Das verschluckte Ziel ist blind und festgesetzt, hat vollständige Deckung gegen Angriffe und andere Effekte von außerhalb der Kröte und erleidet zu Beginn jedes Zuges der Kröte 10 (3W6) Säureschaden. Die Kröte kann jeweils nur ein Ziel verschluckt haben.\nStirbt die Kröte, ist eine verschluckte Kreatur nicht länger festgesetzt und kann mit 1,5 m Bewegung aus dem Kadaver entkommen; sie liegt danach am Boden.',
      ],
    ],
  },
  'giant-vulture': {
    traits: [
      [
        'Scharfe Sicht und scharfer Geruchssinn',
        'Der Geier ist bei Weisheitswürfen (Wahrnehmung), die auf der Sicht oder dem Geruchssinn beruhen, im Vorteil.',
      ],
      [
        'Rudeltaktik',
        'Der Geier ist bei Angriffswürfen gegen eine Kreatur im Vorteil, wenn sich mindestens ein nicht kampfunfähiger Verbündeter des Geiers im Umkreis von 1,5 m um die Kreatur befindet.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Geier führt zwei Angriffe aus: einen mit seinem Schnabel und einen mit seinen Krallen.',
      ],
      [
        'Schnabel',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 7 (2W4 + 2) Stichschaden.',
      ],
      [
        'Krallen',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 9 (2W6 + 2) Hiebschaden.',
      ],
    ],
  },
  harpy: {
    actions: [
      [
        'Mehrfachangriff',
        'Die Harpyie führt zwei Angriffe aus: einen mit ihren Klauen und einen mit ihrem Knüppel.',
      ],
      [
        'Klauen',
        'Nahkampf-Waffenangriff: +3 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 6 (2W4 + 1) Hiebschaden.',
      ],
      [
        'Knüppel',
        'Nahkampf-Waffenangriff: +3 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 3 (1W4 + 1) Wuchtschaden.',
      ],
      [
        'Lockgesang',
        'Die Harpyie singt eine magische Melodie. Jeder Humanoide und Riese im Umkreis von 90 m um die Harpyie, der das Lied hören kann, muss einen Weisheitsrettungswurf mit SG 11 bestehen, sonst ist er bezaubert, bis das Lied endet. Die Harpyie muss in ihren folgenden Zügen eine Bonusaktion nutzen, um weiterzusingen. Sie kann jederzeit aufhören zu singen. Das Lied endet, wenn die Harpyie kampfunfähig ist.\nSolange ein Ziel von der Harpyie bezaubert ist, ist es kampfunfähig und ignoriert die Lieder anderer Harpyien. Ist das bezauberte Ziel mehr als 1,5 m von der Harpyie entfernt, muss es sich in seinem Zug auf dem direktesten Weg auf die Harpyie zubewegen. Es weicht Gelegenheitsangriffen nicht aus, doch bevor es sich in schädliches Gelände wie Lava oder eine Grube bewegt, und wann immer es Schaden aus einer anderen Quelle als der Harpyie erleidet, kann ein Ziel den Rettungswurf wiederholen. Eine Kreatur kann den Rettungswurf außerdem am Ende jedes ihrer Züge wiederholen. Ist der Rettungswurf einer Kreatur erfolgreich, endet die Wirkung für sie.\nEin Ziel, dessen Rettungswurf gelingt, ist für die nächsten 24 Stunden immun gegen das Lied dieser Harpyie.',
      ],
    ],
  },
  hippogriff: {
    traits: [
      [
        'Scharfe Sicht',
        'Der Hippogreif ist bei Weisheitswürfen (Wahrnehmung), die auf der Sicht beruhen, im Vorteil.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Hippogreif führt zwei Angriffe aus: einen mit seinem Schnabel und einen mit seinen Klauen.',
      ],
      [
        'Schnabel',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 8 (1W10 + 3) Stichschaden.',
      ],
      [
        'Klauen',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 10 (2W6 + 3) Hiebschaden.',
      ],
    ],
  },
  imp: {
    traits: [
      [
        'Gestaltwandler',
        'Der Imp kann seine Aktion nutzen, um sich in eine Tiergestalt zu verwandeln, die einer Ratte (Bewegungsrate 6 m), einem Raben (6 m, Fliegen 18 m) oder einer Spinne (6 m, Klettern 6 m) ähnelt, oder zurück in seine wahre Gestalt. Seine Spielwerte sind in jeder Gestalt gleich, bis auf die genannten Änderungen der Bewegungsrate. Ausrüstung, die er trägt oder hält, wird nicht verwandelt. Stirbt er, nimmt er wieder seine wahre Gestalt an.',
      ],
      ['Teufelssicht', 'Magische Dunkelheit behindert die Dunkelsicht des Imps nicht.'],
      [
        'Magieresistenz',
        'Der Imp ist bei Rettungswürfen gegen Zauber und andere magische Effekte im Vorteil.',
      ],
    ],
    actions: [
      [
        'Stachel (Biss in Tiergestalt)',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 5 (1W4 + 3) Stichschaden, und das Ziel muss einen Konstitutionsrettungswurf mit SG 11 ablegen. Bei einem Misserfolg erleidet es 10 (3W6) Giftschaden, bei einem Erfolg die Hälfte.',
      ],
      [
        'Unsichtbarkeit',
        'Der Imp wird magisch unsichtbar, bis er angreift oder bis seine Konzentration endet (als würde er sich auf einen Zauber konzentrieren). Ausrüstung, die der Imp trägt oder hält, ist mit ihm unsichtbar.',
      ],
    ],
  },
  lion: {
    traits: [
      [
        'Scharfer Geruchssinn',
        'Der Löwe ist bei Weisheitswürfen (Wahrnehmung), die auf dem Geruchssinn beruhen, im Vorteil.',
      ],
      [
        'Rudeltaktik',
        'Der Löwe ist bei Angriffswürfen gegen eine Kreatur im Vorteil, wenn sich mindestens ein nicht kampfunfähiger Verbündeter des Löwen im Umkreis von 1,5 m um die Kreatur befindet.',
      ],
      [
        'Anspringen',
        'Bewegt sich der Löwe mindestens 6 m geradlinig auf eine Kreatur zu und trifft sie dann im selben Zug mit einem Klauenangriff, muss das Ziel einen Stärkerettungswurf mit SG 13 bestehen, sonst wird es zu Boden geworfen. Liegt das Ziel am Boden, kann der Löwe als Bonusaktion einen Bissangriff gegen es ausführen.',
      ],
      [
        'Sprung mit Anlauf',
        'Mit 3 m Anlauf kann der Löwe einen Weitsprung von bis zu 7,5 m ausführen.',
      ],
    ],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 7 (1W8 + 3) Stichschaden.',
      ],
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 6 (1W6 + 3) Hiebschaden.',
      ],
    ],
  },
  quasit: {
    traits: [
      [
        'Gestaltwandler',
        'Der Quasit kann seine Aktion nutzen, um sich in eine Tiergestalt zu verwandeln, die einer Fledermaus (Bewegungsrate 3 m, Fliegen 12 m), einem Tausendfüßler (12 m, Klettern 12 m) oder einer Kröte (12 m, Schwimmen 12 m) ähnelt, oder zurück in seine wahre Gestalt. Seine Spielwerte sind in jeder Gestalt gleich, bis auf die genannten Änderungen der Bewegungsrate. Ausrüstung, die er trägt oder hält, wird nicht verwandelt. Stirbt er, nimmt er wieder seine wahre Gestalt an.',
      ],
      [
        'Magieresistenz',
        'Der Quasit ist bei Rettungswürfen gegen Zauber und andere magische Effekte im Vorteil.',
      ],
    ],
    actions: [
      [
        'Klaue (Biss in Tiergestalt)',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 5 (1W4 + 3) Stichschaden, und das Ziel muss einen Konstitutionsrettungswurf mit SG 10 bestehen, sonst erleidet es 5 (2W4) Giftschaden und ist 1 Minute lang vergiftet. Das Ziel kann den Rettungswurf am Ende jedes seiner Züge wiederholen und beendet die Wirkung bei einem Erfolg für sich.',
      ],
      [
        'Erschrecken (1-mal täglich)',
        'Eine Kreatur nach Wahl des Quasits im Umkreis von 6 m um ihn muss einen Weisheitsrettungswurf mit SG 10 bestehen, sonst ist sie 1 Minute lang verängstigt. Das Ziel kann den Rettungswurf am Ende jedes seiner Züge wiederholen, im Nachteil, wenn der Quasit in Sichtlinie ist, und beendet die Wirkung bei einem Erfolg für sich.',
      ],
      [
        'Unsichtbarkeit',
        'Der Quasit wird magisch unsichtbar, bis er angreift oder Erschrecken einsetzt oder bis seine Konzentration endet (als würde er sich auf einen Zauber konzentrieren). Ausrüstung, die der Quasit trägt oder hält, ist mit ihm unsichtbar.',
      ],
    ],
  },
  specter: {
    traits: [
      [
        'Körperlose Bewegung',
        'Das Gespenst kann sich durch andere Kreaturen und Gegenstände bewegen, als wären sie schwieriges Gelände. Beendet es seinen Zug in einem Gegenstand, erleidet es 5 (1W10) Energieschaden.',
      ],
      [
        'Sonnenlichtempfindlichkeit',
        'Im Sonnenlicht ist das Gespenst bei Angriffswürfen sowie bei Weisheitswürfen (Wahrnehmung), die auf der Sicht beruhen, im Nachteil.',
      ],
    ],
    actions: [
      [
        'Lebensentzug',
        'Nahkampf-Zauberangriff: +4 auf Treffer, Reichweite 1,5 m, eine Kreatur. Treffer: 10 (3W6) nekrotischen Schaden. Das Ziel muss einen Konstitutionsrettungswurf mit SG 10 bestehen, sonst sinkt sein Trefferpunktemaximum um den erlittenen Schaden. Diese Verringerung hält an, bis die Kreatur eine lange Rast beendet. Das Ziel stirbt, wenn diese Wirkung sein Trefferpunktemaximum auf 0 senkt.',
      ],
    ],
  },
  spy: {
    traits: [
      [
        'Raffinierte Aktion',
        'In jedem seiner Züge kann der Spion eine Bonusaktion nutzen, um die Aktion Spurten, Lösen oder Verstecken auszuführen.',
      ],
      [
        'Hinterhältiger Angriff (1-mal pro Zug)',
        'Der Spion verursacht zusätzlich 7 (2W6) Schaden, wenn er ein Ziel mit einem Waffenangriff trifft und beim Angriffswurf im Vorteil ist, oder wenn sich das Ziel im Umkreis von 1,5 m um einen nicht kampfunfähigen Verbündeten des Spions befindet und der Spion beim Angriffswurf nicht im Nachteil ist.',
      ],
    ],
    actions: [
      ['Mehrfachangriff', 'Der Spion führt zwei Nahkampfangriffe aus.'],
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
  'swarm-of-quippers': {
    traits: [
      [
        'Blutrausch',
        'Der Schwarm ist bei Nahkampfangriffswürfen gegen jede Kreatur im Vorteil, die nicht alle ihre Trefferpunkte hat.',
      ],
      [
        'Schwarm',
        'Der Schwarm kann den Bereich einer anderen Kreatur besetzen und umgekehrt, und der Schwarm kann sich durch jede Öffnung bewegen, die groß genug für einen winzigen Quipper ist. Der Schwarm kann keine Trefferpunkte zurückerhalten und keine temporären Trefferpunkte erhalten.',
      ],
      ['Wasseratmung', 'Der Schwarm kann nur unter Wasser atmen.'],
    ],
    actions: [
      [
        'Bisse',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 0 m, eine Kreatur im Bereich des Schwarms. Treffer: 14 (4W6) Stichschaden, oder 7 (2W6) Stichschaden, wenn der Schwarm die Hälfte seiner Trefferpunkte oder weniger hat.',
      ],
    ],
  },
  tiger: {
    traits: [
      [
        'Scharfer Geruchssinn',
        'Der Tiger ist bei Weisheitswürfen (Wahrnehmung), die auf dem Geruchssinn beruhen, im Vorteil.',
      ],
      [
        'Anspringen',
        'Bewegt sich der Tiger mindestens 6 m geradlinig auf eine Kreatur zu und trifft sie dann im selben Zug mit einem Klauenangriff, muss das Ziel einen Stärkerettungswurf mit SG 13 bestehen, sonst wird es zu Boden geworfen. Liegt das Ziel am Boden, kann der Tiger als Bonusaktion einen Bissangriff gegen es ausführen.',
      ],
    ],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 8 (1W10 + 3) Stichschaden.',
      ],
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 7 (1W8 + 3) Hiebschaden.',
      ],
    ],
  },
};
