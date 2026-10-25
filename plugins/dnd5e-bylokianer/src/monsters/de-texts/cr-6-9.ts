// German texts of the SRD monsters of challenge ratings 6 to 9: traits, actions, reactions and legendary
// actions. Our own translation of the SRD 5.1, CC-BY-4.0 (see NOTICE.md).

import type { DeMonsterText } from '../model';

export const DE_TEXTS_CR6: Readonly<Record<string, DeMonsterText>> = {
  assassin: {
    traits: [
      [
        'Meucheln',
        'In seinem ersten Zug ist der Assassine bei Angriffswürfen gegen jede Kreatur im Vorteil, die noch keinen Zug ausgeführt hat. Jeder Treffer, den der Assassine gegen eine überraschte Kreatur erzielt, ist ein kritischer Treffer.',
      ],
      [
        'Entrinnen',
        'Ist der Assassine einer Wirkung ausgesetzt, bei der er mit einem Geschicklichkeitsrettungswurf nur den halben Schaden erleidet, erleidet er stattdessen keinen Schaden, wenn der Rettungswurf gelingt, und nur den halben Schaden, wenn er misslingt.',
      ],
      [
        'Hinterhältiger Angriff (1-mal pro Zug)',
        'Der Assassine verursacht zusätzlich 13 (4W6) Schaden, wenn er ein Ziel mit einem Waffenangriff trifft und beim Angriffswurf im Vorteil ist, oder wenn sich das Ziel im Umkreis von 1,5 m um einen nicht kampfunfähigen Verbündeten des Assassinen befindet und der Assassine beim Angriffswurf nicht im Nachteil ist.',
      ],
    ],
    actions: [
      ['Mehrfachangriff', 'Der Assassine führt zwei Kurzschwertangriffe aus.'],
      [
        'Kurzschwert',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 6 (1W6 + 3) Stichschaden, und das Ziel muss einen Konstitutionsrettungswurf mit SG 15 ablegen. Bei einem Misserfolg erleidet es 24 (7W6) Giftschaden, bei einem Erfolg die Hälfte.',
      ],
      [
        'Leichte Armbrust',
        'Fernkampf-Waffenangriff: +6 auf Treffer, Reichweite 24/96 m, ein Ziel. Treffer: 7 (1W8 + 3) Stichschaden, und das Ziel muss einen Konstitutionsrettungswurf mit SG 15 ablegen. Bei einem Misserfolg erleidet es 24 (7W6) Giftschaden, bei einem Erfolg die Hälfte.',
      ],
    ],
  },
  'bone-devil': {
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
        'Der Teufel führt drei Angriffe aus: zwei mit seinen Klauen und einen mit seinem Stachel.',
      ],
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +8 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 8 (1W8 + 4) Hiebschaden.',
      ],
      [
        'Stachel',
        'Nahkampf-Waffenangriff: +8 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 13 (2W8 + 4) Stichschaden plus 17 (5W6) Giftschaden, und das Ziel muss einen Konstitutionsrettungswurf mit SG 14 bestehen, sonst ist es 1 Minute lang vergiftet. Das Ziel kann den Rettungswurf am Ende jedes seiner Züge wiederholen und beendet die Wirkung bei einem Erfolg für sich.',
      ],
    ],
  },
  'chain-devil': {
    traits: [
      ['Teufelssicht', 'Magische Dunkelheit behindert die Dunkelsicht des Teufels nicht.'],
      [
        'Magieresistenz',
        'Der Teufel ist bei Rettungswürfen gegen Zauber und andere magische Effekte im Vorteil.',
      ],
    ],
    actions: [
      ['Mehrfachangriff', 'Der Teufel führt zwei Angriffe mit seinen Ketten aus.'],
      [
        'Kette',
        'Nahkampf-Waffenangriff: +8 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 11 (2W6 + 4) Hiebschaden. Das Ziel wird gepackt (Entkommen-SG 14), sofern der Teufel nicht bereits eine Kreatur gepackt hält. Bis der Griff endet, ist das Ziel festgesetzt und erleidet zu Beginn jedes seiner Züge 7 (2W6) Stichschaden.',
      ],
      [
        'Ketten beleben (Aufladung nach einer kurzen oder langen Rast)',
        'Bis zu vier Ketten, die der Teufel im Umkreis von 18 m sehen kann, wachsen magisch messerscharfe Widerhaken, und sie erwachen unter der Kontrolle des Teufels zum Leben, sofern die Ketten nicht getragen oder gehalten werden.\nJede belebte Kette ist ein Objekt mit RK 20, 20 Trefferpunkten, Resistenz gegen Stichschaden und Immunität gegen psychischen Schaden und Schallschaden. Setzt der Teufel in seinem Zug Mehrfachangriff ein, kann er mit jeder belebten Kette einen zusätzlichen Kettenangriff ausführen. Eine belebte Kette kann selbst eine Kreatur packen, aber keine Angriffe ausführen, solange sie jemanden gepackt hält. Eine belebte Kette fällt in ihren unbelebten Zustand zurück, wenn sie auf 0 Trefferpunkte sinkt oder der Teufel kampfunfähig wird oder stirbt.',
      ],
    ],
    reactions: [
      [
        'Verstörende Maske',
        'Beginnt eine Kreatur, die der Teufel sehen kann, ihren Zug im Umkreis von 9 m um den Teufel, kann der Teufel die Illusion erzeugen, wie ein verstorbener geliebter Mensch oder ein erbitterter Feind dieser Kreatur auszusehen. Kann die Kreatur den Teufel sehen, muss sie einen Weisheitsrettungswurf mit SG 14 bestehen, sonst ist sie bis zum Ende ihres Zuges verängstigt.',
      ],
    ],
  },
  chimera: {
    actions: [
      [
        'Mehrfachangriff',
        'Die Chimäre führt drei Angriffe aus: einen mit ihrem Biss, einen mit ihren Hörnern und einen mit ihren Klauen. Ist ihr Feuerodem verfügbar, kann sie den Odem anstelle von Biss oder Hörnern einsetzen.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 11 (2W6 + 4) Stichschaden.',
      ],
      [
        'Hörner',
        'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 10 (1W12 + 4) Wuchtschaden.',
      ],
      [
        'Klauen',
        'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 11 (2W6 + 4) Hiebschaden.',
      ],
      [
        'Feuerodem (Aufladung 5–6)',
        'Der Drachenkopf atmet Feuer in einem 4,5-m-Kegel aus. Jede Kreatur in diesem Bereich muss einen Geschicklichkeitsrettungswurf mit SG 15 ablegen. Bei einem Misserfolg erleidet sie 31 (7W8) Feuerschaden, bei einem Erfolg die Hälfte.',
      ],
    ],
  },
  'clay-golem': {
    traits: [
      [
        'Säureabsorption',
        'Wann immer der Golem Säureschaden ausgesetzt ist, erleidet er keinen Schaden und erhält stattdessen Trefferpunkte in Höhe des verursachten Säureschadens zurück.',
      ],
      [
        'Berserker',
        'Beginnt der Golem seinen Zug mit 60 oder weniger Trefferpunkten, wirf einen W6. Bei einer 6 gerät der Golem in Raserei. In jedem seiner Züge in Raserei greift der Golem die nächste Kreatur an, die er sehen kann. Ist keine Kreatur nah genug, um sich zu ihr zu bewegen und sie anzugreifen, greift der Golem einen Gegenstand an, bevorzugt einen, der kleiner ist als er selbst. Ist der Golem einmal in Raserei geraten, bleibt er es, bis er zerstört wird oder alle seine Trefferpunkte zurückerhält.',
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
      ['Mehrfachangriff', 'Der Golem führt zwei Hiebangriffe aus.'],
      [
        'Hieb',
        'Nahkampf-Waffenangriff: +8 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 16 (2W10 + 5) Wuchtschaden. Ist das Ziel eine Kreatur, muss es einen Konstitutionsrettungswurf mit SG 15 bestehen, sonst sinkt sein Trefferpunktemaximum um den erlittenen Schaden. Das Ziel stirbt, wenn dieser Angriff sein Trefferpunktemaximum auf 0 senkt. Die Verringerung hält an, bis sie durch den Zauber Vollständige Genesung oder andere Magie aufgehoben wird.',
      ],
      [
        'Hast (Aufladung 5–6)',
        'Bis zum Ende seines nächsten Zuges erhält der Golem magisch einen Bonus von +2 auf seine RK, ist bei Geschicklichkeitsrettungswürfen im Vorteil und kann seinen Hiebangriff als Bonusaktion einsetzen.',
      ],
    ],
  },
  cloaker: {
    traits: [
      [
        'Schadensübertragung',
        'Solange der Mantler an einer Kreatur haftet, erleidet er nur die Hälfte des Schadens, der ihm zugefügt wird (abgerundet), und diese Kreatur erleidet die andere Hälfte.',
      ],
      [
        'Falsches Erscheinungsbild',
        'Solange der Mantler sich nicht bewegt und seine Unterseite nicht zeigt, ist er nicht von einem dunklen Ledermantel zu unterscheiden.',
      ],
      [
        'Lichtempfindlichkeit',
        'In hellem Licht ist der Mantler bei Angriffswürfen und bei Weisheitswürfen (Wahrnehmung), die auf der Sicht beruhen, im Nachteil.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Mantler führt zwei Angriffe aus: einen mit seinem Biss und einen mit seinem Schwanz.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 1,5 m, eine Kreatur. Treffer: 10 (2W6 + 3) Stichschaden, und ist das Ziel groß oder kleiner, heftet sich der Mantler an es. Ist der Mantler gegen das Ziel im Vorteil, heftet er sich an den Kopf des Ziels, und das Ziel ist blind und kann nicht atmen, solange der Mantler an ihm haftet. Solange er haftet, kann der Mantler diesen Angriff nur gegen das Ziel ausführen und ist beim Angriffswurf im Vorteil. Der Mantler kann sich lösen, indem er 1,5 m seiner Bewegung aufwendet. Eine Kreatur, auch das Ziel, kann ihre Aktion nutzen, um den Mantler mit einem erfolgreichen Stärkewurf gegen SG 16 zu lösen.',
      ],
      [
        'Schwanz',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 3 m, eine Kreatur. Treffer: 7 (1W8 + 3) Hiebschaden.',
      ],
      [
        'Stöhnen',
        'Jede Kreatur im Umkreis von 18 m um den Mantler, die sein Stöhnen hören kann und keine Aberration ist, muss einen Weisheitsrettungswurf mit SG 13 bestehen, sonst ist sie bis zum Ende des nächsten Zuges des Mantlers verängstigt. Ist der Rettungswurf einer Kreatur erfolgreich, ist die Kreatur für die nächsten 24 Stunden immun gegen das Stöhnen des Mantlers.',
      ],
      [
        'Trugbilder (Aufladung nach einer kurzen oder langen Rast)',
        'Der Mantler erschafft magisch drei illusorische Doppelgänger von sich, sofern er sich nicht in hellem Licht befindet. Die Doppelgänger bewegen sich mit ihm und ahmen seine Aktionen nach, wobei sie ihre Positionen so wechseln, dass unmöglich zu verfolgen ist, welcher Mantler der echte ist. Befindet sich der Mantler jemals in einem Bereich hellen Lichts, verschwinden die Doppelgänger.\nWann immer eine Kreatur den Mantler mit einem Angriff oder einem schädlichen Zauber zum Ziel nimmt, während noch ein Doppelgänger existiert, würfelt diese Kreatur zufällig aus, ob sie den Mantler oder einen der Doppelgänger trifft. Eine Kreatur ist von diesem magischen Effekt nicht betroffen, wenn sie nicht sehen kann oder sich auf andere Sinne als die Sicht verlässt.\nEin Doppelgänger hat die RK des Mantlers und nutzt dessen Rettungswürfe. Trifft ein Angriff einen Doppelgänger oder misslingt einem Doppelgänger ein Rettungswurf gegen eine Wirkung, die Schaden verursacht, verschwindet der Doppelgänger.',
      ],
    ],
  },
  'cloud-giant': {
    traits: [
      [
        'Scharfer Geruchssinn',
        'Der Riese ist bei Weisheitswürfen (Wahrnehmung), die auf dem Geruchssinn beruhen, im Vorteil.',
      ],
      [
        'Angeborenes Zauberwirken',
        'Das Attribut des Riesen zum angeborenen Zauberwirken ist Charisma. Er kann die folgenden Zauber angeboren wirken, ohne Materialkomponenten zu benötigen:\nBeliebig oft: Magie entdecken, Nebelwolke, Licht\nJe 3-mal täglich: Federfall, Fliegen, Nebelschritt, Telekinese\nJe 1-mal täglich: Wetterkontrolle, Gasförmige Gestalt',
      ],
    ],
    actions: [
      ['Mehrfachangriff', 'Der Riese führt zwei Morgensternangriffe aus.'],
      [
        'Morgenstern',
        'Nahkampf-Waffenangriff: +12 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 21 (3W8 + 8) Stichschaden.',
      ],
      [
        'Fels',
        'Fernkampf-Waffenangriff: +12 auf Treffer, Reichweite 18/72 m, ein Ziel. Treffer: 30 (4W10 + 8) Wuchtschaden.',
      ],
    ],
  },
  drider: {
    traits: [
      [
        'Feenblut',
        'Der Drider ist bei Rettungswürfen gegen Bezauberung im Vorteil, und Magie kann den Drider nicht in Schlaf versetzen.',
      ],
      [
        'Angeborenes Zauberwirken',
        'Das Attribut des Driders zum angeborenen Zauberwirken ist Weisheit (Zauberrettungswurf-SG 13). Der Drider kann die folgenden Zauber angeboren wirken, ohne Materialkomponenten zu benötigen:\nBeliebig oft: Tanzende Lichter\nJe 1-mal täglich: Dunkelheit, Feenfeuer',
      ],
      [
        'Spinnenklettern',
        'Der Drider kann an schwierigen Oberflächen klettern, auch kopfüber an Decken, ohne einen Attributswurf ablegen zu müssen.',
      ],
      [
        'Sonnenlichtempfindlichkeit',
        'Im Sonnenlicht ist der Drider bei Angriffswürfen sowie bei Weisheitswürfen (Wahrnehmung), die auf der Sicht beruhen, im Nachteil.',
      ],
      ['Netzläufer', 'Der Drider ignoriert Bewegungseinschränkungen durch Spinnweben.'],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Drider führt drei Angriffe aus, entweder mit seinem Langschwert oder mit seinem Langbogen. Er kann einen dieser Angriffe durch einen Bissangriff ersetzen.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 1,5 m, eine Kreatur. Treffer: 2 (1W4) Stichschaden plus 9 (2W8) Giftschaden.',
      ],
      [
        'Langschwert',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 7 (1W8 + 3) Hiebschaden, oder 8 (1W10 + 3) Hiebschaden, wenn mit zwei Händen geführt.',
      ],
      [
        'Langbogen',
        'Fernkampf-Waffenangriff: +6 auf Treffer, Reichweite 45/180 m, ein Ziel. Treffer: 7 (1W8 + 3) Stichschaden plus 4 (1W8) Giftschaden.',
      ],
    ],
  },
  'fire-giant': {
    actions: [
      ['Mehrfachangriff', 'Der Riese führt zwei Zweihandschwertangriffe aus.'],
      [
        'Zweihandschwert',
        'Nahkampf-Waffenangriff: +11 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 28 (6W6 + 7) Hiebschaden.',
      ],
      [
        'Fels',
        'Fernkampf-Waffenangriff: +11 auf Treffer, Reichweite 18/72 m, ein Ziel. Treffer: 29 (4W10 + 7) Wuchtschaden.',
      ],
    ],
  },
  'frost-giant': {
    actions: [
      ['Mehrfachangriff', 'Der Riese führt zwei Zweihandaxtangriffe aus.'],
      [
        'Zweihandaxt',
        'Nahkampf-Waffenangriff: +9 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 25 (3W12 + 6) Hiebschaden.',
      ],
      [
        'Fels',
        'Fernkampf-Waffenangriff: +9 auf Treffer, Reichweite 18/72 m, ein Ziel. Treffer: 28 (4W10 + 6) Wuchtschaden.',
      ],
    ],
  },
  'giant-ape': {
    actions: [
      ['Mehrfachangriff', 'Der Affe führt zwei Faustangriffe aus.'],
      [
        'Faust',
        'Nahkampf-Waffenangriff: +9 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 22 (3W10 + 6) Wuchtschaden.',
      ],
      [
        'Fels',
        'Fernkampf-Waffenangriff: +9 auf Treffer, Reichweite 15/30 m, ein Ziel. Treffer: 30 (7W6 + 6) Wuchtschaden.',
      ],
    ],
  },
  glabrezu: {
    traits: [
      [
        'Angeborenes Zauberwirken',
        'Das Attribut des Glabrezus zum Zauberwirken ist Intelligenz (Zauberrettungswurf-SG 16). Der Glabrezu kann die folgenden Zauber angeboren wirken, ohne Materialkomponenten zu benötigen:\nBeliebig oft: Dunkelheit, Magie entdecken, Magie bannen\nJe 1-mal täglich: Verwirrung, Fliegen, Machtwort: Betäubung',
      ],
      [
        'Magieresistenz',
        'Der Glabrezu ist bei Rettungswürfen gegen Zauber und andere magische Effekte im Vorteil.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Glabrezu führt vier Angriffe aus: zwei mit seinen Scheren und zwei mit seinen Fäusten. Alternativ führt er zwei Angriffe mit seinen Scheren aus und wirkt einen Zauber.',
      ],
      [
        'Schere',
        'Nahkampf-Waffenangriff: +9 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 16 (2W10 + 5) Wuchtschaden. Ist das Ziel eine mittelgroße oder kleinere Kreatur, wird es gepackt (Entkommen-SG 15). Der Glabrezu hat zwei Scheren, von denen jede nur ein Ziel packen kann.',
      ],
      [
        'Faust',
        'Nahkampf-Waffenangriff: +9 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 7 (2W4 + 2) Wuchtschaden.',
      ],
    ],
  },
  hezrou: {
    traits: [
      [
        'Magieresistenz',
        'Der Hezrou ist bei Rettungswürfen gegen Zauber und andere magische Effekte im Vorteil.',
      ],
      [
        'Gestank',
        'Jede Kreatur, die ihren Zug im Umkreis von 3 m um den Hezrou beginnt, muss einen Konstitutionsrettungswurf mit SG 14 bestehen, sonst ist sie bis zum Beginn ihres nächsten Zuges vergiftet. Bei einem erfolgreichen Rettungswurf ist die Kreatur 24 Stunden lang immun gegen den Gestank des Hezrous.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Hezrou führt drei Angriffe aus: einen mit seinem Biss und zwei mit seinen Klauen.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 15 (2W10 + 4) Stichschaden.',
      ],
      [
        'Klauen',
        'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 11 (2W6 + 4) Hiebschaden.',
      ],
    ],
  },
  hydra: {
    traits: [
      ['Atem anhalten', 'Die Hydra kann 1 Stunde lang den Atem anhalten.'],
      [
        'Mehrere Köpfe',
        'Die Hydra hat fünf Köpfe. Solange sie mehr als einen Kopf hat, ist die Hydra bei Rettungswürfen gegen Blindheit, Bezauberung, Taubheit, Furcht, Betäubung und Bewusstlosigkeit im Vorteil.\nWann immer die Hydra in einem einzigen Zug 25 oder mehr Schaden erleidet, stirbt einer ihrer Köpfe. Sterben alle ihre Köpfe, stirbt die Hydra.\nAm Ende ihres Zuges wachsen ihr für jeden seit ihrem letzten Zug gestorbenen Kopf zwei neue, es sei denn, sie hat seit ihrem letzten Zug Feuerschaden erlitten. Die Hydra erhält für jeden auf diese Weise nachgewachsenen Kopf 10 Trefferpunkte zurück.',
      ],
      [
        'Reaktionsschnelle Köpfe',
        'Für jeden Kopf über den ersten hinaus erhält die Hydra eine zusätzliche Reaktion, die nur für Gelegenheitsangriffe genutzt werden kann.',
      ],
      ['Wachsam', 'Solange die Hydra schläft, ist mindestens einer ihrer Köpfe wach.'],
    ],
    actions: [
      ['Mehrfachangriff', 'Die Hydra führt so viele Bissangriffe aus, wie sie Köpfe hat.'],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +8 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 10 (1W10 + 5) Stichschaden.',
      ],
    ],
  },
  'invisible-stalker': {
    traits: [
      ['Unsichtbarkeit', 'Der Pirscher ist unsichtbar.'],
      [
        'Unfehlbarer Fährtenleser',
        'Der Pirscher erhält von seinem Beschwörer eine Beute zugewiesen. Der Pirscher kennt Richtung und Entfernung zu seiner Beute, solange sich beide auf derselben Existenzebene befinden. Der Pirscher kennt außerdem den Aufenthaltsort seines Beschwörers.',
      ],
    ],
    actions: [
      ['Mehrfachangriff', 'Der Pirscher führt zwei Hiebangriffe aus.'],
      [
        'Hieb',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 10 (2W6 + 3) Wuchtschaden.',
      ],
    ],
  },
  mage: {
    traits: [
      [
        'Zauberwirken',
        'Der Magier ist ein Zauberwirker der 9. Stufe. Sein Attribut zum Zauberwirken ist Intelligenz (Zauberrettungswurf-SG 14, +6 auf Treffer mit Zauberangriffen). Der Magier hat folgende Magierzauber vorbereitet:\n\n- Zaubertricks (beliebig oft): Feuerpfeil, Licht, Magierhand, Taschenspielerei\n- 1. Grad (4 Plätze): Magie entdecken, Magierrüstung, Magisches Geschoss, Schild\n- 2. Grad (3 Plätze): Nebelschritt, Suggestion\n- 3. Grad (3 Plätze): Gegenzauber, Feuerball, Fliegen\n- 4. Grad (3 Plätze): Mächtige Unsichtbarkeit, Eissturm\n- 5. Grad (1 Platz): Kältekegel',
      ],
    ],
    actions: [
      [
        'Dolch',
        'Nah- oder Fernkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m oder Reichweite 6/18 m, ein Ziel. Treffer: 4 (1W4 + 2) Stichschaden.',
      ],
    ],
  },
  mammoth: {
    traits: [
      [
        'Niedertrampeln',
        'Bewegt sich das Mammut mindestens 6 m geradlinig auf eine Kreatur zu und trifft sie dann im selben Zug mit einem Aufspießangriff, muss das Ziel einen Stärkerettungswurf mit SG 18 bestehen, sonst wird es zu Boden geworfen. Liegt das Ziel am Boden, kann das Mammut als Bonusaktion einen Stampfangriff gegen es ausführen.',
      ],
    ],
    actions: [
      [
        'Aufspießen',
        'Nahkampf-Waffenangriff: +10 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 25 (4W8 + 7) Stichschaden.',
      ],
      [
        'Stampfen',
        'Nahkampf-Waffenangriff: +10 auf Treffer, Reichweite 1,5 m, eine liegende Kreatur. Treffer: 29 (4W10 + 7) Wuchtschaden.',
      ],
    ],
  },
  medusa: {
    traits: [
      [
        'Versteinernder Blick',
        'Beginnt eine Kreatur, welche die Augen der Medusa sehen kann, ihren Zug im Umkreis von 9 m um die Medusa, kann die Medusa sie zwingen, einen Konstitutionsrettungswurf mit SG 14 abzulegen, sofern die Medusa nicht kampfunfähig ist und die Kreatur sehen kann. Misslingt der Rettungswurf um 5 oder mehr, ist die Kreatur sofort versteinert. Ansonsten beginnt eine Kreatur, deren Rettungswurf misslingt, zu Stein zu werden und ist festgesetzt. Die festgesetzte Kreatur muss den Rettungswurf am Ende ihres nächsten Zuges wiederholen; bei einem Misserfolg wird sie versteinert, bei einem Erfolg endet die Wirkung. Die Versteinerung hält an, bis die Kreatur durch den Zauber Vollständige Genesung oder andere Magie befreit wird.\nSofern sie nicht überrascht ist, kann eine Kreatur zu Beginn ihres Zuges die Augen abwenden, um dem Rettungswurf zu entgehen. Tut sie das, kann sie die Medusa bis zum Beginn ihres nächsten Zuges nicht sehen und dann erneut die Augen abwenden. Sieht die Kreatur die Medusa in der Zwischenzeit an, muss sie sofort den Rettungswurf ablegen.\nSieht die Medusa sich selbst in einer polierten Oberfläche im Umkreis von 9 m und in einem Bereich hellen Lichts gespiegelt, ist die Medusa aufgrund ihres Fluchs von ihrem eigenen Blick betroffen.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Die Medusa führt entweder drei Nahkampfangriffe aus – einen mit ihrem Schlangenhaar und zwei mit ihrem Kurzschwert – oder zwei Fernkampfangriffe mit ihrem Langbogen.',
      ],
      [
        'Schlangenhaar',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, eine Kreatur. Treffer: 4 (1W4 + 2) Stichschaden plus 14 (4W6) Giftschaden.',
      ],
      [
        'Kurzschwert',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 5 (1W6 + 2) Stichschaden.',
      ],
      [
        'Langbogen',
        'Fernkampf-Waffenangriff: +5 auf Treffer, Reichweite 45/180 m, ein Ziel. Treffer: 6 (1W8 + 2) Stichschaden plus 7 (2W6) Giftschaden.',
      ],
    ],
  },
  oni: {
    traits: [
      [
        'Angeborenes Zauberwirken',
        'Das Attribut des Onis zum angeborenen Zauberwirken ist Charisma (Zauberrettungswurf-SG 13). Der Oni kann die folgenden Zauber angeboren wirken, ohne Materialkomponenten zu benötigen:\nBeliebig oft: Dunkelheit, Unsichtbarkeit\nJe 1-mal täglich: Person bezaubern, Kältekegel, Gasförmige Gestalt, Schlaf',
      ],
      ['Magische Waffen', 'Die Waffenangriffe des Onis sind magisch.'],
      [
        'Regeneration',
        'Der Oni erhält zu Beginn seines Zuges 10 Trefferpunkte zurück, sofern er mindestens 1 Trefferpunkt hat.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Oni führt zwei Angriffe aus, entweder mit seinen Klauen oder mit seiner Glefe.',
      ],
      [
        'Klaue (nur Onigestalt)',
        'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 8 (1W8 + 4) Hiebschaden.',
      ],
      [
        'Glefe',
        'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 15 (2W10 + 4) Hiebschaden, oder 9 (1W10 + 4) Hiebschaden in kleiner oder mittelgroßer Gestalt.',
      ],
      [
        'Gestalt wandeln',
        'Der Oni verwandelt sich magisch in einen kleinen oder mittelgroßen Humanoiden, in einen großen Riesen oder zurück in seine wahre Gestalt. Bis auf die Größe sind seine Spielwerte in jeder Gestalt gleich. Der einzige Ausrüstungsgegenstand, der verwandelt wird, ist seine Glefe, die so schrumpft, dass sie in humanoider Gestalt geführt werden kann. Stirbt der Oni, nimmt er wieder seine wahre Gestalt an, und seine Glefe erhält ihre normale Größe zurück.',
      ],
    ],
  },
  'shield-guardian': {
    traits: [
      [
        'Gebunden',
        'Der Wächter ist magisch an ein Amulett gebunden. Solange sich der Wächter und sein Amulett auf derselben Existenzebene befinden, kann der Träger des Amuletts den Wächter telepathisch zu sich rufen, und der Wächter kennt Entfernung und Richtung zum Amulett. Befindet sich der Wächter im Umkreis von 18 m um den Träger des Amuletts, wird die Hälfte jedes Schadens, den der Träger erleidet (aufgerundet), auf den Wächter übertragen.',
      ],
      [
        'Regeneration',
        'Der Wächter erhält zu Beginn seines Zuges 10 Trefferpunkte zurück, sofern er mindestens 1 Trefferpunkt hat.',
      ],
      [
        'Zauberspeicher',
        'Ein Zauberwirker, der das Amulett des Wächters trägt, kann den Wächter einen Zauber des 4. Grades oder niedriger speichern lassen. Dazu muss der Träger den Zauber auf den Wächter wirken. Der Zauber zeigt keine Wirkung, wird aber in dem Wächter gespeichert. Befiehlt der Träger es oder tritt eine vom Zauberwirker festgelegte Situation ein, wirkt der Wächter den gespeicherten Zauber mit allen Parametern, die der ursprüngliche Zaubernde festgelegt hat, ohne Komponenten zu benötigen. Wird der Zauber gewirkt oder ein neuer Zauber gespeichert, geht jeder zuvor gespeicherte Zauber verloren.',
      ],
    ],
    actions: [
      ['Mehrfachangriff', 'Der Wächter führt zwei Faustangriffe aus.'],
      [
        'Faust',
        'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 11 (2W6 + 4) Wuchtschaden.',
      ],
    ],
    reactions: [
      [
        'Schild',
        'Führt eine Kreatur einen Angriff gegen den Träger des Amuletts des Wächters aus, gewährt der Wächter dem Träger einen Bonus von +2 auf die RK, sofern der Wächter sich im Umkreis von 1,5 m um den Träger befindet.',
      ],
    ],
  },
  'spirit-naga': {
    traits: [
      [
        'Erneuerung',
        'Stirbt die Naga, kehrt sie nach 1W6 Tagen ins Leben zurück und erhält alle ihre Trefferpunkte zurück. Nur der Zauber Wunsch kann verhindern, dass dieses Merkmal wirkt.',
      ],
      [
        'Zauberwirken',
        'Die Naga ist eine Zauberwirkerin der 10. Stufe. Ihr Attribut zum Zauberwirken ist Intelligenz (Zauberrettungswurf-SG 14, +6 auf Treffer mit Zauberangriffen), und sie benötigt nur verbale Komponenten, um ihre Zauber zu wirken. Sie hat folgende Magierzauber vorbereitet:\n\n- Zaubertricks (beliebig oft): Magierhand, Kleine Illusion, Froststrahl\n- 1. Grad (4 Plätze): Person bezaubern, Magie entdecken, Schlaf\n- 2. Grad (3 Plätze): Gedanken wahrnehmen, Person festhalten\n- 3. Grad (3 Plätze): Blitz, Wasser atmen\n- 4. Grad (3 Plätze): Pesthauch, Dimensionstür\n- 5. Grad (2 Plätze): Person beherrschen',
      ],
    ],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 3 m, eine Kreatur. Treffer: 7 (1W6 + 4) Stichschaden, und das Ziel muss einen Konstitutionsrettungswurf mit SG 13 ablegen. Bei einem Misserfolg erleidet es 31 (7W8) Giftschaden, bei einem Erfolg die Hälfte.',
      ],
    ],
  },
  'stone-giant': {
    traits: [
      [
        'Steintarnung',
        'Der Riese ist bei Geschicklichkeitswürfen (Heimlichkeit), um sich in felsigem Gelände zu verstecken, im Vorteil.',
      ],
    ],
    actions: [
      ['Mehrfachangriff', 'Der Riese führt zwei Zweihandknüppelangriffe aus.'],
      [
        'Zweihandknüppel',
        'Nahkampf-Waffenangriff: +9 auf Treffer, Reichweite 4,5 m, ein Ziel. Treffer: 19 (3W8 + 6) Wuchtschaden.',
      ],
      [
        'Fels',
        'Fernkampf-Waffenangriff: +9 auf Treffer, Reichweite 18/72 m, ein Ziel. Treffer: 28 (4W10 + 6) Wuchtschaden. Ist das Ziel eine Kreatur, muss es einen Stärkerettungswurf mit SG 17 bestehen, sonst wird es zu Boden geworfen.',
      ],
    ],
    reactions: [
      [
        'Felsen fangen',
        'Wird ein Fels oder ein ähnlicher Gegenstand auf den Riesen geschleudert, kann der Riese das Geschoss mit einem erfolgreichen Geschicklichkeitsrettungswurf mit SG 10 fangen und erleidet keinen Wuchtschaden dadurch.',
      ],
    ],
  },
  treant: {
    traits: [
      [
        'Falsches Erscheinungsbild',
        'Solange der Baumhirte sich nicht bewegt, ist er nicht von einem gewöhnlichen Baum zu unterscheiden.',
      ],
      [
        'Belagerungsmonster',
        'Der Baumhirte verursacht an Gegenständen und Bauwerken doppelten Schaden.',
      ],
    ],
    actions: [
      ['Mehrfachangriff', 'Der Baumhirte führt zwei Hiebangriffe aus.'],
      [
        'Hieb',
        'Nahkampf-Waffenangriff: +10 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 16 (3W6 + 6) Wuchtschaden.',
      ],
      [
        'Fels',
        'Fernkampf-Waffenangriff: +10 auf Treffer, Reichweite 18/54 m, ein Ziel. Treffer: 28 (4W10 + 6) Wuchtschaden.',
      ],
      [
        'Bäume beleben (1-mal täglich)',
        'Der Baumhirte belebt magisch einen oder zwei Bäume, die er im Umkreis von 18 m sehen kann. Diese Bäume haben dieselben Spielwerte wie ein Baumhirte, außer dass ihre Intelligenz- und Charismawerte 1 betragen, sie nicht sprechen können und nur die Aktionsoption Hieb haben. Ein belebter Baum handelt als Verbündeter des Baumhirten. Der Baum bleibt 1 Tag lang belebt oder bis er stirbt, bis der Baumhirte stirbt oder mehr als 36 m von dem Baum entfernt ist oder bis der Baumhirte eine Bonusaktion nutzt, um ihn wieder in einen unbelebten Baum zu verwandeln. Der Baum schlägt dann nach Möglichkeit Wurzeln.',
      ],
    ],
  },
  'tyrannosaurus-rex': {
    actions: [
      [
        'Mehrfachangriff',
        'Der Tyrannosaurus führt zwei Angriffe aus: einen mit seinem Biss und einen mit seinem Schwanz. Er kann nicht beide Angriffe gegen dasselbe Ziel ausführen.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +10 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 33 (4W12 + 7) Stichschaden. Ist das Ziel eine mittelgroße oder kleinere Kreatur, wird es gepackt (Entkommen-SG 17). Bis der Griff endet, ist das Ziel festgesetzt, und der Tyrannosaurus kann kein anderes Ziel beißen.',
      ],
      [
        'Schwanz',
        'Nahkampf-Waffenangriff: +10 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 20 (3W8 + 7) Wuchtschaden.',
      ],
    ],
  },
  vrock: {
    traits: [
      [
        'Magieresistenz',
        'Der Vrock ist bei Rettungswürfen gegen Zauber und andere magische Effekte im Vorteil.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Vrock führt zwei Angriffe aus: einen mit seinem Schnabel und einen mit seinen Krallen.',
      ],
      [
        'Schnabel',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 10 (2W6 + 3) Stichschaden.',
      ],
      [
        'Krallen',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 14 (2W10 + 3) Hiebschaden.',
      ],
      [
        'Sporen (Aufladung 6)',
        'Eine Wolke giftiger Sporen breitet sich in einem Radius von 4,5 m um den Vrock aus. Die Sporen reichen um Ecken. Jede Kreatur in diesem Bereich muss einen Konstitutionsrettungswurf mit SG 14 bestehen, sonst ist sie vergiftet. Solange es auf diese Weise vergiftet ist, erleidet ein Ziel zu Beginn jedes seiner Züge 5 (1W10) Giftschaden. Ein Ziel kann den Rettungswurf am Ende jedes seiner Züge wiederholen und beendet die Wirkung bei einem Erfolg für sich. Eine Phiole Weihwasser, über dem Ziel ausgeleert, beendet die Wirkung für es ebenfalls.',
      ],
      [
        'Betäubendes Kreischen (1-mal täglich)',
        'Der Vrock stößt ein grauenhaftes Kreischen aus. Jede Kreatur im Umkreis von 6 m um ihn, die es hören kann und kein Dämon ist, muss einen Konstitutionsrettungswurf mit SG 14 bestehen, sonst ist sie bis zum Ende des nächsten Zuges des Vrocks betäubt.',
      ],
    ],
  },
  wyvern: {
    actions: [
      [
        'Mehrfachangriff',
        'Der Wyvern führt zwei Angriffe aus: einen mit seinem Biss und einen mit seinem Giftstachel. Im Flug kann er anstelle eines anderen Angriffs seine Klauen einsetzen.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 3 m, eine Kreatur. Treffer: 11 (2W6 + 4) Stichschaden.',
      ],
      [
        'Klauen',
        'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 13 (2W8 + 4) Hiebschaden.',
      ],
      [
        'Giftstachel',
        'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 3 m, eine Kreatur. Treffer: 11 (2W6 + 4) Stichschaden. Das Ziel muss einen Konstitutionsrettungswurf mit SG 15 ablegen. Bei einem Misserfolg erleidet es 24 (7W6) Giftschaden, bei einem Erfolg die Hälfte.',
      ],
    ],
  },
  'young-black-dragon': {
    traits: [['Amphibisch', 'Der Drache kann Luft und Wasser atmen.']],
    actions: [
      [
        'Mehrfachangriff',
        'Der Drache führt drei Angriffe aus: einen mit seinem Biss und zwei mit seinen Klauen.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 15 (2W10 + 4) Stichschaden plus 4 (1W8) Säureschaden.',
      ],
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 11 (2W6 + 4) Hiebschaden.',
      ],
      [
        'Säureodem (Aufladung 5–6)',
        'Der Drache atmet Säure in einer 9-m-Linie aus, die 1,5 m breit ist. Jede Kreatur in dieser Linie muss einen Geschicklichkeitsrettungswurf mit SG 14 ablegen. Bei einem Misserfolg erleidet sie 49 (11W8) Säureschaden, bei einem Erfolg die Hälfte.',
      ],
    ],
  },
  'young-blue-dragon': {
    actions: [
      [
        'Mehrfachangriff',
        'Der Drache führt drei Angriffe aus: einen mit seinem Biss und zwei mit seinen Klauen.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +9 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 16 (2W10 + 5) Stichschaden plus 5 (1W10) Blitzschaden.',
      ],
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +9 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 12 (2W6 + 5) Hiebschaden.',
      ],
      [
        'Blitzodem (Aufladung 5–6)',
        'Der Drache atmet Blitze in einer 18-m-Linie aus, die 1,5 m breit ist. Jede Kreatur in dieser Linie muss einen Geschicklichkeitsrettungswurf mit SG 16 ablegen. Bei einem Misserfolg erleidet sie 55 (10W10) Blitzschaden, bei einem Erfolg die Hälfte.',
      ],
    ],
  },
  'young-brass-dragon': {
    actions: [
      [
        'Mehrfachangriff',
        'Der Drache führt drei Angriffe aus: einen mit seinem Biss und zwei mit seinen Klauen.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 15 (2W10 + 4) Stichschaden.',
      ],
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 11 (2W6 + 4) Hiebschaden.',
      ],
      [
        'Odemwaffen (Aufladung 5–6)',
        'Der Drache setzt eine der folgenden Odemwaffen ein.\nFeuerodem. Der Drache atmet Feuer in einer 12-m-Linie aus, die 1,5 m breit ist. Jede Kreatur in dieser Linie muss einen Geschicklichkeitsrettungswurf mit SG 14 ablegen. Bei einem Misserfolg erleidet sie 42 (12W6) Feuerschaden, bei einem Erfolg die Hälfte.\nSchlafodem. Der Drache atmet Schlafgas in einem 9-m-Kegel aus. Jede Kreatur in diesem Bereich muss einen Konstitutionsrettungswurf mit SG 14 bestehen, sonst wird sie für 5 Minuten bewusstlos. Die Wirkung endet für eine Kreatur, wenn sie Schaden erleidet oder jemand eine Aktion nutzt, um sie zu wecken.',
      ],
    ],
  },
  'young-bronze-dragon': {
    traits: [['Amphibisch', 'Der Drache kann Luft und Wasser atmen.']],
    actions: [
      [
        'Mehrfachangriff',
        'Der Drache führt drei Angriffe aus: einen mit seinem Biss und zwei mit seinen Klauen.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +8 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 16 (2W10 + 5) Stichschaden.',
      ],
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +8 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 12 (2W6 + 5) Hiebschaden.',
      ],
      [
        'Odemwaffen (Aufladung 5–6)',
        'Der Drache setzt eine der folgenden Odemwaffen ein.\nBlitzodem. Der Drache atmet Blitze in einer 18-m-Linie aus, die 1,5 m breit ist. Jede Kreatur in dieser Linie muss einen Geschicklichkeitsrettungswurf mit SG 15 ablegen. Bei einem Misserfolg erleidet sie 55 (10W10) Blitzschaden, bei einem Erfolg die Hälfte.\nAbstoßungsodem. Der Drache atmet abstoßende Energie in einem 9-m-Kegel aus. Jede Kreatur in diesem Bereich muss einen Stärkerettungswurf mit SG 15 ablegen. Bei einem Misserfolg wird die Kreatur 12 m von dem Drachen weggestoßen.',
      ],
    ],
  },
  'young-copper-dragon': {
    actions: [
      [
        'Mehrfachangriff',
        'Der Drache führt drei Angriffe aus: einen mit seinem Biss und zwei mit seinen Klauen.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 15 (2W10 + 4) Stichschaden.',
      ],
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 11 (2W6 + 4) Hiebschaden.',
      ],
      [
        'Odemwaffen (Aufladung 5–6)',
        'Der Drache setzt eine der folgenden Odemwaffen ein.\nSäureodem. Der Drache atmet Säure in einer 12-m-Linie aus, die 1,5 m breit ist. Jede Kreatur in dieser Linie muss einen Geschicklichkeitsrettungswurf mit SG 14 ablegen. Bei einem Misserfolg erleidet sie 40 (9W8) Säureschaden, bei einem Erfolg die Hälfte.\nVerlangsamender Odem. Der Drache atmet Gas in einem 9-m-Kegel aus. Jede Kreatur in diesem Bereich muss einen Konstitutionsrettungswurf mit SG 14 ablegen. Bei einem Misserfolg kann die Kreatur keine Reaktionen ausführen, ihre Bewegungsrate ist halbiert, und sie kann in ihrem Zug nicht mehr als einen Angriff ausführen. Außerdem kann die Kreatur in ihrem Zug entweder eine Aktion oder eine Bonusaktion nutzen, aber nicht beides. Diese Wirkungen halten 1 Minute lang an. Die Kreatur kann den Rettungswurf am Ende jedes ihrer Züge wiederholen und beendet die Wirkungen bei einem Erfolg für sich.',
      ],
    ],
  },
  'young-green-dragon': {
    traits: [['Amphibisch', 'Der Drache kann Luft und Wasser atmen.']],
    actions: [
      [
        'Mehrfachangriff',
        'Der Drache führt drei Angriffe aus: einen mit seinem Biss und zwei mit seinen Klauen.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 15 (2W10 + 4) Stichschaden plus 7 (2W6) Giftschaden.',
      ],
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 11 (2W6 + 4) Hiebschaden.',
      ],
      [
        'Giftodem (Aufladung 5–6)',
        'Der Drache atmet giftiges Gas in einem 9-m-Kegel aus. Jede Kreatur in diesem Bereich muss einen Konstitutionsrettungswurf mit SG 14 ablegen. Bei einem Misserfolg erleidet sie 42 (12W6) Giftschaden, bei einem Erfolg die Hälfte.',
      ],
    ],
  },
  'young-silver-dragon': {
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
        'Der Drache setzt eine der folgenden Odemwaffen ein.\nKälteodem. Der Drache atmet einen eisigen Stoß in einem 9-m-Kegel aus. Jede Kreatur in diesem Bereich muss einen Konstitutionsrettungswurf mit SG 17 ablegen. Bei einem Misserfolg erleidet sie 54 (12W8) Kälteschaden, bei einem Erfolg die Hälfte.\nLähmender Odem. Der Drache atmet lähmendes Gas in einem 9-m-Kegel aus. Jede Kreatur in diesem Bereich muss einen Konstitutionsrettungswurf mit SG 17 bestehen, sonst ist sie 1 Minute lang gelähmt. Eine Kreatur kann den Rettungswurf am Ende jedes ihrer Züge wiederholen und beendet die Wirkung bei einem Erfolg für sich.',
      ],
    ],
  },
  'young-white-dragon': {
    traits: [
      [
        'Eisgang',
        'Der Drache kann sich über eisige Oberflächen bewegen und an ihnen klettern, ohne einen Attributswurf ablegen zu müssen. Außerdem kostet ihn schwieriges Gelände aus Eis oder Schnee keine zusätzliche Bewegung.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Drache führt drei Angriffe aus: einen mit seinem Biss und zwei mit seinen Klauen.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 15 (2W10 + 4) Stichschaden plus 4 (1W8) Kälteschaden.',
      ],
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 11 (2W6 + 4) Hiebschaden.',
      ],
      [
        'Kälteodem (Aufladung 5–6)',
        'Der Drache atmet einen eisigen Stoß in einem 9-m-Kegel aus. Jede Kreatur in diesem Bereich muss einen Konstitutionsrettungswurf mit SG 15 ablegen. Bei einem Misserfolg erleidet sie 45 (10W8) Kälteschaden, bei einem Erfolg die Hälfte.',
      ],
    ],
  },
};
