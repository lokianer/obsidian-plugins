// German texts of the SRD monsters of challenge rating 5: traits, actions, reactions and legendary
// actions. Our own translation of the SRD 5.1, CC-BY-4.0 (see NOTICE.md).

import type { DeMonsterText } from '../model';

export const DE_TEXTS_CR5: Readonly<Record<string, DeMonsterText>> = {
  'air-elemental': {
    traits: [
      [
        'Luftgestalt',
        'Der Elementar kann den Bereich einer feindseligen Kreatur betreten und dort anhalten. Er kann sich durch einen Bereich bewegen, der nur 2,5 cm breit ist, ohne sich zwängen zu müssen.',
      ],
    ],
    actions: [
      ['Mehrfachangriff', 'Der Elementar führt zwei Hiebangriffe aus.'],
      [
        'Hieb',
        'Nahkampf-Waffenangriff: +8 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 14 (2W8 + 5) Wuchtschaden.',
      ],
      [
        'Wirbelwind (Aufladung 4–6)',
        'Jede Kreatur im Bereich des Elementars muss einen Stärkerettungswurf mit SG 13 ablegen. Bei einem Misserfolg erleidet ein Ziel 15 (3W8 + 2) Wuchtschaden, wird 6 m in eine zufällige Richtung von dem Elementar fortgeschleudert und zu Boden geworfen. Prallt ein geschleudertes Ziel gegen ein Objekt wie eine Wand oder den Boden, erleidet es für je 3 m, die es geschleudert wurde, 3 (1W6) Wuchtschaden. Wird das Ziel gegen eine andere Kreatur geschleudert, muss diese Kreatur einen Geschicklichkeitsrettungswurf mit SG 13 bestehen, sonst erleidet sie denselben Schaden und wird zu Boden geworfen.\nIst der Rettungswurf erfolgreich, erleidet das Ziel den halben Wuchtschaden und wird weder fortgeschleudert noch zu Boden geworfen.',
      ],
    ],
  },
  'barbed-devil': {
    traits: [
      [
        'Stachelhaut',
        'Zu Beginn jedes seiner Züge fügt der Teufel jeder Kreatur, die ihn gepackt hält, 5 (1W10) Stichschaden zu.',
      ],
      ['Teufelssicht', 'Magische Dunkelheit behindert die Dunkelsicht des Teufels nicht.'],
      [
        'Magieresistenz',
        'Der Teufel ist bei Rettungswürfen gegen Zauber und andere magische Effekte im Vorteil.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Teufel führt drei Nahkampfangriffe aus: einen mit seinem Schwanz und zwei mit seinen Klauen. Alternativ kann er zweimal Flamme schleudern einsetzen.',
      ],
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 6 (1W6 + 3) Stichschaden.',
      ],
      [
        'Schwanz',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 10 (2W6 + 3) Stichschaden.',
      ],
      [
        'Flamme schleudern',
        'Fernkampf-Zauberangriff: +5 auf Treffer, Reichweite 45 m, ein Ziel. Treffer: 10 (3W6) Feuerschaden. Ist das Ziel ein brennbarer Gegenstand, der nicht getragen oder gehalten wird, fängt er außerdem Feuer.',
      ],
    ],
  },
  bulette: {
    traits: [
      [
        'Sprung aus dem Stand',
        'Der Weitsprung der Bulette reicht bis zu 9 m, ihr Hochsprung bis zu 4,5 m, mit oder ohne Anlauf.',
      ],
    ],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 30 (4W12 + 4) Stichschaden.',
      ],
      [
        'Tödlicher Sprung',
        'Springt die Bulette im Rahmen ihrer Bewegung mindestens 4,5 m weit, kann sie dann mit dieser Aktion in einem Bereich auf den Füßen landen, in dem sich eine oder mehrere andere Kreaturen befinden. Jede dieser Kreaturen muss einen Stärke- oder Geschicklichkeitsrettungswurf mit SG 16 bestehen (nach Wahl des Ziels), sonst wird sie zu Boden geworfen und erleidet 14 (3W6 + 4) Wuchtschaden plus 14 (3W6 + 4) Hiebschaden. Bei einem Erfolg erleidet die Kreatur nur den halben Schaden, wird nicht zu Boden geworfen und wird 1,5 m aus dem Bereich der Bulette in einen freien Bereich ihrer Wahl gestoßen. Ist kein freier Bereich in Reichweite, fällt die Kreatur stattdessen im Bereich der Bulette zu Boden.',
      ],
    ],
  },
  'earth-elemental': {
    traits: [
      [
        'Erdgleiten',
        'Der Elementar kann sich durch nichtmagische, unbearbeitete Erde und Stein graben. Dabei stört der Elementar das Material, durch das er sich bewegt, nicht.',
      ],
      [
        'Belagerungsmonster',
        'Der Elementar verursacht an Gegenständen und Bauwerken doppelten Schaden.',
      ],
    ],
    actions: [
      ['Mehrfachangriff', 'Der Elementar führt zwei Hiebangriffe aus.'],
      [
        'Hieb',
        'Nahkampf-Waffenangriff: +8 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 14 (2W8 + 5) Wuchtschaden.',
      ],
    ],
  },
  'fire-elemental': {
    traits: [
      [
        'Feuergestalt',
        'Der Elementar kann sich durch einen Bereich bewegen, der nur 2,5 cm breit ist, ohne sich zwängen zu müssen. Eine Kreatur, die den Elementar berührt oder ihn mit einem Nahkampfangriff trifft, während sie sich im Umkreis von 1,5 m um ihn befindet, erleidet 5 (1W10) Feuerschaden. Außerdem kann der Elementar den Bereich einer feindseligen Kreatur betreten und dort anhalten. Betritt er zum ersten Mal in einem Zug den Bereich einer Kreatur, erleidet diese Kreatur 5 (1W10) Feuerschaden und fängt Feuer; bis jemand eine Aktion nutzt, um das Feuer zu löschen, erleidet die Kreatur zu Beginn jedes ihrer Züge 5 (1W10) Feuerschaden.',
      ],
      [
        'Leuchten',
        'Der Elementar verbreitet helles Licht in einem Radius von 9 m und dämmriges Licht für weitere 9 m.',
      ],
      [
        'Wasseranfälligkeit',
        'Für je 1,5 m, die der Elementar sich im Wasser bewegt, oder für jede Gallone Wasser, die auf ihn gespritzt wird, erleidet er 1 Kälteschaden.',
      ],
    ],
    actions: [
      ['Mehrfachangriff', 'Der Elementar führt zwei Berührungsangriffe aus.'],
      [
        'Berührung',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 10 (2W6 + 3) Feuerschaden. Ist das Ziel eine Kreatur oder ein brennbarer Gegenstand, entzündet es sich. Bis eine Kreatur eine Aktion nutzt, um das Feuer zu löschen, erleidet das Ziel zu Beginn jedes seiner Züge 5 (1W10) Feuerschaden.',
      ],
    ],
  },
  'flesh-golem': {
    traits: [
      [
        'Berserker',
        'Beginnt der Golem seinen Zug mit 40 oder weniger Trefferpunkten, wirf einen W6. Bei einer 6 gerät der Golem in Raserei. In jedem seiner Züge in Raserei greift der Golem die nächste Kreatur an, die er sehen kann. Ist keine Kreatur nah genug, um sich zu ihr zu bewegen und sie anzugreifen, greift der Golem einen Gegenstand an, bevorzugt einen, der kleiner ist als er selbst. Ist der Golem einmal in Raserei geraten, bleibt er es, bis er zerstört wird oder alle seine Trefferpunkte zurückerhält.\nBefindet sich der Erschaffer des Golems im Umkreis von 18 m um den rasenden Golem, kann er versuchen, ihn mit festen, überzeugenden Worten zu beruhigen. Der Golem muss seinen Erschaffer hören können, der eine Aktion nutzen muss, um einen Charismawurf (Überzeugen) gegen SG 15 abzulegen. Gelingt der Wurf, endet die Raserei des Golems. Erleidet er Schaden, während er noch 40 oder weniger Trefferpunkte hat, kann der Golem erneut in Raserei geraten.',
      ],
      [
        'Abneigung gegen Feuer',
        'Erleidet der Golem Feuerschaden, ist er bis zum Ende seines nächsten Zuges bei Angriffswürfen und Attributswürfen im Nachteil.',
      ],
      [
        'Unveränderliche Gestalt',
        'Der Golem ist immun gegen jeden Zauber und jede Wirkung, die seine Gestalt verändern würde.',
      ],
      [
        'Blitzabsorption',
        'Wann immer der Golem Blitzschaden ausgesetzt ist, erleidet er keinen Schaden und erhält stattdessen Trefferpunkte in Höhe des verursachten Blitzschadens zurück.',
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
        'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 13 (2W8 + 4) Wuchtschaden.',
      ],
    ],
  },
  'giant-crocodile': {
    traits: [['Atem anhalten', 'Das Krokodil kann 30 Minuten lang den Atem anhalten.']],
    actions: [
      [
        'Mehrfachangriff',
        'Das Krokodil führt zwei Angriffe aus: einen mit seinem Biss und einen mit seinem Schwanz.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +8 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 21 (3W10 + 5) Stichschaden, und das Ziel wird gepackt (Entkommen-SG 16). Bis der Griff endet, ist das Ziel festgesetzt, und das Krokodil kann kein anderes Ziel beißen.',
      ],
      [
        'Schwanz',
        'Nahkampf-Waffenangriff: +8 auf Treffer, Reichweite 3 m, ein Ziel, das nicht von dem Krokodil gepackt ist. Treffer: 14 (2W8 + 5) Wuchtschaden. Ist das Ziel eine Kreatur, muss es einen Stärkerettungswurf mit SG 16 bestehen, sonst wird es zu Boden geworfen.',
      ],
    ],
  },
  'giant-shark': {
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
        'Nahkampf-Waffenangriff: +9 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 22 (3W10 + 6) Stichschaden.',
      ],
    ],
  },
  gladiator: {
    traits: [
      ['Tapfer', 'Der Gladiator ist bei Rettungswürfen gegen Furcht im Vorteil.'],
      [
        'Rohling',
        'Eine Nahkampfwaffe verursacht einen zusätzlichen Schadenswürfel, wenn der Gladiator mit ihr trifft (im Angriff enthalten).',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Gladiator führt drei Nahkampfangriffe oder zwei Fernkampfangriffe aus.',
      ],
      [
        'Speer',
        'Nah- oder Fernkampf-Waffenangriff: +7 auf Treffer, Reichweite 1,5 m oder Reichweite 6/18 m, ein Ziel. Treffer: 11 (2W6 + 4) Stichschaden, oder 13 (2W8 + 4) Stichschaden, wenn mit zwei Händen geführt.',
      ],
      [
        'Schildstoß',
        'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 1,5 m, eine Kreatur. Treffer: 9 (2W4 + 4) Wuchtschaden. Ist das Ziel eine mittelgroße oder kleinere Kreatur, muss es einen Stärkerettungswurf mit SG 15 bestehen, sonst wird es zu Boden geworfen.',
      ],
    ],
    reactions: [
      [
        'Parade',
        'Der Gladiator erhöht seine RK gegen einen Nahkampfangriff, der ihn treffen würde, um 3. Dazu muss der Gladiator den Angreifer sehen und eine Nahkampfwaffe führen.',
      ],
    ],
  },
  gorgon: {
    traits: [
      [
        'Niedertrampeln',
        'Bewegt sich die Gorgone mindestens 6 m geradlinig auf eine Kreatur zu und trifft sie dann im selben Zug mit einem Aufspießangriff, muss das Ziel einen Stärkerettungswurf mit SG 16 bestehen, sonst wird es zu Boden geworfen. Liegt das Ziel am Boden, kann die Gorgone als Bonusaktion einen Angriff mit ihren Hufen gegen es ausführen.',
      ],
    ],
    actions: [
      [
        'Aufspießen',
        'Nahkampf-Waffenangriff: +8 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 18 (2W12 + 5) Stichschaden.',
      ],
      [
        'Hufe',
        'Nahkampf-Waffenangriff: +8 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 16 (2W10 + 5) Wuchtschaden.',
      ],
      [
        'Versteinernder Odem (Aufladung 5–6)',
        'Die Gorgone atmet versteinerndes Gas in einem 9-m-Kegel aus. Jede Kreatur in diesem Bereich muss einen Konstitutionsrettungswurf mit SG 13 ablegen. Bei einem Misserfolg beginnt ein Ziel zu Stein zu werden und ist festgesetzt. Das festgesetzte Ziel muss den Rettungswurf am Ende seines nächsten Zuges wiederholen. Bei einem Erfolg endet die Wirkung für das Ziel. Bei einem Misserfolg ist das Ziel versteinert, bis es durch den Zauber Vollständige Genesung oder andere Magie befreit wird.',
      ],
    ],
  },
  'half-red-dragon-veteran': {
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
      [
        'Feuerodem (Aufladung 5–6)',
        'Der Veteran atmet Feuer in einem 4,5-m-Kegel aus. Jede Kreatur in diesem Bereich muss einen Geschicklichkeitsrettungswurf mit SG 15 ablegen. Bei einem Misserfolg erleidet sie 24 (7W6) Feuerschaden, bei einem Erfolg die Hälfte.',
      ],
    ],
  },
  'hill-giant': {
    actions: [
      ['Mehrfachangriff', 'Der Riese führt zwei Zweihandknüppelangriffe aus.'],
      [
        'Zweihandknüppel',
        'Nahkampf-Waffenangriff: +8 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 18 (3W8 + 5) Wuchtschaden.',
      ],
      [
        'Fels',
        'Fernkampf-Waffenangriff: +8 auf Treffer, Reichweite 18/72 m, ein Ziel. Treffer: 21 (3W10 + 5) Wuchtschaden.',
      ],
    ],
  },
  'night-hag': {
    traits: [
      [
        'Angeborenes Zauberwirken',
        'Das Attribut der Vettel zum angeborenen Zauberwirken ist Charisma (Zauberrettungswurf-SG 14, +6 auf Treffer mit Zauberangriffen). Sie kann die folgenden Zauber angeboren wirken, ohne Materialkomponenten zu benötigen:\nBeliebig oft: Magie entdecken, Magisches Geschoss\nJe 2-mal täglich: Ebenenwechsel (nur selbst), Schwächestrahl, Schlaf',
      ],
      [
        'Magieresistenz',
        'Die Vettel ist bei Rettungswürfen gegen Zauber und andere magische Effekte im Vorteil.',
      ],
      [
        'Gegenstände der Nachtvettel',
        'Eine Nachtvettel trägt zwei sehr seltene magische Gegenstände bei sich, die sie selbst herstellen muss. Geht einer davon verloren, setzt die Vettel alles daran, ihn zurückzuholen, denn ein neues Werkzeug herzustellen kostet Zeit und Mühe.\nHerzstein: Dieser glänzende schwarze Edelstein erlaubt einer Nachtvettel, ätherisch zu werden, solange er in ihrem Besitz ist. Die Berührung eines Herzsteins heilt außerdem jede Krankheit. Einen Herzstein herzustellen dauert 30 Tage.\nSeelenbeutel: Stirbt ein böser Humanoider durch die Albtraumheimsuchung einer Nachtvettel, fängt die Vettel die Seele in diesem schwarzen Sack aus vernähtem Fleisch. Ein Seelenbeutel kann jeweils nur eine böse Seele fassen, und nur die Vettel, die den Beutel hergestellt hat, kann damit eine Seele fangen. Einen Seelenbeutel herzustellen dauert 7 Tage und erfordert ein humanoides Opfer (aus dessen Fleisch der Beutel gemacht wird).',
      ],
    ],
    actions: [
      [
        'Klauen (nur Vettelgestalt)',
        'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 13 (2W8 + 4) Hiebschaden.',
      ],
      [
        'Gestalt wandeln',
        'Die Vettel verwandelt sich magisch in eine kleine oder mittelgroße weibliche Humanoide oder zurück in ihre wahre Gestalt. Ihre Spielwerte sind in jeder Gestalt gleich. Ausrüstung, die sie trägt oder hält, wird nicht verwandelt. Stirbt sie, nimmt sie wieder ihre wahre Gestalt an.',
      ],
      [
        'Körperlosigkeit',
        'Die Vettel betritt magisch von der Materiellen Ebene aus die Ätherebene oder umgekehrt. Dazu muss die Vettel einen Herzstein besitzen.',
      ],
      [
        'Albtraumheimsuchung (1-mal täglich)',
        'Auf der Ätherebene berührt die Vettel magisch einen schlafenden Humanoiden auf der Materiellen Ebene. Ein auf das Ziel gewirkter Zauber Schutz vor Gut und Böse verhindert diese Berührung, ebenso ein magischer Kreis. Solange die Berührung anhält, hat das Ziel grauenhafte Visionen. Halten diese Visionen mindestens 1 Stunde lang an, zieht das Ziel keinen Nutzen aus seiner Rast, und sein Trefferpunktemaximum sinkt um 5 (1W10). Senkt diese Wirkung das Trefferpunktemaximum des Ziels auf 0, stirbt das Ziel, und war es böse, ist seine Seele im Seelenbeutel der Vettel gefangen. Die Verringerung des Trefferpunktemaximums hält an, bis sie durch den Zauber Vollständige Genesung oder ähnliche Magie aufgehoben wird.',
      ],
    ],
  },
  otyugh: {
    traits: [
      [
        'Eingeschränkte Telepathie',
        'Der Otyugh kann magisch einfache Botschaften und Bilder an jede Kreatur im Umkreis von 36 m übermitteln, die eine Sprache versteht. Diese Form der Telepathie erlaubt der empfangenden Kreatur nicht, telepathisch zu antworten.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Otyugh führt drei Angriffe aus: einen mit seinem Biss und zwei mit seinen Tentakeln.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 12 (2W8 + 3) Stichschaden. Ist das Ziel eine Kreatur, muss es einen Konstitutionsrettungswurf mit SG 15 gegen Krankheit bestehen, sonst ist es vergiftet, bis die Krankheit geheilt ist. Alle 24 Stunden muss das Ziel den Rettungswurf wiederholen; bei einem Misserfolg sinkt sein Trefferpunktemaximum um 5 (1W10). Bei einem Erfolg ist die Krankheit geheilt. Das Ziel stirbt, wenn die Krankheit sein Trefferpunktemaximum auf 0 senkt. Diese Verringerung des Trefferpunktemaximums hält an, bis die Krankheit geheilt ist.',
      ],
      [
        'Tentakel',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 7 (1W8 + 3) Wuchtschaden plus 4 (1W8) Stichschaden. Ist das Ziel mittelgroß oder kleiner, wird es gepackt (Entkommen-SG 13) und ist festgesetzt, bis der Griff endet. Der Otyugh hat zwei Tentakel, von denen jeder ein Ziel packen kann.',
      ],
      [
        'Tentakelhieb',
        'Der Otyugh schmettert Kreaturen, die er gepackt hält, gegeneinander oder gegen eine feste Oberfläche. Jede Kreatur muss einen Konstitutionsrettungswurf mit SG 14 bestehen, sonst erleidet sie 10 (2W6 + 3) Wuchtschaden und ist bis zum Ende des nächsten Zuges des Otyughs betäubt. Bei einem Erfolg erleidet das Ziel den halben Wuchtschaden und ist nicht betäubt.',
      ],
    ],
  },
  roper: {
    traits: [
      [
        'Falsches Erscheinungsbild',
        'Solange der Roper sich nicht bewegt, ist er nicht von einer gewöhnlichen Höhlenformation wie einem Stalagmiten zu unterscheiden.',
      ],
      [
        'Greifende Ranken',
        'Der Roper kann bis zu sechs Ranken gleichzeitig haben. Jede Ranke kann angegriffen werden (RK 20; 10 Trefferpunkte; Immunität gegen Gift- und psychischen Schaden). Die Zerstörung einer Ranke fügt dem Roper keinen Schaden zu, und er kann in seinem nächsten Zug eine Ersatzranke ausbilden. Eine Ranke kann außerdem abgerissen werden, wenn eine Kreatur eine Aktion nutzt und einen Stärkewurf gegen SG 15 gegen sie besteht.',
      ],
      [
        'Spinnenklettern',
        'Der Roper kann an schwierigen Oberflächen klettern, auch kopfüber an Decken, ohne einen Attributswurf ablegen zu müssen.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Roper führt vier Angriffe mit seinen Ranken aus, setzt Einholen ein und führt einen Angriff mit seinem Biss aus.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 22 (4W8 + 4) Stichschaden.',
      ],
      [
        'Ranke',
        'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 15 m, eine Kreatur. Treffer: Das Ziel wird gepackt (Entkommen-SG 15). Bis der Griff endet, ist das Ziel festgesetzt und bei Stärkewürfen und Stärkerettungswürfen im Nachteil, und der Roper kann dieselbe Ranke nicht gegen ein anderes Ziel einsetzen.',
      ],
      [
        'Einholen',
        'Der Roper zieht jede Kreatur, die er gepackt hält, bis zu 7,5 m geradlinig zu sich heran.',
      ],
    ],
  },
  salamander: {
    traits: [
      [
        'Glühender Körper',
        'Eine Kreatur, die den Salamander berührt oder ihn mit einem Nahkampfangriff trifft, während sie sich im Umkreis von 1,5 m um ihn befindet, erleidet 7 (2W6) Feuerschaden.',
      ],
      [
        'Glühende Waffen',
        'Jede metallene Nahkampfwaffe, die der Salamander führt, verursacht bei einem Treffer zusätzlich 3 (1W6) Feuerschaden (im Angriff enthalten).',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Salamander führt zwei Angriffe aus: einen mit seinem Speer und einen mit seinem Schwanz.',
      ],
      [
        'Speer',
        'Nah- oder Fernkampf-Waffenangriff: +7 auf Treffer, Reichweite 1,5 m oder Reichweite 6/18 m, ein Ziel. Treffer: 11 (2W6 + 4) Stichschaden, oder 13 (2W8 + 4) Stichschaden, wenn mit zwei Händen geführt plus 3 (1W6) Feuerschaden.',
      ],
      [
        'Schwanz',
        'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 11 (2W6 + 4) Wuchtschaden plus 7 (2W6) Feuerschaden, und das Ziel wird gepackt (Entkommen-SG 14). Bis der Griff endet, ist das Ziel festgesetzt, der Salamander trifft das Ziel mit seinem Schwanz automatisch und kann keine Schwanzangriffe gegen andere Ziele ausführen.',
      ],
    ],
  },
  'shambling-mound': {
    traits: [
      [
        'Blitzabsorption',
        'Wann immer der Hügel Blitzschaden ausgesetzt ist, erleidet er keinen Schaden und erhält Trefferpunkte in Höhe des verursachten Blitzschadens zurück.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Hügel führt zwei Hiebangriffe aus. Treffen beide Angriffe ein mittelgroßes oder kleineres Ziel, wird das Ziel gepackt (Entkommen-SG 14), und der Hügel setzt sein Verschlingen gegen es ein.',
      ],
      [
        'Hieb',
        'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 13 (2W8 + 4) Wuchtschaden.',
      ],
      [
        'Verschlingen',
        'Der Hügel verschlingt eine mittelgroße oder kleinere Kreatur, die er gepackt hält. Das verschlungene Ziel ist blind, festgesetzt und kann nicht atmen, und es muss zu Beginn jedes Zuges des Hügels einen Konstitutionsrettungswurf mit SG 14 bestehen, sonst erleidet es 13 (2W8 + 4) Wuchtschaden. Bewegt sich der Hügel, bewegt sich das verschlungene Ziel mit ihm. Der Hügel kann jeweils nur eine Kreatur verschlungen haben.',
      ],
    ],
  },
  triceratops: {
    traits: [
      [
        'Niedertrampeln',
        'Bewegt sich der Triceratops mindestens 6 m geradlinig auf eine Kreatur zu und trifft sie dann im selben Zug mit einem Aufspießangriff, muss das Ziel einen Stärkerettungswurf mit SG 13 bestehen, sonst wird es zu Boden geworfen. Liegt das Ziel am Boden, kann der Triceratops als Bonusaktion einen Stampfangriff gegen es ausführen.',
      ],
    ],
    actions: [
      [
        'Aufspießen',
        'Nahkampf-Waffenangriff: +9 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 24 (4W8 + 6) Stichschaden.',
      ],
      [
        'Stampfen',
        'Nahkampf-Waffenangriff: +9 auf Treffer, Reichweite 1,5 m, eine liegende Kreatur. Treffer: 22 (3W10 + 6) Wuchtschaden.',
      ],
    ],
  },
  troll: {
    traits: [
      [
        'Scharfer Geruchssinn',
        'Der Troll ist bei Weisheitswürfen (Wahrnehmung), die auf dem Geruchssinn beruhen, im Vorteil.',
      ],
      [
        'Regeneration',
        'Der Troll erhält zu Beginn seines Zuges 10 Trefferpunkte zurück. Erleidet der Troll Säure- oder Feuerschaden, wirkt dieses Merkmal zu Beginn des nächsten Zuges des Trolls nicht. Der Troll stirbt nur, wenn er seinen Zug mit 0 Trefferpunkten beginnt und nicht regeneriert.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Troll führt drei Angriffe aus: einen mit seinem Biss und zwei mit seinen Klauen.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 7 (1W6 + 4) Stichschaden.',
      ],
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 11 (2W6 + 4) Hiebschaden.',
      ],
    ],
  },
  unicorn: {
    traits: [
      [
        'Sturmangriff',
        'Bewegt sich das Einhorn mindestens 6 m geradlinig auf ein Ziel zu und trifft es dann im selben Zug mit einem Hornangriff, erleidet das Ziel zusätzlich 9 (2W8) Stichschaden. Ist das Ziel eine Kreatur, muss es einen Stärkerettungswurf mit SG 15 bestehen, sonst wird es zu Boden geworfen.',
      ],
      [
        'Angeborenes Zauberwirken',
        'Das Attribut des Einhorns zum angeborenen Zauberwirken ist Charisma (Zauberrettungswurf-SG 14). Das Einhorn kann die folgenden Zauber angeboren wirken, ohne Komponenten zu benötigen:\nBeliebig oft: Gutes und Böses entdecken, Druidenkunst, Spurloses Gehen\nJe 1-mal täglich: Gefühle besänftigen, Gutes und Böses bannen, Verstricken',
      ],
      [
        'Magieresistenz',
        'Das Einhorn ist bei Rettungswürfen gegen Zauber und andere magische Effekte im Vorteil.',
      ],
      ['Magische Waffen', 'Die Waffenangriffe des Einhorns sind magisch.'],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Das Einhorn führt zwei Angriffe aus: einen mit seinen Hufen und einen mit seinem Horn.',
      ],
      [
        'Hufe',
        'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 11 (2W6 + 4) Wuchtschaden.',
      ],
      [
        'Horn',
        'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 8 (1W8 + 4) Stichschaden.',
      ],
      [
        'Heilende Berührung (3-mal täglich)',
        'Das Einhorn berührt eine andere Kreatur mit seinem Horn. Das Ziel erhält magisch 11 (2W8 + 2) Trefferpunkte zurück. Außerdem entfernt die Berührung alle Krankheiten und neutralisiert alle Gifte, die das Ziel befallen haben.',
      ],
      [
        'Teleportieren (1-mal täglich)',
        'Das Einhorn teleportiert sich magisch und bis zu drei bereitwillige Kreaturen, die es im Umkreis von 1,5 m sehen kann, samt der Ausrüstung, die sie tragen oder halten, an einen Ort, den das Einhorn kennt, bis zu 1,5 km weit.',
      ],
    ],
    legendary:
      'Das Einhorn kann 3 legendäre Aktionen ausführen und wählt dabei aus den unten aufgeführten Optionen. Es kann jeweils nur eine legendäre Aktion eingesetzt werden, und nur am Ende des Zuges einer anderen Kreatur. Das Einhorn erhält verbrauchte legendäre Aktionen zu Beginn seines Zuges zurück.',
    legendaryActions: [
      ['Hufe', 'Das Einhorn führt einen Angriff mit seinen Hufen aus.'],
      [
        'Schimmernder Schild (kostet 2 Aktionen)',
        'Das Einhorn erschafft ein schimmerndes, magisches Feld um sich selbst oder eine andere Kreatur, die es im Umkreis von 18 m sehen kann. Das Ziel erhält bis zum Ende des nächsten Zuges des Einhorns einen Bonus von +2 auf die RK.',
      ],
      [
        'Selbstheilung (kostet 3 Aktionen)',
        'Das Einhorn erhält magisch 11 (2W8 + 2) Trefferpunkte zurück.',
      ],
    ],
  },
  'vampire-spawn': {
    traits: [
      [
        'Regeneration',
        'Der Vampir erhält zu Beginn seines Zuges 10 Trefferpunkte zurück, sofern er mindestens 1 Trefferpunkt hat und sich nicht im Sonnenlicht oder in fließendem Wasser befindet. Erleidet der Vampir gleißenden Schaden oder Schaden durch Weihwasser, wirkt dieses Merkmal zu Beginn des nächsten Zuges des Vampirs nicht.',
      ],
      [
        'Spinnenklettern',
        'Der Vampir kann an schwierigen Oberflächen klettern, auch kopfüber an Decken, ohne einen Attributswurf ablegen zu müssen.',
      ],
      [
        'Schwächen des Vampirs',
        'Der Vampir hat folgende Schwächen:\nVerbot. Der Vampir kann einen Wohnsitz nicht ohne Einladung eines der Bewohner betreten.\nSchaden durch fließendes Wasser. Der Vampir erleidet 20 Säureschaden, wenn er seinen Zug in fließendem Wasser beendet.\nPfahl ins Herz. Der Vampir wird zerstört, wenn ihm eine Stichwaffe aus Holz ins Herz getrieben wird, während er an seiner Ruhestätte kampfunfähig ist.\nÜberempfindlichkeit gegen Sonnenlicht. Der Vampir erleidet 20 gleißenden Schaden, wenn er seinen Zug im Sonnenlicht beginnt. Im Sonnenlicht ist er bei Angriffswürfen und Attributswürfen im Nachteil.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Vampir führt zwei Angriffe aus, von denen nur einer ein Bissangriff sein kann.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 1,5 m, eine bereitwillige Kreatur oder eine Kreatur, die von dem Vampir gepackt wird, kampfunfähig oder festgesetzt ist. Treffer: 6 (1W6 + 3) Stichschaden plus 7 (2W6) nekrotischen Schaden. Das Trefferpunktemaximum des Ziels sinkt um den erlittenen nekrotischen Schaden, und der Vampir erhält Trefferpunkte in dieser Höhe zurück. Die Verringerung hält an, bis das Ziel eine lange Rast beendet. Das Ziel stirbt, wenn diese Wirkung sein Trefferpunktemaximum auf 0 senkt.',
      ],
      [
        'Klauen',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 1,5 m, eine Kreatur. Treffer: 8 (2W4 + 3) Hiebschaden. Statt Schaden zu verursachen, kann der Vampir das Ziel packen (Entkommen-SG 13).',
      ],
    ],
  },
  'water-elemental': {
    traits: [
      [
        'Wassergestalt',
        'Der Elementar kann den Bereich einer feindseligen Kreatur betreten und dort anhalten. Er kann sich durch einen Bereich bewegen, der nur 2,5 cm breit ist, ohne sich zwängen zu müssen.',
      ],
      [
        'Erstarren',
        'Erleidet der Elementar Kälteschaden, gefriert er teilweise; seine Bewegungsrate sinkt bis zum Ende seines nächsten Zuges um 6 m.',
      ],
    ],
    actions: [
      ['Mehrfachangriff', 'Der Elementar führt zwei Hiebangriffe aus.'],
      [
        'Hieb',
        'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 13 (2W8 + 4) Wuchtschaden.',
      ],
      [
        'Überspülen (Aufladung 4–6)',
        'Jede Kreatur im Bereich des Elementars muss einen Stärkerettungswurf mit SG 15 ablegen. Bei einem Misserfolg erleidet ein Ziel 13 (2W8 + 4) Wuchtschaden. Ist es groß oder kleiner, wird es außerdem gepackt (Entkommen-SG 14). Bis der Griff endet, ist das Ziel festgesetzt und kann nicht atmen, es sei denn, es kann Wasser atmen. Ist der Rettungswurf erfolgreich, wird das Ziel aus dem Bereich des Elementars gestoßen.\nDer Elementar kann gleichzeitig eine große Kreatur oder bis zu zwei mittelgroße oder kleinere Kreaturen gepackt halten. Zu Beginn jedes Zuges des Elementars erleidet jedes von ihm gepackte Ziel 13 (2W8 + 4) Wuchtschaden. Eine Kreatur im Umkreis von 1,5 m um den Elementar kann eine Kreatur oder einen Gegenstand aus ihm herausziehen, indem sie eine Aktion nutzt, um einen Stärkewurf gegen SG 14 abzulegen, und diesen besteht.',
      ],
    ],
  },
  'werebear-bear': {
    traits: [
      [
        'Gestaltwandler',
        'Der Werbär kann seine Aktion nutzen, um sich in eine große Bär-Humanoiden-Mischgestalt oder einen großen Bären zu verwandeln oder zurück in seine wahre, humanoide Gestalt. Seine Spielwerte sind bis auf Größe und RK in jeder Gestalt gleich. Ausrüstung, die er trägt oder hält, wird nicht verwandelt. Stirbt er, nimmt er wieder seine wahre Gestalt an.',
      ],
      [
        'Scharfer Geruchssinn',
        'Der Werbär ist bei Weisheitswürfen (Wahrnehmung), die auf dem Geruchssinn beruhen, im Vorteil.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'In Bärengestalt führt der Werbär zwei Klauenangriffe aus. In humanoider Gestalt führt er zwei Zweihandaxtangriffe aus. In Mischgestalt kann er wie ein Bär oder wie ein Humanoider angreifen.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 15 (2W10 + 4) Stichschaden. Ist das Ziel ein Humanoider, muss es einen Konstitutionsrettungswurf mit SG 14 bestehen, sonst wird es mit der Lykanthropie des Werbären verflucht.',
      ],
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 13 (2W8 + 4) Hiebschaden.',
      ],
    ],
  },
  'werebear-human': {
    traits: [
      [
        'Gestaltwandler',
        'Der Werbär kann seine Aktion nutzen, um sich in eine große Bär-Humanoiden-Mischgestalt oder einen großen Bären zu verwandeln oder zurück in seine wahre, humanoide Gestalt. Seine Spielwerte sind bis auf Größe und RK in jeder Gestalt gleich. Ausrüstung, die er trägt oder hält, wird nicht verwandelt. Stirbt er, nimmt er wieder seine wahre Gestalt an.',
      ],
      [
        'Scharfer Geruchssinn',
        'Der Werbär ist bei Weisheitswürfen (Wahrnehmung), die auf dem Geruchssinn beruhen, im Vorteil.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'In Bärengestalt führt der Werbär zwei Klauenangriffe aus. In humanoider Gestalt führt er zwei Zweihandaxtangriffe aus. In Mischgestalt kann er wie ein Bär oder wie ein Humanoider angreifen.',
      ],
      [
        'Zweihandaxt',
        'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 10 (1W12 + 4) Hiebschaden.',
      ],
    ],
  },
  'werebear-hybrid': {
    traits: [
      [
        'Gestaltwandler',
        'Der Werbär kann seine Aktion nutzen, um sich in eine große Bär-Humanoiden-Mischgestalt oder einen großen Bären zu verwandeln oder zurück in seine wahre, humanoide Gestalt. Seine Spielwerte sind bis auf Größe und RK in jeder Gestalt gleich. Ausrüstung, die er trägt oder hält, wird nicht verwandelt. Stirbt er, nimmt er wieder seine wahre Gestalt an.',
      ],
      [
        'Scharfer Geruchssinn',
        'Der Werbär ist bei Weisheitswürfen (Wahrnehmung), die auf dem Geruchssinn beruhen, im Vorteil.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'In Bärengestalt führt der Werbär zwei Klauenangriffe aus. In humanoider Gestalt führt er zwei Zweihandaxtangriffe aus. In Mischgestalt kann er wie ein Bär oder wie ein Humanoider angreifen.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 15 (2W10 + 4) Stichschaden. Ist das Ziel ein Humanoider, muss es einen Konstitutionsrettungswurf mit SG 14 bestehen, sonst wird es mit der Lykanthropie des Werbären verflucht.',
      ],
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 13 (2W8 + 4) Hiebschaden.',
      ],
      [
        'Zweihandaxt',
        'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 10 (1W12 + 4) Hiebschaden.',
      ],
    ],
  },
  wraith: {
    traits: [
      [
        'Körperlose Bewegung',
        'Der Todesalb kann sich durch andere Kreaturen und Gegenstände bewegen, als wären sie schwieriges Gelände. Beendet er seinen Zug in einem Gegenstand, erleidet er 5 (1W10) Energieschaden.',
      ],
      [
        'Sonnenlichtempfindlichkeit',
        'Im Sonnenlicht ist der Todesalb bei Angriffswürfen sowie bei Weisheitswürfen (Wahrnehmung), die auf der Sicht beruhen, im Nachteil.',
      ],
    ],
    actions: [
      [
        'Lebensentzug',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 1,5 m, eine Kreatur. Treffer: 21 (4W8 + 3) nekrotischen Schaden. Das Ziel muss einen Konstitutionsrettungswurf mit SG 14 bestehen, sonst sinkt sein Trefferpunktemaximum um den erlittenen Schaden. Diese Verringerung hält an, bis das Ziel eine lange Rast beendet. Das Ziel stirbt, wenn diese Wirkung sein Trefferpunktemaximum auf 0 senkt.',
      ],
      [
        'Gespenst erschaffen',
        'Der Todesalb wählt einen Humanoiden im Umkreis von 3 m als Ziel, der seit höchstens 1 Minute tot ist und eines gewaltsamen Todes gestorben ist. Der Geist des Ziels erhebt sich als Gespenst im Bereich seines Leichnams oder im nächstgelegenen freien Bereich. Das Gespenst steht unter der Kontrolle des Todesalbs. Der Todesalb kann gleichzeitig höchstens sieben Gespenster unter seiner Kontrolle haben.',
      ],
    ],
  },
  xorn: {
    traits: [
      [
        'Erdgleiten',
        'Der Xorn kann sich durch nichtmagische, unbearbeitete Erde und Stein graben. Dabei stört der Xorn das Material, durch das er sich bewegt, nicht.',
      ],
      [
        'Steintarnung',
        'Der Xorn ist bei Geschicklichkeitswürfen (Heimlichkeit), um sich in felsigem Gelände zu verstecken, im Vorteil.',
      ],
      [
        'Schatzgespür',
        'Der Xorn kann den Aufenthaltsort von Edelmetallen und Edelsteinen wie Münzen und Juwelen im Umkreis von 18 m durch Witterung genau bestimmen.',
      ],
    ],
    actions: [
      ['Mehrfachangriff', 'Der Xorn führt drei Klauenangriffe und einen Bissangriff aus.'],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 13 (3W6 + 3) Stichschaden.',
      ],
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 6 (1W6 + 3) Hiebschaden.',
      ],
    ],
  },
};
