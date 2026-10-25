// German texts of the SRD monsters of challenge ratings 3 and 4: traits, actions, reactions and legendary
// actions. Our own translation of the SRD 5.1, CC-BY-4.0 (see NOTICE.md).

import type { DeMonsterText } from '../model';

export const DE_TEXTS_CR3: Readonly<Record<string, DeMonsterText>> = {
  basilisk: {
    traits: [
      [
        'Versteinernder Blick',
        'Beginnt eine Kreatur ihren Zug im Umkreis von 9 m um den Basilisken und können sich beide sehen, kann der Basilisk die Kreatur zwingen, einen Konstitutionsrettungswurf mit SG 12 abzulegen, sofern der Basilisk nicht kampfunfähig ist. Bei einem Misserfolg beginnt die Kreatur magisch zu Stein zu werden und ist festgesetzt. Sie muss den Rettungswurf am Ende ihres nächsten Zuges wiederholen. Bei einem Erfolg endet die Wirkung. Bei einem Misserfolg ist die Kreatur versteinert, bis sie durch den Zauber Vollständige Genesung oder andere Magie befreit wird.\nEine Kreatur, die nicht überrascht ist, kann zu Beginn ihres Zuges die Augen abwenden, um dem Rettungswurf zu entgehen. Tut sie das, kann sie den Basilisken bis zum Beginn ihres nächsten Zuges nicht sehen und dann erneut die Augen abwenden. Sieht sie den Basilisken in der Zwischenzeit an, muss sie sofort den Rettungswurf ablegen.\nSieht der Basilisk sein Spiegelbild im Umkreis von 9 m in hellem Licht, hält er sich für einen Rivalen und richtet seinen Blick auf sich selbst.',
      ],
    ],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 10 (2W6 + 3) Stichschaden plus 7 (2W6) Giftschaden.',
      ],
    ],
  },
  'bearded-devil': {
    traits: [
      ['Teufelssicht', 'Magische Dunkelheit behindert die Dunkelsicht des Teufels nicht.'],
      [
        'Magieresistenz',
        'Der Teufel ist bei Rettungswürfen gegen Zauber und andere magische Effekte im Vorteil.',
      ],
      [
        'Standhaft',
        'Der Teufel kann nicht verängstigt werden, solange er eine verbündete Kreatur im Umkreis von 9 m sehen kann.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Teufel führt zwei Angriffe aus: einen mit seinem Bart und einen mit seiner Glefe.',
      ],
      [
        'Bart',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, eine Kreatur. Treffer: 6 (1W8 + 2) Stichschaden, und das Ziel muss einen Konstitutionsrettungswurf mit SG 12 bestehen, sonst ist es 1 Minute lang vergiftet. Solange es auf diese Weise vergiftet ist, kann das Ziel keine Trefferpunkte zurückerhalten. Das Ziel kann den Rettungswurf am Ende jedes seiner Züge wiederholen und beendet die Wirkung bei einem Erfolg für sich.',
      ],
      [
        'Glefe',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 8 (1W10 + 3) Hiebschaden. Ist das Ziel eine Kreatur, die weder untot noch ein Konstrukt ist, muss es einen Konstitutionsrettungswurf mit SG 12 bestehen, sonst verliert es durch eine höllische Wunde zu Beginn jedes seiner Züge 5 (1W10) Trefferpunkte. Jedes Mal, wenn der Teufel das verwundete Ziel mit diesem Angriff trifft, steigt der Schaden durch die Wunde um 5 (1W10). Jede Kreatur kann eine Aktion nutzen, um die Wunde mit einem erfolgreichen Weisheitswurf (Heilkunde) gegen SG 12 zu stillen. Die Wunde schließt sich auch, wenn das Ziel magische Heilung erhält.',
      ],
    ],
  },
  'black-pudding': {
    traits: [
      [
        'Amorph',
        'Der Pudding kann sich durch einen Bereich bewegen, der nur 2,5 cm breit ist, ohne sich zwängen zu müssen.',
      ],
      [
        'Ätzende Gestalt',
        'Eine Kreatur, die den Pudding berührt oder ihn mit einem Nahkampfangriff trifft, während sie sich im Umkreis von 1,5 m um ihn befindet, erleidet 4 (1W8) Säureschaden. Jede nichtmagische Waffe aus Metall oder Holz, die den Pudding trifft, wird zersetzt. Nachdem sie Schaden verursacht hat, erhält die Waffe einen dauerhaften, kumulativen Malus von −1 auf Schadenswürfe. Sinkt ihr Malus auf −5, ist die Waffe zerstört. Nichtmagische Munition aus Metall oder Holz, die den Pudding trifft, wird zerstört, nachdem sie Schaden verursacht hat. Der Pudding kann sich in 1 Runde durch 5 cm dickes nichtmagisches Holz oder Metall fressen.',
      ],
      [
        'Spinnenklettern',
        'Der Pudding kann an schwierigen Oberflächen klettern, auch kopfüber an Decken, ohne einen Attributswurf ablegen zu müssen.',
      ],
    ],
    actions: [
      [
        'Pseudopodium',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 6 (1W6 + 3) Wuchtschaden plus 18 (4W8) Säureschaden. Außerdem wird nichtmagische Rüstung, die das Ziel trägt, teilweise aufgelöst und erhält einen dauerhaften, kumulativen Malus von −1 auf die RK, die sie gewährt. Die Rüstung ist zerstört, wenn der Malus ihre RK auf 10 senkt.',
      ],
    ],
    reactions: [
      [
        'Teilen',
        'Erleidet ein mittelgroßer oder größerer Pudding Blitz- oder Hiebschaden, teilt er sich in zwei neue Puddings, sofern er mindestens 10 Trefferpunkte hat. Jeder neue Pudding hat Trefferpunkte in Höhe der Hälfte der Trefferpunkte des ursprünglichen Puddings, abgerundet. Neue Puddings sind eine Größenkategorie kleiner als der ursprüngliche Pudding.',
      ],
    ],
  },
  'blue-dragon-wyrmling': {
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 8 (1W10 + 3) Stichschaden plus 3 (1W6) Blitzschaden.',
      ],
      [
        'Blitzodem (Aufladung 5–6)',
        'Der Drache atmet Blitze in einer 9-m-Linie aus, die 1,5 m breit ist. Jede Kreatur in dieser Linie muss einen Geschicklichkeitsrettungswurf mit SG 12 ablegen. Bei einem Misserfolg erleidet sie 22 (4W10) Blitzschaden, bei einem Erfolg die Hälfte.',
      ],
    ],
  },
  chuul: {
    traits: [
      ['Amphibisch', 'Der Chuul kann Luft und Wasser atmen.'],
      [
        'Magie spüren',
        'Der Chuul spürt nach Belieben Magie im Umkreis von 36 m. Dieses Merkmal wirkt ansonsten wie der Zauber Magie entdecken, ist selbst aber nicht magisch.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Chuul führt zwei Scherenangriffe aus. Hält der Chuul eine Kreatur gepackt, kann er außerdem einmal seine Tentakel einsetzen.',
      ],
      [
        'Schere',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 11 (2W6 + 4) Wuchtschaden. Das Ziel wird gepackt (Entkommen-SG 14), wenn es eine große oder kleinere Kreatur ist und der Chuul nicht bereits zwei andere Kreaturen gepackt hält.',
      ],
      [
        'Tentakel',
        'Eine von dem Chuul gepackte Kreatur muss einen Konstitutionsrettungswurf mit SG 13 bestehen, sonst ist sie 1 Minute lang vergiftet. Bis diese Vergiftung endet, ist das Ziel gelähmt. Das Ziel kann den Rettungswurf am Ende jedes seiner Züge wiederholen und beendet die Wirkung bei einem Erfolg für sich.',
      ],
    ],
  },
  couatl: {
    traits: [
      [
        'Angeborenes Zauberwirken',
        'Das Attribut des Couatls zum Zauberwirken ist Charisma (Zauberrettungswurf-SG 14). Er kann die folgenden Zauber angeboren wirken und benötigt dafür nur verbale Komponenten:\nBeliebig oft: Gutes und Böses entdecken, Magie entdecken, Gedanken wahrnehmen\nJe 3-mal täglich: Segnen, Speise und Trank erschaffen, Wunden heilen, Schwache Genesung, Schutz vor Gift, Heiligtum, Schild\nJe 1-mal täglich: Traum, Vollständige Genesung, Ausspähung',
      ],
      ['Magische Waffen', 'Die Waffenangriffe des Couatls sind magisch.'],
      [
        'Abgeschirmter Geist',
        'Der Couatl ist immun gegen Ausspähung und gegen jede Wirkung, die seine Gefühle erspüren, seine Gedanken lesen oder seinen Aufenthaltsort entdecken würde.',
      ],
    ],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +8 auf Treffer, Reichweite 1,5 m, eine Kreatur. Treffer: 8 (1W6 + 5) Stichschaden, und das Ziel muss einen Konstitutionsrettungswurf mit SG 13 bestehen, sonst ist es 24 Stunden lang vergiftet. Bis diese Vergiftung endet, ist das Ziel bewusstlos. Eine andere Kreatur kann eine Aktion nutzen, um das Ziel wachzurütteln.',
      ],
      [
        'Würgen',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 3 m, eine mittelgroße oder kleinere Kreatur. Treffer: 10 (2W6 + 3) Wuchtschaden, und das Ziel wird gepackt (Entkommen-SG 15). Bis der Griff endet, ist das Ziel festgesetzt, und der Couatl kann kein anderes Ziel würgen.',
      ],
      [
        'Gestalt wandeln',
        'Der Couatl verwandelt sich magisch in einen Humanoiden oder ein Tier mit einem Herausforderungsgrad, der höchstens so hoch ist wie sein eigener, oder zurück in seine wahre Gestalt. Stirbt er, nimmt er wieder seine wahre Gestalt an. Ausrüstung, die er trägt oder hält, wird von der neuen Gestalt aufgenommen oder getragen (nach Wahl des Couatls).\nIn einer neuen Gestalt behält der Couatl seine Spielwerte und seine Fähigkeit zu sprechen, doch seine RK, Bewegungsarten, Stärke, Geschicklichkeit und übrigen Aktionen werden durch die der neuen Gestalt ersetzt, und er erhält alle Spielwerte und Fähigkeiten (außer Klassenmerkmalen, legendären Aktionen und Hortaktionen), welche die neue Gestalt besitzt, ihm aber fehlen. Hat die neue Gestalt einen Bissangriff, kann der Couatl in dieser Gestalt seinen Biss einsetzen.',
      ],
    ],
  },
  doppelganger: {
    traits: [
      [
        'Gestaltwandler',
        'Der Doppelgänger kann seine Aktion nutzen, um sich in einen kleinen oder mittelgroßen Humanoiden zu verwandeln, den er gesehen hat, oder zurück in seine wahre Gestalt. Seine Spielwerte sind bis auf die Größe in jeder Gestalt gleich. Ausrüstung, die er trägt oder hält, wird nicht verwandelt. Stirbt er, nimmt er wieder seine wahre Gestalt an.',
      ],
      [
        'Lauerjäger',
        'In der ersten Kampfrunde ist der Doppelgänger bei Angriffswürfen gegen jede Kreatur im Vorteil, die er überrascht hat.',
      ],
      [
        'Überraschungsangriff',
        'Überrascht der Doppelgänger eine Kreatur und trifft sie in der ersten Kampfrunde mit einem Angriff, erleidet das Ziel durch den Angriff zusätzlich 10 (3W6) Schaden.',
      ],
    ],
    actions: [
      ['Mehrfachangriff', 'Der Doppelgänger führt zwei Nahkampfangriffe aus.'],
      [
        'Hieb',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 7 (1W6 + 4) Wuchtschaden.',
      ],
      [
        'Gedanken lesen',
        'Der Doppelgänger liest magisch die oberflächlichen Gedanken einer Kreatur im Umkreis von 18 m. Die Wirkung durchdringt Barrieren, wird aber von 0,9 m Holz oder Erde, 0,6 m Stein, 5 cm Metall oder einer dünnen Bleischicht blockiert. Solange das Ziel in Reichweite ist, kann der Doppelgänger weiter dessen Gedanken lesen, solange seine Konzentration nicht unterbrochen wird (als würde er sich auf einen Zauber konzentrieren). Während er die Gedanken des Ziels liest, ist der Doppelgänger bei Weisheitswürfen (Motiv erkennen) und Charismawürfen (Täuschen, Einschüchtern und Überzeugen) gegen das Ziel im Vorteil.',
      ],
    ],
  },
  elephant: {
    traits: [
      [
        'Niedertrampeln',
        'Bewegt sich der Elefant mindestens 6 m geradlinig auf eine Kreatur zu und trifft sie dann im selben Zug mit einem Aufspießangriff, muss das Ziel einen Stärkerettungswurf mit SG 12 bestehen, sonst wird es zu Boden geworfen. Liegt das Ziel am Boden, kann der Elefant als Bonusaktion einen Stampfangriff gegen es ausführen.',
      ],
    ],
    actions: [
      [
        'Aufspießen',
        'Nahkampf-Waffenangriff: +8 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 19 (3W8 + 6) Stichschaden.',
      ],
      [
        'Stampfen',
        'Nahkampf-Waffenangriff: +8 auf Treffer, Reichweite 1,5 m, eine liegende Kreatur. Treffer: 22 (3W10 + 6) Wuchtschaden.',
      ],
    ],
  },
  ettin: {
    traits: [
      [
        'Zwei Köpfe',
        'Der Ettin ist bei Weisheitswürfen (Wahrnehmung) und bei Rettungswürfen gegen Blindheit, Bezauberung, Taubheit, Furcht, Betäubung und Bewusstlosigkeit im Vorteil.',
      ],
      ['Wachsam', 'Schläft einer der Köpfe des Ettins, ist der andere Kopf wach.'],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Ettin führt zwei Angriffe aus: einen mit seiner Streitaxt und einen mit seinem Morgenstern.',
      ],
      [
        'Streitaxt',
        'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 14 (2W8 + 5) Hiebschaden.',
      ],
      [
        'Morgenstern',
        'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 14 (2W8 + 5) Stichschaden.',
      ],
    ],
  },
  ghost: {
    traits: [
      [
        'Ätherische Sicht',
        'Befindet sich der Geist auf der Materiellen Ebene, kann er 18 m weit in die Ätherebene sehen und umgekehrt.',
      ],
      [
        'Körperlose Bewegung',
        'Der Geist kann sich durch andere Kreaturen und Gegenstände bewegen, als wären sie schwieriges Gelände. Beendet er seinen Zug in einem Gegenstand, erleidet er 5 (1W10) Energieschaden.',
      ],
    ],
    actions: [
      [
        'Welkende Berührung',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 17 (4W6 + 3) nekrotischen Schaden.',
      ],
      [
        'Körperlosigkeit',
        'Der Geist betritt von der Materiellen Ebene aus die Ätherebene oder umgekehrt. Im Grenzäther ist er auf der Materiellen Ebene sichtbar und umgekehrt, kann aber nichts auf der anderen Ebene beeinflussen oder von dort beeinflusst werden.',
      ],
      [
        'Entsetzliches Antlitz',
        'Jede nicht untote Kreatur im Umkreis von 18 m um den Geist, die ihn sehen kann, muss einen Weisheitsrettungswurf mit SG 13 bestehen, sonst ist sie 1 Minute lang verängstigt. Misslingt der Rettungswurf um 5 oder mehr, altert das Ziel außerdem um 1W4 × 10 Jahre. Ein verängstigtes Ziel kann den Rettungswurf am Ende jedes seiner Züge wiederholen und beendet den Zustand Verängstigt bei einem Erfolg für sich. Ist der Rettungswurf eines Ziels erfolgreich oder endet die Wirkung für es, ist das Ziel für die nächsten 24 Stunden immun gegen das Entsetzliche Antlitz dieses Geistes. Die Alterung lässt sich mit dem Zauber Vollständige Genesung rückgängig machen, aber nur innerhalb von 24 Stunden, nachdem sie eingetreten ist.',
      ],
      [
        'Besessenheit (Aufladung 6)',
        'Ein Humanoider im Umkreis von 1,5 m, den der Geist sehen kann, muss einen Charismarettungswurf mit SG 13 bestehen, sonst wird er von dem Geist besessen; der Geist verschwindet dann, und das Ziel ist kampfunfähig und verliert die Kontrolle über seinen Körper. Der Geist kontrolliert nun den Körper, nimmt dem Ziel aber nicht das Bewusstsein. Der Geist kann nicht zum Ziel von Angriffen, Zaubern oder anderen Effekten werden, außer solchen, die Untote vertreiben, und behält seine Gesinnung, Intelligenz, Weisheit, Charisma sowie seine Immunität gegen Bezauberung und Furcht. Ansonsten nutzt er die Spielwerte des besessenen Ziels, erhält aber keinen Zugriff auf dessen Wissen, Klassenmerkmale oder Übungen.\nDie Besessenheit hält an, bis der Körper auf 0 Trefferpunkte sinkt, der Geist sie als Bonusaktion beendet oder der Geist vertrieben oder durch einen Effekt wie den Zauber Gutes und Böses bannen ausgetrieben wird. Endet die Besessenheit, erscheint der Geist wieder in einem freien Bereich im Umkreis von 1,5 m um den Körper. Das Ziel ist 24 Stunden lang immun gegen die Besessenheit durch diesen Geist, nachdem es den Rettungswurf bestanden hat oder die Besessenheit geendet hat.',
      ],
    ],
  },
  'giant-scorpion': {
    actions: [
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 6 (1W8 + 2) Wuchtschaden, und das Ziel wird gepackt (Entkommen-SG 12). Der Skorpion hat zwei Scheren, von denen jede nur ein Ziel packen kann.',
      ],
      [
        'Mehrfachangriff',
        'Der Skorpion führt drei Angriffe aus: zwei mit seinen Klauen und einen mit seinem Stachel.',
      ],
      [
        'Stachel',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, eine Kreatur. Treffer: 7 (1W10 + 2) Stichschaden, und das Ziel muss einen Konstitutionsrettungswurf mit SG 12 ablegen. Bei einem Misserfolg erleidet es 22 (4W10) Giftschaden, bei einem Erfolg die Hälfte.',
      ],
    ],
  },
  'gold-dragon-wyrmling': {
    traits: [['Amphibisch', 'Der Drache kann Luft und Wasser atmen.']],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 9 (1W10 + 4) Stichschaden.',
      ],
      [
        'Odemwaffen (Aufladung 5–6)',
        'Der Drache setzt eine der folgenden Odemwaffen ein.\nFeuerodem. Der Drache atmet Feuer in einem 4,5-m-Kegel aus. Jede Kreatur in diesem Bereich muss einen Geschicklichkeitsrettungswurf mit SG 13 ablegen. Bei einem Misserfolg erleidet sie 22 (4W10) Feuerschaden, bei einem Erfolg die Hälfte.\nSchwächender Odem. Der Drache atmet Gas in einem 4,5-m-Kegel aus. Jede Kreatur in diesem Bereich muss einen Stärkerettungswurf mit SG 13 bestehen, sonst ist sie 1 Minute lang bei stärkebasierten Angriffswürfen, Stärkewürfen und Stärkerettungswürfen im Nachteil. Eine Kreatur kann den Rettungswurf am Ende jedes ihrer Züge wiederholen und beendet die Wirkung bei einem Erfolg für sich.',
      ],
    ],
  },
  'green-hag': {
    traits: [
      ['Amphibisch', 'Die Vettel kann Luft und Wasser atmen.'],
      [
        'Angeborenes Zauberwirken',
        'Das Attribut der Vettel zum angeborenen Zauberwirken ist Charisma (Zauberrettungswurf-SG 12). Sie kann die folgenden Zauber angeboren wirken, ohne Materialkomponenten zu benötigen:\nBeliebig oft: Tanzende Lichter, Kleine Illusion, Gehässiger Spott',
      ],
      [
        'Nachahmung',
        'Die Vettel kann Tierlaute und humanoide Stimmen nachahmen. Eine Kreatur, welche die Laute hört, erkennt mit einem erfolgreichen Weisheitswurf (Motiv erkennen) gegen SG 14, dass es Nachahmungen sind.',
      ],
    ],
    actions: [
      [
        'Klauen',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 13 (2W8 + 4) Hiebschaden.',
      ],
      [
        'Illusorisches Erscheinungsbild',
        'Die Vettel hüllt sich und alles, was sie trägt oder hält, in eine magische Illusion, durch die sie wie eine andere Kreatur ihrer ungefähren Größe und humanoiden Gestalt aussieht. Die Illusion endet, wenn die Vettel sie mit einer Bonusaktion beendet oder stirbt.\nDie durch diese Wirkung hervorgerufenen Veränderungen halten einer körperlichen Untersuchung nicht stand. So könnte die Vettel glatte Haut zu haben scheinen, doch wer sie berührt, würde ihr raues Fleisch spüren. Ansonsten muss eine Kreatur eine Aktion nutzen, um die Illusion in Augenschein zu nehmen, und einen Intelligenzwurf (Nachforschungen) gegen SG 20 bestehen, um zu erkennen, dass die Vettel verkleidet ist.',
      ],
      [
        'Unsichtbarer Durchgang',
        'Die Vettel wird magisch unsichtbar, bis sie angreift oder einen Zauber wirkt oder bis ihre Konzentration endet (als würde sie sich auf einen Zauber konzentrieren). Solange sie unsichtbar ist, hinterlässt sie keine körperlichen Spuren ihres Weges, sodass sie nur mit Magie verfolgt werden kann. Ausrüstung, die sie trägt oder hält, ist mit ihr unsichtbar.',
      ],
    ],
  },
  'hell-hound': {
    traits: [
      [
        'Scharfes Gehör und scharfer Geruchssinn',
        'Der Hund ist bei Weisheitswürfen (Wahrnehmung), die auf dem Gehör oder dem Geruchssinn beruhen, im Vorteil.',
      ],
      [
        'Rudeltaktik',
        'Der Hund ist bei Angriffswürfen gegen eine Kreatur im Vorteil, wenn sich mindestens ein nicht kampfunfähiger Verbündeter des Hunds im Umkreis von 1,5 m um die Kreatur befindet.',
      ],
    ],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 7 (1W8 + 3) Stichschaden plus 7 (2W6) Feuerschaden.',
      ],
      [
        'Feuerodem (Aufladung 5–6)',
        'Der Hund atmet Feuer in einem 4,5-m-Kegel aus. Jede Kreatur in diesem Bereich muss einen Geschicklichkeitsrettungswurf mit SG 12 ablegen. Bei einem Misserfolg erleidet sie 21 (6W6) Feuerschaden, bei einem Erfolg die Hälfte.',
      ],
    ],
  },
  'killer-whale': {
    traits: [
      ['Echoortung', 'Der Wal kann seine Blindsicht nicht nutzen, solange er taub ist.'],
      ['Atem anhalten', 'Der Wal kann 30 Minuten lang den Atem anhalten.'],
      [
        'Scharfes Gehör',
        'Der Wal ist bei Weisheitswürfen (Wahrnehmung), die auf dem Gehör beruhen, im Vorteil.',
      ],
    ],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 21 (5W6 + 4) Stichschaden.',
      ],
    ],
  },
  knight: {
    traits: [['Tapfer', 'Der Ritter ist bei Rettungswürfen gegen Furcht im Vorteil.']],
    actions: [
      ['Mehrfachangriff', 'Der Ritter führt zwei Nahkampfangriffe aus.'],
      [
        'Zweihandschwert',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 10 (2W6 + 3) Hiebschaden.',
      ],
      [
        'Schwere Armbrust',
        'Fernkampf-Waffenangriff: +2 auf Treffer, Reichweite 30/120 m, ein Ziel. Treffer: 5 (1W10) Stichschaden.',
      ],
      [
        'Führungskraft (Aufladung nach einer kurzen oder langen Rast)',
        '1 Minute lang kann der Ritter einen besonderen Befehl oder eine Warnung ausrufen, wann immer eine nicht feindselige Kreatur, die er im Umkreis von 9 m sehen kann, einen Angriffswurf oder einen Rettungswurf ablegt. Die Kreatur kann einen W4 zu ihrem Wurf addieren, sofern sie den Ritter hören und verstehen kann. Eine Kreatur kann jeweils nur von einem Führungswürfel profitieren. Die Wirkung endet, wenn der Ritter kampfunfähig ist.',
      ],
    ],
    reactions: [
      [
        'Parade',
        'Der Ritter erhöht seine RK gegen einen Nahkampfangriff, der ihn treffen würde, um 2. Dazu muss der Ritter den Angreifer sehen und eine Nahkampfwaffe führen.',
      ],
    ],
  },
  lamia: {
    traits: [
      [
        'Angeborenes Zauberwirken',
        'Das Attribut der Lamia zum angeborenen Zauberwirken ist Charisma (Zauberrettungswurf-SG 13). Sie kann die folgenden Zauber angeboren wirken, ohne Materialkomponenten zu benötigen. Beliebig oft: Selbstverkleidung (jede humanoide Gestalt), Mächtiges Trugbild. Je 3-mal täglich: Person bezaubern, Spiegelbilder, Ausspähung, Suggestion. 1-mal täglich: Geas',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Die Lamia führt zwei Angriffe aus: einen mit ihren Klauen und einen mit ihrem Dolch oder ihrer Berauschenden Berührung.',
      ],
      [
        'Klauen',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 14 (2W10 + 3) Hiebschaden.',
      ],
      [
        'Dolch',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 5 (1W4 + 3) Stichschaden.',
      ],
      [
        'Berauschende Berührung',
        'Nahkampf-Zauberangriff: +5 auf Treffer, Reichweite 1,5 m, eine Kreatur. Treffer: Das Ziel ist 1 Stunde lang magisch verflucht. Bis der Fluch endet, ist das Ziel bei Weisheitsrettungswürfen und allen Attributswürfen im Nachteil.',
      ],
    ],
  },
  manticore: {
    traits: [
      [
        'Nachwachsende Schwanzstacheln',
        'Der Mantikor hat vierundzwanzig Schwanzstacheln. Verbrauchte Stacheln wachsen nach, wenn der Mantikor eine lange Rast beendet.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Mantikor führt drei Angriffe aus: einen mit seinem Biss und zwei mit seinen Klauen oder drei mit seinen Schwanzstacheln.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 7 (1W8 + 3) Stichschaden.',
      ],
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 6 (1W6 + 3) Hiebschaden.',
      ],
      [
        'Schwanzstachel',
        'Fernkampf-Waffenangriff: +5 auf Treffer, Reichweite 30/60 m, ein Ziel. Treffer: 7 (1W8 + 3) Stichschaden.',
      ],
    ],
  },
  minotaur: {
    traits: [
      [
        'Sturmangriff',
        'Bewegt sich der Minotaurus mindestens 3 m geradlinig auf ein Ziel zu und trifft es dann im selben Zug mit einem Aufspießangriff, erleidet das Ziel zusätzlich 9 (2W8) Stichschaden. Ist das Ziel eine Kreatur, muss es einen Stärkerettungswurf mit SG 14 bestehen, sonst wird es bis zu 3 m weggestoßen und zu Boden geworfen.',
      ],
      [
        'Labyrinthisches Gedächtnis',
        'Der Minotaurus kann sich an jeden Weg, den er zurückgelegt hat, vollkommen erinnern.',
      ],
      [
        'Rücksichtslos',
        'Zu Beginn seines Zuges kann der Minotaurus sich in diesem Zug Vorteil auf alle Angriffswürfe mit Nahkampfwaffen verschaffen, doch Angriffswürfe gegen ihn sind bis zum Beginn seines nächsten Zuges im Vorteil.',
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
  mummy: {
    actions: [
      [
        'Mehrfachangriff',
        'Die Mumie kann ihren Grauenvollen Blick einsetzen und führt einen Angriff mit ihrer Fäulnisfaust aus.',
      ],
      [
        'Fäulnisfaust',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 10 (2W6 + 3) Wuchtschaden plus 10 (3W6) nekrotischen Schaden. Ist das Ziel eine Kreatur, muss es einen Konstitutionsrettungswurf mit SG 12 bestehen, sonst wird es mit Mumienfäule verflucht. Das verfluchte Ziel kann keine Trefferpunkte zurückerhalten, und sein Trefferpunktemaximum sinkt alle 24 Stunden um 10 (3W6). Senkt der Fluch das Trefferpunktemaximum des Ziels auf 0, stirbt das Ziel, und sein Körper zerfällt zu Staub. Der Fluch hält an, bis er durch den Zauber Fluch brechen oder andere Magie aufgehoben wird.',
      ],
      [
        'Grauenvoller Blick',
        'Die Mumie wählt eine Kreatur, die sie im Umkreis von 18 m sehen kann, als Ziel. Kann das Ziel die Mumie sehen, muss es einen Weisheitsrettungswurf mit SG 11 gegen diese Magie bestehen, sonst ist es bis zum Ende des nächsten Zuges der Mumie verängstigt. Misslingt dem Ziel der Rettungswurf um 5 oder mehr, ist es für dieselbe Dauer außerdem gelähmt. Ein Ziel, dessen Rettungswurf gelingt, ist für die nächsten 24 Stunden immun gegen den Grauenvollen Blick aller Mumien (aber nicht der Mumienfürsten).',
      ],
    ],
  },
  nightmare: {
    traits: [
      [
        'Feuerresistenz verleihen',
        'Der Nachtmahr kann jedem, der ihn reitet, Resistenz gegen Feuerschaden verleihen.',
      ],
      [
        'Leuchten',
        'Der Nachtmahr verbreitet helles Licht in einem Radius von 3 m und dämmriges Licht für weitere 3 m.',
      ],
    ],
    actions: [
      [
        'Hufe',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 13 (2W8 + 4) Wuchtschaden plus 7 (2W6) Feuerschaden.',
      ],
      [
        'Ätherischer Schritt',
        'Der Nachtmahr und bis zu drei bereitwillige Kreaturen im Umkreis von 1,5 m um ihn betreten magisch von der Materiellen Ebene aus die Ätherebene oder umgekehrt.',
      ],
    ],
  },
  owlbear: {
    traits: [
      [
        'Scharfe Sicht und scharfer Geruchssinn',
        'Der Eulenbär ist bei Weisheitswürfen (Wahrnehmung), die auf der Sicht oder dem Geruchssinn beruhen, im Vorteil.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Eulenbär führt zwei Angriffe aus: einen mit seinem Schnabel und einen mit seinen Klauen.',
      ],
      [
        'Schnabel',
        'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 1,5 m, eine Kreatur. Treffer: 10 (1W10 + 5) Stichschaden.',
      ],
      [
        'Klauen',
        'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 14 (2W8 + 5) Hiebschaden.',
      ],
    ],
  },
  'phase-spider': {
    traits: [
      [
        'Ätherischer Abstecher',
        'Als Bonusaktion kann die Spinne magisch von der Materiellen Ebene in die Ätherebene wechseln oder umgekehrt.',
      ],
      [
        'Spinnenklettern',
        'Die Spinne kann an schwierigen Oberflächen klettern, auch kopfüber an Decken, ohne einen Attributswurf ablegen zu müssen.',
      ],
      ['Netzläufer', 'Die Spinne ignoriert Bewegungseinschränkungen durch Spinnweben.'],
    ],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, eine Kreatur. Treffer: 7 (1W10 + 2) Stichschaden, und das Ziel muss einen Konstitutionsrettungswurf mit SG 11 ablegen. Bei einem Misserfolg erleidet es 18 (4W8) Giftschaden, bei einem Erfolg die Hälfte. Senkt der Giftschaden das Ziel auf 0 Trefferpunkte, ist das Ziel stabil, aber 1 Stunde lang vergiftet, selbst nachdem es Trefferpunkte zurückerhalten hat, und solange es auf diese Weise vergiftet ist, ist es gelähmt.',
      ],
    ],
  },
  'red-dragon-wyrmling': {
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 9 (1W10 + 4) Stichschaden plus 3 (1W6) Feuerschaden.',
      ],
      [
        'Feuerodem (Aufladung 5–6)',
        'Der Drache atmet Feuer in einem 4,5-m-Kegel aus. Jede Kreatur in diesem Bereich muss einen Geschicklichkeitsrettungswurf mit SG 13 ablegen. Bei einem Misserfolg erleidet sie 24 (7W6) Feuerschaden, bei einem Erfolg die Hälfte.',
      ],
    ],
  },
  'succubus-incubus': {
    traits: [
      [
        'Telepathische Verbindung',
        'Der Unhold ignoriert die Reichweitenbeschränkung seiner Telepathie, wenn er mit einer Kreatur kommuniziert, die er bezaubert hat. Die beiden müssen sich nicht einmal auf derselben Existenzebene befinden.',
      ],
      [
        'Gestaltwandler',
        'Der Unhold kann seine Aktion nutzen, um sich in einen kleinen oder mittelgroßen Humanoiden zu verwandeln oder zurück in seine wahre Gestalt. Ohne Flügel verliert der Unhold seine Flugbewegungsrate. Bis auf Größe und Bewegungsrate sind seine Spielwerte in jeder Gestalt gleich. Ausrüstung, die er trägt oder hält, wird nicht verwandelt. Stirbt er, nimmt er wieder seine wahre Gestalt an.',
      ],
    ],
    actions: [
      [
        'Klaue (nur Unholdgestalt)',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 6 (1W6 + 3) Hiebschaden.',
      ],
      [
        'Bezaubern',
        'Ein Humanoider, den der Unhold im Umkreis von 9 m sehen kann, muss einen Weisheitsrettungswurf mit SG 15 bestehen, sonst ist er 1 Tag lang magisch bezaubert. Das bezauberte Ziel gehorcht den gesprochenen oder telepathischen Befehlen des Unholds. Erleidet das Ziel irgendeinen Schaden oder erhält es einen selbstmörderischen Befehl, kann es den Rettungswurf wiederholen und beendet die Wirkung bei einem Erfolg. Besteht das Ziel den Rettungswurf gegen die Wirkung oder endet die Wirkung für es, ist das Ziel für die nächsten 24 Stunden immun gegen das Bezaubern dieses Unholds.\nDer Unhold kann jeweils nur ein Ziel bezaubert haben. Bezaubert er ein weiteres, endet die Wirkung auf das vorherige Ziel.',
      ],
      [
        'Auszehrender Kuss',
        'Der Unhold küsst eine von ihm bezauberte oder eine bereitwillige Kreatur. Das Ziel muss einen Konstitutionsrettungswurf mit SG 15 gegen diese Magie ablegen. Bei einem Misserfolg erleidet es 32 (5W10 + 5) psychischen Schaden, bei einem Erfolg die Hälfte. Das Trefferpunktemaximum des Ziels sinkt um den erlittenen Schaden. Diese Verringerung hält an, bis das Ziel eine lange Rast beendet. Das Ziel stirbt, wenn diese Wirkung sein Trefferpunktemaximum auf 0 senkt.',
      ],
      [
        'Körperlosigkeit',
        'Der Unhold betritt magisch von der Materiellen Ebene aus die Ätherebene oder umgekehrt.',
      ],
    ],
  },
  veteran: {
    actions: [
      [
        'Mehrfachangriff',
        'Der Veteran führt zwei Langschwertangriffe aus. Hat er ein Kurzschwert gezogen, kann er außerdem einen Kurzschwertangriff ausführen.',
      ],
      [
        'Langschwert',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 7 (1W8 + 3) Hiebschaden, oder 8 (1W10 + 3) Hiebschaden, wenn mit zwei Händen geführt.',
      ],
      [
        'Kurzschwert',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 6 (1W6 + 3) Stichschaden.',
      ],
      [
        'Schwere Armbrust',
        'Fernkampf-Waffenangriff: +3 auf Treffer, Reichweite 30/120 m, ein Ziel. Treffer: 6 (1W10 + 1) Stichschaden.',
      ],
    ],
  },
  'wereboar-boar': {
    traits: [
      [
        'Gestaltwandler',
        'Der Wereber kann seine Aktion nutzen, um sich in eine Eber-Humanoiden-Mischgestalt oder einen Eber zu verwandeln oder zurück in seine wahre, humanoide Gestalt. Seine Spielwerte sind bis auf die RK in jeder Gestalt gleich. Ausrüstung, die er trägt oder hält, wird nicht verwandelt. Stirbt er, nimmt er wieder seine wahre Gestalt an.',
      ],
      [
        'Sturmangriff (nur Eber- oder Mischgestalt)',
        'Bewegt sich der Wereber mindestens 4,5 m geradlinig auf ein Ziel zu und trifft es dann im selben Zug mit seinen Hauern, erleidet das Ziel zusätzlich 7 (2W6) Hiebschaden. Ist das Ziel eine Kreatur, muss es einen Stärkerettungswurf mit SG 13 bestehen, sonst wird es zu Boden geworfen.',
      ],
      [
        'Unerbittlich (Aufladung nach einer kurzen oder langen Rast)',
        'Erleidet der Wereber 14 oder weniger Schaden, der seine Trefferpunkte auf 0 senken würde, sinken sie stattdessen auf 1.',
      ],
    ],
    actions: [
      [
        'Hauer',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 10 (2W6 + 3) Hiebschaden. Ist das Ziel ein Humanoider, muss es einen Konstitutionsrettungswurf mit SG 12 bestehen, sonst wird es mit der Lykanthropie des Werebers verflucht.',
      ],
    ],
  },
  'wereboar-human': {
    traits: [
      [
        'Gestaltwandler',
        'Der Wereber kann seine Aktion nutzen, um sich in eine Eber-Humanoiden-Mischgestalt oder einen Eber zu verwandeln oder zurück in seine wahre, humanoide Gestalt. Seine Spielwerte sind bis auf die RK in jeder Gestalt gleich. Ausrüstung, die er trägt oder hält, wird nicht verwandelt. Stirbt er, nimmt er wieder seine wahre Gestalt an.',
      ],
      [
        'Unerbittlich (Aufladung nach einer kurzen oder langen Rast)',
        'Erleidet der Wereber 14 oder weniger Schaden, der seine Trefferpunkte auf 0 senken würde, sinken sie stattdessen auf 1.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Wereber führt zwei Angriffe aus, von denen nur einer mit seinen Hauern ausgeführt werden kann.',
      ],
      [
        'Zweihandhammer',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 10 (2W6 + 3) Wuchtschaden.',
      ],
    ],
  },
  'wereboar-hybrid': {
    traits: [
      [
        'Gestaltwandler',
        'Der Wereber kann seine Aktion nutzen, um sich in eine Eber-Humanoiden-Mischgestalt oder einen Eber zu verwandeln oder zurück in seine wahre, humanoide Gestalt. Seine Spielwerte sind bis auf die RK in jeder Gestalt gleich. Ausrüstung, die er trägt oder hält, wird nicht verwandelt. Stirbt er, nimmt er wieder seine wahre Gestalt an.',
      ],
      [
        'Sturmangriff (nur Eber- oder Mischgestalt)',
        'Bewegt sich der Wereber mindestens 4,5 m geradlinig auf ein Ziel zu und trifft es dann im selben Zug mit seinen Hauern, erleidet das Ziel zusätzlich 7 (2W6) Hiebschaden. Ist das Ziel eine Kreatur, muss es einen Stärkerettungswurf mit SG 13 bestehen, sonst wird es zu Boden geworfen.',
      ],
      [
        'Unerbittlich (Aufladung nach einer kurzen oder langen Rast)',
        'Erleidet der Wereber 14 oder weniger Schaden, der seine Trefferpunkte auf 0 senken würde, sinken sie stattdessen auf 1.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Wereber führt zwei Angriffe aus, von denen nur einer mit seinen Hauern ausgeführt werden kann.',
      ],
      [
        'Zweihandhammer',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 10 (2W6 + 3) Wuchtschaden.',
      ],
      [
        'Hauer',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 10 (2W6 + 3) Hiebschaden. Ist das Ziel ein Humanoider, muss es einen Konstitutionsrettungswurf mit SG 12 bestehen, sonst wird es mit der Lykanthropie des Werebers verflucht.',
      ],
    ],
  },
  'weretiger-human': {
    traits: [
      [
        'Gestaltwandler',
        'Der Wertiger kann seine Aktion nutzen, um sich in eine Tiger-Humanoiden-Mischgestalt oder einen Tiger zu verwandeln oder zurück in seine wahre, humanoide Gestalt. Seine Spielwerte sind bis auf die Größe in jeder Gestalt gleich. Ausrüstung, die er trägt oder hält, wird nicht verwandelt. Stirbt er, nimmt er wieder seine wahre Gestalt an.',
      ],
      [
        'Scharfes Gehör und scharfer Geruchssinn',
        'Der Wertiger ist bei Weisheitswürfen (Wahrnehmung), die auf dem Gehör oder dem Geruchssinn beruhen, im Vorteil.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'In humanoider Gestalt führt der Wertiger zwei Krummsäbelangriffe oder zwei Langbogenangriffe aus. In Mischgestalt kann er wie ein Humanoider angreifen oder zwei Klauenangriffe ausführen.',
      ],
      [
        'Krummsäbel',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 6 (1W6 + 3) Hiebschaden.',
      ],
      [
        'Langbogen',
        'Fernkampf-Waffenangriff: +4 auf Treffer, Reichweite 45/180 m, ein Ziel. Treffer: 6 (1W8 + 2) Stichschaden.',
      ],
    ],
  },
  'weretiger-hybrid': {
    traits: [
      [
        'Gestaltwandler',
        'Der Wertiger kann seine Aktion nutzen, um sich in eine Tiger-Humanoiden-Mischgestalt oder einen Tiger zu verwandeln oder zurück in seine wahre, humanoide Gestalt. Seine Spielwerte sind bis auf die Größe in jeder Gestalt gleich. Ausrüstung, die er trägt oder hält, wird nicht verwandelt. Stirbt er, nimmt er wieder seine wahre Gestalt an.',
      ],
      [
        'Scharfes Gehör und scharfer Geruchssinn',
        'Der Wertiger ist bei Weisheitswürfen (Wahrnehmung), die auf dem Gehör oder dem Geruchssinn beruhen, im Vorteil.',
      ],
      [
        'Anspringen',
        'Bewegt sich der Wertiger mindestens 4,5 m geradlinig auf eine Kreatur zu und trifft sie dann im selben Zug mit einem Klauenangriff, muss das Ziel einen Stärkerettungswurf mit SG 14 bestehen, sonst wird es zu Boden geworfen. Liegt das Ziel am Boden, kann der Wertiger als Bonusaktion einen Bissangriff gegen es ausführen.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'In humanoider Gestalt führt der Wertiger zwei Krummsäbelangriffe oder zwei Langbogenangriffe aus. In Mischgestalt kann er wie ein Humanoider angreifen oder zwei Klauenangriffe ausführen.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 8 (1W10 + 3) Stichschaden. Ist das Ziel ein Humanoider, muss es einen Konstitutionsrettungswurf mit SG 13 bestehen, sonst wird es mit der Lykanthropie des Wertigers verflucht.',
      ],
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 7 (1W8 + 3) Hiebschaden.',
      ],
      [
        'Krummsäbel',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 6 (1W6 + 3) Hiebschaden.',
      ],
      [
        'Langbogen',
        'Fernkampf-Waffenangriff: +4 auf Treffer, Reichweite 45/180 m, ein Ziel. Treffer: 6 (1W8 + 2) Stichschaden.',
      ],
    ],
  },
  'weretiger-tiger': {
    traits: [
      [
        'Gestaltwandler',
        'Der Wertiger kann seine Aktion nutzen, um sich in eine Tiger-Humanoiden-Mischgestalt oder einen Tiger zu verwandeln oder zurück in seine wahre, humanoide Gestalt. Seine Spielwerte sind bis auf die Größe in jeder Gestalt gleich. Ausrüstung, die er trägt oder hält, wird nicht verwandelt. Stirbt er, nimmt er wieder seine wahre Gestalt an.',
      ],
      [
        'Scharfes Gehör und scharfer Geruchssinn',
        'Der Wertiger ist bei Weisheitswürfen (Wahrnehmung), die auf dem Gehör oder dem Geruchssinn beruhen, im Vorteil.',
      ],
      [
        'Anspringen',
        'Bewegt sich der Wertiger mindestens 4,5 m geradlinig auf eine Kreatur zu und trifft sie dann im selben Zug mit einem Klauenangriff, muss das Ziel einen Stärkerettungswurf mit SG 14 bestehen, sonst wird es zu Boden geworfen. Liegt das Ziel am Boden, kann der Wertiger als Bonusaktion einen Bissangriff gegen es ausführen.',
      ],
    ],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 8 (1W10 + 3) Stichschaden. Ist das Ziel ein Humanoider, muss es einen Konstitutionsrettungswurf mit SG 13 bestehen, sonst wird es mit der Lykanthropie des Wertigers verflucht.',
      ],
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 7 (1W8 + 3) Hiebschaden.',
      ],
    ],
  },
  'werewolf-human': {
    traits: [
      [
        'Gestaltwandler',
        'Der Werwolf kann seine Aktion nutzen, um sich in eine Wolf-Humanoiden-Mischgestalt oder einen Wolf zu verwandeln oder zurück in seine wahre, humanoide Gestalt. Seine Spielwerte sind bis auf die RK in jeder Gestalt gleich. Ausrüstung, die er trägt oder hält, wird nicht verwandelt. Stirbt er, nimmt er wieder seine wahre Gestalt an.',
      ],
      [
        'Scharfes Gehör und scharfer Geruchssinn',
        'Der Werwolf ist bei Weisheitswürfen (Wahrnehmung), die auf dem Gehör oder dem Geruchssinn beruhen, im Vorteil.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Werwolf führt zwei Angriffe aus: zwei mit seinem Speer (humanoide Gestalt) oder einen mit seinem Biss und einen mit seinen Klauen (Mischgestalt).',
      ],
      [
        'Speer',
        'Nah- oder Fernkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m oder Reichweite 6/18 m, eine Kreatur. Treffer: 5 (1W6 + 2) Stichschaden, oder 6 (1W8 + 2) Stichschaden, wenn mit zwei Händen geführt.',
      ],
    ],
  },
  'werewolf-hybrid': {
    traits: [
      [
        'Gestaltwandler',
        'Der Werwolf kann seine Aktion nutzen, um sich in eine Wolf-Humanoiden-Mischgestalt oder einen Wolf zu verwandeln oder zurück in seine wahre, humanoide Gestalt. Seine Spielwerte sind bis auf die RK in jeder Gestalt gleich. Ausrüstung, die er trägt oder hält, wird nicht verwandelt. Stirbt er, nimmt er wieder seine wahre Gestalt an.',
      ],
      [
        'Scharfes Gehör und scharfer Geruchssinn',
        'Der Werwolf ist bei Weisheitswürfen (Wahrnehmung), die auf dem Gehör oder dem Geruchssinn beruhen, im Vorteil.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Werwolf führt zwei Angriffe aus: zwei mit seinem Speer (humanoide Gestalt) oder einen mit seinem Biss und einen mit seinen Klauen (Mischgestalt).',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 6 (1W8 + 2) Stichschaden. Ist das Ziel ein Humanoider, muss es einen Konstitutionsrettungswurf mit SG 12 bestehen, sonst wird es mit der Lykanthropie des Werwolfs verflucht.',
      ],
      [
        'Klauen',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, eine Kreatur. Treffer: 7 (2W4 + 2) Hiebschaden.',
      ],
    ],
  },
  'werewolf-wolf': {
    traits: [
      [
        'Gestaltwandler',
        'Der Werwolf kann seine Aktion nutzen, um sich in eine Wolf-Humanoiden-Mischgestalt oder einen Wolf zu verwandeln oder zurück in seine wahre, humanoide Gestalt. Seine Spielwerte sind bis auf die RK in jeder Gestalt gleich. Ausrüstung, die er trägt oder hält, wird nicht verwandelt. Stirbt er, nimmt er wieder seine wahre Gestalt an.',
      ],
      [
        'Scharfes Gehör und scharfer Geruchssinn',
        'Der Werwolf ist bei Weisheitswürfen (Wahrnehmung), die auf dem Gehör oder dem Geruchssinn beruhen, im Vorteil.',
      ],
    ],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 6 (1W8 + 2) Stichschaden. Ist das Ziel ein Humanoider, muss es einen Konstitutionsrettungswurf mit SG 12 bestehen, sonst wird es mit der Lykanthropie des Werwolfs verflucht.',
      ],
    ],
  },
  wight: {
    traits: [
      [
        'Sonnenlichtempfindlichkeit',
        'Im Sonnenlicht ist der Grabunhold bei Angriffswürfen sowie bei Weisheitswürfen (Wahrnehmung), die auf der Sicht beruhen, im Nachteil.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Grabunhold führt zwei Langschwertangriffe oder zwei Langbogenangriffe aus. Er kann anstelle eines Langschwertangriffs seinen Lebensentzug einsetzen.',
      ],
      [
        'Lebensentzug',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, eine Kreatur. Treffer: 5 (1W6 + 2) nekrotischen Schaden. Das Ziel muss einen Konstitutionsrettungswurf mit SG 13 bestehen, sonst sinkt sein Trefferpunktemaximum um den erlittenen Schaden. Diese Verringerung hält an, bis das Ziel eine lange Rast beendet. Das Ziel stirbt, wenn diese Wirkung sein Trefferpunktemaximum auf 0 senkt.\nEin durch diesen Angriff getöteter Humanoider erhebt sich 24 Stunden später als Zombie unter der Kontrolle des Grabunholds, es sei denn, der Humanoide wird ins Leben zurückgeholt oder sein Körper wird zerstört. Der Grabunhold kann gleichzeitig höchstens zwölf Zombies unter seiner Kontrolle haben.',
      ],
      [
        'Langschwert',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 6 (1W8 + 2) Hiebschaden, oder 7 (1W10 + 2) Hiebschaden, wenn mit zwei Händen geführt.',
      ],
      [
        'Langbogen',
        'Fernkampf-Waffenangriff: +4 auf Treffer, Reichweite 45/180 m, ein Ziel. Treffer: 6 (1W8 + 2) Stichschaden.',
      ],
    ],
  },
  'winter-wolf': {
    traits: [
      [
        'Scharfes Gehör und scharfer Geruchssinn',
        'Der Wolf ist bei Weisheitswürfen (Wahrnehmung), die auf dem Gehör oder dem Geruchssinn beruhen, im Vorteil.',
      ],
      [
        'Rudeltaktik',
        'Der Wolf ist bei Angriffswürfen gegen eine Kreatur im Vorteil, wenn sich mindestens ein nicht kampfunfähiger Verbündeter des Wolfs im Umkreis von 1,5 m um die Kreatur befindet.',
      ],
      [
        'Schneetarnung',
        'Der Wolf ist bei Geschicklichkeitswürfen (Heimlichkeit), um sich in verschneitem Gelände zu verstecken, im Vorteil.',
      ],
    ],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 11 (2W6 + 4) Stichschaden. Ist das Ziel eine Kreatur, muss es einen Stärkerettungswurf mit SG 14 bestehen, sonst wird es zu Boden geworfen.',
      ],
      [
        'Kälteodem (Aufladung 5–6)',
        'Der Wolf atmet einen Stoß eisigen Windes in einem 4,5-m-Kegel aus. Jede Kreatur in diesem Bereich muss einen Geschicklichkeitsrettungswurf mit SG 12 ablegen. Bei einem Misserfolg erleidet sie 18 (4W8) Kälteschaden, bei einem Erfolg die Hälfte.',
      ],
    ],
  },
};
