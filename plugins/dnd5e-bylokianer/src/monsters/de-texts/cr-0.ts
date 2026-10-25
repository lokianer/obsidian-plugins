// German texts of the SRD monsters of challenge ratings 0 to 1/2: traits, actions, reactions and legendary
// actions. Our own translation of the SRD 5.1, CC-BY-4.0 (see NOTICE.md).

import type { DeMonsterText } from '../model';

export const DE_TEXTS_CR0: Readonly<Record<string, DeMonsterText>> = {
  acolyte: {
    traits: [
      [
        'Zauberwirken',
        'Der Akolyth ist ein Zauberwirker der 1. Stufe. Sein Attribut zum Zauberwirken ist Weisheit (Zauberrettungswurf-SG 12, +4 auf Treffer mit Zauberangriffen). Der Akolyth hat folgende Klerikerzauber vorbereitet:\n\n- Zaubertricks (beliebig oft): Licht, Heilige Flamme, Thaumaturgie\n- 1. Grad (3 Plätze): Segnen, Wunden heilen, Heiligtum',
      ],
    ],
    actions: [
      [
        'Knüppel',
        'Nahkampf-Waffenangriff: +2 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 2 (1W4) Wuchtschaden.',
      ],
    ],
  },
  ape: {
    actions: [
      ['Mehrfachangriff', 'Der Affe führt zwei Faustangriffe aus.'],
      [
        'Faust',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 6 (1W6 + 3) Wuchtschaden.',
      ],
      [
        'Fels',
        'Fernkampf-Waffenangriff: +5 auf Treffer, Reichweite 7,5/15 m, ein Ziel. Treffer: 6 (1W6 + 3) Wuchtschaden.',
      ],
    ],
  },
  'awakened-shrub': {
    traits: [
      [
        'Falsches Erscheinungsbild',
        'Solange der Strauch sich nicht bewegt, ist er nicht von einem gewöhnlichen Strauch zu unterscheiden.',
      ],
    ],
    actions: [
      [
        'Kratzen',
        'Nahkampf-Waffenangriff: +1 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 1 (1W4 − 1) Hiebschaden.',
      ],
    ],
  },
  'axe-beak': {
    actions: [
      [
        'Schnabel',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 6 (1W8 + 2) Hiebschaden.',
      ],
    ],
  },
  baboon: {
    traits: [
      [
        'Rudeltaktik',
        'Der Pavian ist bei Angriffswürfen gegen eine Kreatur im Vorteil, wenn sich mindestens ein nicht kampfunfähiger Verbündeter des Pavians im Umkreis von 1,5 m um die Kreatur befindet.',
      ],
    ],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +1 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 1 (1W4 − 1) Stichschaden.',
      ],
    ],
  },
  badger: {
    traits: [
      [
        'Scharfer Geruchssinn',
        'Der Dachs ist bei Weisheitswürfen (Wahrnehmung), die auf dem Geruchssinn beruhen, im Vorteil.',
      ],
    ],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +2 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 1 Stichschaden.',
      ],
    ],
  },
  bandit: {
    actions: [
      [
        'Krummsäbel',
        'Nahkampf-Waffenangriff: +3 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 4 (1W6 + 1) Hiebschaden.',
      ],
      [
        'Leichte Armbrust',
        'Fernkampf-Waffenangriff: +3 auf Treffer, Reichweite 24/96 m, ein Ziel. Treffer: 5 (1W8 + 1) Stichschaden.',
      ],
    ],
  },
  bat: {
    traits: [
      ['Echoortung', 'Die Fledermaus kann ihre Blindsicht nicht nutzen, solange sie taub ist.'],
      [
        'Scharfes Gehör',
        'Die Fledermaus ist bei Weisheitswürfen (Wahrnehmung), die auf dem Gehör beruhen, im Vorteil.',
      ],
    ],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +0 auf Treffer, Reichweite 1,5 m, eine Kreatur. Treffer: 1 Stichschaden.',
      ],
    ],
  },
  'black-bear': {
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
        'Nahkampf-Waffenangriff: +3 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 5 (1W6 + 2) Stichschaden.',
      ],
      [
        'Klauen',
        'Nahkampf-Waffenangriff: +3 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 7 (2W4 + 2) Hiebschaden.',
      ],
    ],
  },
  'blink-dog': {
    traits: [
      [
        'Scharfes Gehör und scharfer Geruchssinn',
        'Der Hund ist bei Weisheitswürfen (Wahrnehmung), die auf dem Gehör oder dem Geruchssinn beruhen, im Vorteil.',
      ],
    ],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +3 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 4 (1W6 + 1) Stichschaden.',
      ],
      [
        'Teleportieren (Aufladung 4–6)',
        'Der Hund teleportiert sich magisch samt der Ausrüstung, die er trägt oder hält, bis zu 12 m weit in einen freien Bereich, den er sehen kann. Vor oder nach dem Teleportieren kann der Hund einen Bissangriff ausführen.',
      ],
    ],
  },
  'blood-hawk': {
    traits: [
      [
        'Scharfe Sicht',
        'Der Falke ist bei Weisheitswürfen (Wahrnehmung), die auf der Sicht beruhen, im Vorteil.',
      ],
      [
        'Rudeltaktik',
        'Der Falke ist bei Angriffswürfen gegen eine Kreatur im Vorteil, wenn sich mindestens ein nicht kampfunfähiger Verbündeter des Falken im Umkreis von 1,5 m um die Kreatur befindet.',
      ],
    ],
    actions: [
      [
        'Schnabel',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 4 (1W4 + 2) Stichschaden.',
      ],
    ],
  },
  boar: {
    traits: [
      [
        'Sturmangriff',
        'Bewegt sich das Wildschwein mindestens 6 m geradlinig auf ein Ziel zu und trifft es dann im selben Zug mit einem Hauerangriff, erleidet das Ziel zusätzlich 3 (1W6) Hiebschaden. Ist das Ziel eine Kreatur, muss es einen Stärkerettungswurf mit SG 11 bestehen, sonst wird es zu Boden geworfen.',
      ],
      [
        'Unerbittlich (Aufladung nach einer kurzen oder langen Rast)',
        'Erleidet das Wildschwein 7 oder weniger Schaden, der seine Trefferpunkte auf 0 senken würde, sinken sie stattdessen auf 1.',
      ],
    ],
    actions: [
      [
        'Hauer',
        'Nahkampf-Waffenangriff: +3 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 4 (1W6 + 1) Hiebschaden.',
      ],
    ],
  },
  camel: {
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 2 (1W4) Wuchtschaden.',
      ],
    ],
  },
  cat: {
    traits: [
      [
        'Scharfer Geruchssinn',
        'Die Katze ist bei Weisheitswürfen (Wahrnehmung), die auf dem Geruchssinn beruhen, im Vorteil.',
      ],
    ],
    actions: [
      [
        'Klauen',
        'Nahkampf-Waffenangriff: +0 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 1 Hiebschaden.',
      ],
    ],
  },
  cockatrice: {
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +3 auf Treffer, Reichweite 1,5 m, eine Kreatur. Treffer: 3 (1W4 + 1) Stichschaden, und das Ziel muss einen Konstitutionsrettungswurf mit SG 11 bestehen, um nicht magisch versteinert zu werden. Bei einem Misserfolg beginnt die Kreatur zu Stein zu werden und ist festgesetzt. Sie muss den Rettungswurf am Ende ihres nächsten Zuges wiederholen. Bei einem Erfolg endet die Wirkung. Bei einem Misserfolg ist die Kreatur 24 Stunden lang versteinert.',
      ],
    ],
  },
  commoner: {
    actions: [
      [
        'Knüppel',
        'Nahkampf-Waffenangriff: +2 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 2 (1W4) Wuchtschaden.',
      ],
    ],
  },
  'constrictor-snake': {
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, eine Kreatur. Treffer: 5 (1W6 + 2) Stichschaden.',
      ],
      [
        'Würgen',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, eine Kreatur. Treffer: 6 (1W8 + 2) Wuchtschaden, und das Ziel wird gepackt (Entkommen-SG 14). Bis der Griff endet, ist die Kreatur festgesetzt, und die Schlange kann kein anderes Ziel würgen.',
      ],
    ],
  },
  crab: {
    traits: [['Amphibisch', 'Die Krabbe kann Luft und Wasser atmen.']],
    actions: [
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +0 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 1 Wuchtschaden.',
      ],
    ],
  },
  crocodile: {
    traits: [['Atem anhalten', 'Das Krokodil kann 15 Minuten lang den Atem anhalten.']],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, eine Kreatur. Treffer: 7 (1W10 + 2) Stichschaden, und das Ziel wird gepackt (Entkommen-SG 12). Bis der Griff endet, ist das Ziel festgesetzt, und das Krokodil kann kein anderes Ziel beißen.',
      ],
    ],
  },
  cultist: {
    traits: [
      [
        'Dunkle Hingabe',
        'Der Kultist ist bei Rettungswürfen gegen Bezauberung und Furcht im Vorteil.',
      ],
    ],
    actions: [
      [
        'Krummsäbel',
        'Nahkampf-Waffenangriff: +3 auf Treffer, Reichweite 1,5 m, eine Kreatur. Treffer: 4 (1W6 + 1) Hiebschaden.',
      ],
    ],
  },
  darkmantle: {
    traits: [
      ['Echoortung', 'Der Dunkelmantel kann seine Blindsicht nicht nutzen, solange er taub ist.'],
      [
        'Falsches Erscheinungsbild',
        'Solange der Dunkelmantel sich nicht bewegt, ist er nicht von einer Höhlenformation wie einem Stalaktiten oder Stalagmiten zu unterscheiden.',
      ],
    ],
    actions: [
      [
        'Zermalmen',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, eine Kreatur. Treffer: 6 (1W6 + 3) Wuchtschaden, und der Dunkelmantel heftet sich an das Ziel. Ist das Ziel mittelgroß oder kleiner und der Dunkelmantel beim Angriffswurf im Vorteil, heftet er sich an, indem er den Kopf des Ziels umhüllt, und das Ziel ist außerdem blind und kann nicht atmen, solange der Dunkelmantel auf diese Weise an ihm haftet.\nSolange er am Ziel haftet, kann der Dunkelmantel keine andere Kreatur als das Ziel angreifen, ist bei seinen Angriffswürfen aber im Vorteil. Außerdem sinkt die Bewegungsrate des Dunkelmantels auf 0, er kann von keinem Bonus auf seine Bewegungsrate profitieren und bewegt sich mit dem Ziel.\nEine Kreatur kann den Dunkelmantel als Aktion mit einem erfolgreichen Stärkewurf gegen SG 13 lösen. In seinem Zug kann der Dunkelmantel sich vom Ziel lösen, indem er 1,5 m Bewegung aufwendet.',
      ],
      [
        'Aura der Dunkelheit (1-mal täglich)',
        'Magische Dunkelheit breitet sich in einem Radius von 4,5 m um den Dunkelmantel aus, bewegt sich mit ihm und reicht um Ecken. Die Dunkelheit hält an, solange der Dunkelmantel sich konzentriert, bis zu 10 Minuten (als würde er sich auf einen Zauber konzentrieren). Dunkelsicht kann diese Dunkelheit nicht durchdringen, und kein natürliches Licht kann sie erhellen. Überschneidet sich ein Teil der Dunkelheit mit einem Lichtbereich, der durch einen Zauber des 2. Grades oder niedriger erzeugt wurde, wird der Zauber, der das Licht erzeugt, gebannt.',
      ],
    ],
  },
  'deep-gnome-svirfneblin': {
    traits: [
      [
        'Steintarnung',
        'Der Gnom ist bei Geschicklichkeitswürfen (Heimlichkeit), um sich in felsigem Gelände zu verstecken, im Vorteil.',
      ],
      [
        'Gnomische Gerissenheit',
        'Der Gnom ist bei Intelligenz-, Weisheits- und Charismarettungswürfen gegen Magie im Vorteil.',
      ],
      [
        'Angeborenes Zauberwirken',
        'Das Attribut des Gnomen zum angeborenen Zauberwirken ist Intelligenz (Zauberrettungswurf-SG 11). Er kann die folgenden Zauber angeboren wirken, ohne Materialkomponenten zu benötigen:\nBeliebig oft: Unauffindbarkeit (nur selbst)\nJe 1-mal täglich: Blindheit/Taubheit, Verschwimmen, Selbstverkleidung',
      ],
    ],
    actions: [
      [
        'Kriegspicke',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 6 (1W8 + 2) Stichschaden.',
      ],
      [
        'Giftpfeil',
        'Fernkampf-Waffenangriff: +4 auf Treffer, Reichweite 9/36 m, eine Kreatur. Treffer: 4 (1W4 + 2) Stichschaden, und das Ziel muss einen Konstitutionsrettungswurf mit SG 12 bestehen, sonst ist es 1 Minute lang vergiftet. Das Ziel kann den Rettungswurf am Ende jedes seiner Züge wiederholen und beendet die Wirkung bei einem Erfolg für sich.',
      ],
    ],
  },
  deer: {
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +2 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 2 (1W4) Stichschaden.',
      ],
    ],
  },
  'draft-horse': {
    actions: [
      [
        'Hufe',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 9 (2W4 + 4) Wuchtschaden.',
      ],
    ],
  },
  dretch: {
    actions: [
      [
        'Mehrfachangriff',
        'Der Dretch führt zwei Angriffe aus: einen mit seinem Biss und einen mit seinen Klauen.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +2 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 3 (1W6) Stichschaden.',
      ],
      [
        'Klauen',
        'Nahkampf-Waffenangriff: +2 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 5 (2W4) Hiebschaden.',
      ],
      [
        'Stinkende Wolke (1-mal täglich)',
        'Ekelhaftes grünes Gas breitet sich in einem Radius von 3 m um den Dretch aus. Das Gas reicht um Ecken, und sein Bereich ist leicht verschleiert. Es hält 1 Minute lang an oder bis ein starker Wind es zerstreut. Jede Kreatur, die ihren Zug in diesem Bereich beginnt, muss einen Konstitutionsrettungswurf mit SG 11 bestehen, sonst ist sie bis zum Beginn ihres nächsten Zuges vergiftet. Solange das Ziel auf diese Weise vergiftet ist, kann es in seinem Zug entweder eine Aktion oder eine Bonusaktion nutzen, nicht beides, und keine Reaktionen ausführen.',
      ],
    ],
  },
  drow: {
    traits: [
      [
        'Feenblut',
        'Der Drow ist bei Rettungswürfen gegen Bezauberung im Vorteil, und Magie kann den Drow nicht in Schlaf versetzen.',
      ],
      [
        'Angeborenes Zauberwirken',
        'Das Attribut des Drows zum Zauberwirken ist Charisma (Zauberrettungswurf-SG 11). Er kann die folgenden Zauber angeboren wirken, ohne Materialkomponenten zu benötigen:\nBeliebig oft: Tanzende Lichter\nJe 1-mal täglich: Dunkelheit, Feenfeuer',
      ],
      [
        'Sonnenlichtempfindlichkeit',
        'Im Sonnenlicht ist der Drow bei Angriffswürfen sowie bei Weisheitswürfen (Wahrnehmung), die auf der Sicht beruhen, im Nachteil.',
      ],
    ],
    actions: [
      [
        'Kurzschwert',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 5 (1W6 + 2) Stichschaden.',
      ],
      [
        'Handarmbrust',
        'Fernkampf-Waffenangriff: +4 auf Treffer, Reichweite 9/36 m, ein Ziel. Treffer: 5 (1W6 + 2) Stichschaden, und das Ziel muss einen Konstitutionsrettungswurf mit SG 13 bestehen, sonst ist es 1 Stunde lang vergiftet. Misslingt der Rettungswurf um 5 oder mehr, ist das Ziel außerdem bewusstlos, solange es auf diese Weise vergiftet ist. Das Ziel wacht auf, wenn es Schaden erleidet oder eine andere Kreatur eine Aktion nutzt, um es wachzurütteln.',
      ],
    ],
  },
  'dust-mephit': {
    traits: [
      [
        'Todesexplosion',
        'Stirbt der Mephit, explodiert er in einer Staubwolke. Jede Kreatur im Umkreis von 1,5 m um ihn muss dann einen Konstitutionsrettungswurf mit SG 10 bestehen, sonst ist sie 1 Minute lang blind. Eine blinde Kreatur kann den Rettungswurf in jedem ihrer Züge wiederholen und beendet die Wirkung bei einem Erfolg für sich.',
      ],
      [
        'Angeborenes Zauberwirken',
        'Der Mephit kann den Zauber Schlaf angeboren wirken, ohne Materialkomponenten zu benötigen. Sein Attribut zum angeborenen Zauberwirken ist Charisma.',
      ],
    ],
    actions: [
      [
        'Klauen',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, eine Kreatur. Treffer: 4 (1W4 + 2) Hiebschaden.',
      ],
      [
        'Blendender Odem (Aufladung 6)',
        'Der Mephit atmet einen 4,5-m-Kegel aus blendendem Staub aus. Jede Kreatur in diesem Bereich muss einen Geschicklichkeitsrettungswurf mit SG 10 bestehen, sonst ist sie 1 Minute lang blind. Eine Kreatur kann den Rettungswurf am Ende jedes ihrer Züge wiederholen und beendet die Wirkung bei einem Erfolg für sich.',
      ],
    ],
  },
  eagle: {
    traits: [
      [
        'Scharfe Sicht',
        'Der Adler ist bei Weisheitswürfen (Wahrnehmung), die auf der Sicht beruhen, im Vorteil.',
      ],
    ],
    actions: [
      [
        'Krallen',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 4 (1W4 + 2) Hiebschaden.',
      ],
    ],
  },
  elk: {
    traits: [
      [
        'Sturmangriff',
        'Bewegt sich der Elch mindestens 6 m geradlinig auf ein Ziel zu und trifft es dann im selben Zug mit einem Rammangriff, erleidet das Ziel zusätzlich 7 (2W6) Schaden. Ist das Ziel eine Kreatur, muss es einen Stärkerettungswurf mit SG 13 bestehen, sonst wird es zu Boden geworfen.',
      ],
    ],
    actions: [
      [
        'Rammen',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 6 (1W6 + 3) Wuchtschaden.',
      ],
      [
        'Hufe',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, eine liegende Kreatur. Treffer: 8 (2W4 + 3) Wuchtschaden.',
      ],
    ],
  },
  'flying-snake': {
    traits: [
      [
        'Vorbeifliegen',
        'Die Schlange provoziert keine Gelegenheitsangriffe, wenn sie aus der Reichweite eines Feindes fliegt.',
      ],
    ],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 1 Stichschaden plus 7 (3W4) Giftschaden.',
      ],
    ],
  },
  'flying-sword': {
    traits: [
      [
        'Antimagie-Anfälligkeit',
        'Im Bereich eines Antimagiefelds ist das Schwert kampfunfähig. Wird es zum Ziel von Magie bannen, muss es einen Konstitutionsrettungswurf gegen den Zauberrettungswurf-SG des Zaubernden bestehen, sonst wird es für 1 Minute bewusstlos.',
      ],
      [
        'Falsches Erscheinungsbild',
        'Solange das Schwert sich nicht bewegt und nicht fliegt, ist es nicht von einem gewöhnlichen Schwert zu unterscheiden.',
      ],
    ],
    actions: [
      [
        'Langschwert',
        'Nahkampf-Waffenangriff: +3 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 5 (1W8 + 1) Hiebschaden.',
      ],
    ],
  },
  frog: {
    traits: [
      ['Amphibisch', 'Der Frosch kann Luft und Wasser atmen.'],
      [
        'Sprung aus dem Stand',
        'Der Weitsprung des Frosches reicht bis zu 3 m, sein Hochsprung bis zu 1,5 m, mit oder ohne Anlauf.',
      ],
    ],
  },
  'giant-badger': {
    traits: [
      [
        'Scharfer Geruchssinn',
        'Der Dachs ist bei Weisheitswürfen (Wahrnehmung), die auf dem Geruchssinn beruhen, im Vorteil.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Dachs führt zwei Angriffe aus: einen mit seinem Biss und einen mit seinen Klauen.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +3 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 4 (1W6 + 1) Stichschaden.',
      ],
      [
        'Klauen',
        'Nahkampf-Waffenangriff: +3 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 6 (2W4 + 1) Hiebschaden.',
      ],
    ],
  },
  'giant-bat': {
    traits: [
      ['Echoortung', 'Die Fledermaus kann ihre Blindsicht nicht nutzen, solange sie taub ist.'],
      [
        'Scharfes Gehör',
        'Die Fledermaus ist bei Weisheitswürfen (Wahrnehmung), die auf dem Gehör beruhen, im Vorteil.',
      ],
    ],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, eine Kreatur. Treffer: 5 (1W6 + 2) Stichschaden.',
      ],
    ],
  },
  'giant-centipede': {
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, eine Kreatur. Treffer: 4 (1W4 + 2) Stichschaden, und das Ziel muss einen Konstitutionsrettungswurf mit SG 11 bestehen, sonst erleidet es 10 (3W6) Giftschaden. Senkt der Giftschaden das Ziel auf 0 Trefferpunkte, ist das Ziel stabil, aber 1 Stunde lang vergiftet, selbst nachdem es Trefferpunkte zurückerhalten hat, und solange es auf diese Weise vergiftet ist, ist es gelähmt.',
      ],
    ],
  },
  'giant-crab': {
    traits: [['Amphibisch', 'Die Krabbe kann Luft und Wasser atmen.']],
    actions: [
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +3 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 4 (1W6 + 1) Wuchtschaden, und das Ziel wird gepackt (Entkommen-SG 11). Die Krabbe hat zwei Scheren, von denen jede nur ein Ziel packen kann.',
      ],
    ],
  },
  'giant-fire-beetle': {
    traits: [
      [
        'Leuchten',
        'Der Käfer verbreitet helles Licht in einem Radius von 3 m und dämmriges Licht für weitere 3 m.',
      ],
    ],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +1 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 2 (1W6 − 1) Hiebschaden.',
      ],
    ],
  },
  'giant-frog': {
    traits: [
      ['Amphibisch', 'Der Frosch kann Luft und Wasser atmen.'],
      [
        'Sprung aus dem Stand',
        'Der Weitsprung des Frosches reicht bis zu 6 m, sein Hochsprung bis zu 3 m, mit oder ohne Anlauf.',
      ],
    ],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +3 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 4 (1W6 + 1) Stichschaden, und das Ziel wird gepackt (Entkommen-SG 11). Bis der Griff endet, ist das Ziel festgesetzt, und der Frosch kann kein anderes Ziel beißen.',
      ],
      [
        'Verschlucken',
        'Der Frosch führt einen Bissangriff gegen ein kleines oder winziges Ziel aus, das er gepackt hält. Trifft der Angriff, wird das Ziel verschluckt, und der Griff endet. Das verschluckte Ziel ist blind und festgesetzt, hat vollständige Deckung gegen Angriffe und andere Effekte von außerhalb des Frosches und erleidet zu Beginn jedes Zuges des Frosches 5 (2W4) Säureschaden. Der Frosch kann jeweils nur ein Ziel verschluckt haben. Stirbt der Frosch, ist eine verschluckte Kreatur nicht länger festgesetzt und kann mit 1,5 m Bewegung aus dem Kadaver entkommen; sie liegt danach am Boden.',
      ],
    ],
  },
  'giant-goat': {
    traits: [
      [
        'Sturmangriff',
        'Bewegt sich die Ziege mindestens 6 m geradlinig auf ein Ziel zu und trifft es dann im selben Zug mit einem Rammangriff, erleidet das Ziel zusätzlich 5 (2W4) Wuchtschaden. Ist das Ziel eine Kreatur, muss es einen Stärkerettungswurf mit SG 13 bestehen, sonst wird es zu Boden geworfen.',
      ],
      [
        'Trittsicher',
        'Die Ziege ist bei Stärke- und Geschicklichkeitsrettungswürfen gegen Effekte, die sie zu Boden werfen würden, im Vorteil.',
      ],
    ],
    actions: [
      [
        'Rammen',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 8 (2W4 + 3) Wuchtschaden.',
      ],
    ],
  },
  'giant-lizard': {
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 6 (1W8 + 2) Stichschaden.',
      ],
    ],
  },
  'giant-owl': {
    traits: [
      [
        'Vorbeifliegen',
        'Die Eule provoziert keine Gelegenheitsangriffe, wenn sie aus der Reichweite eines Feindes fliegt.',
      ],
      [
        'Scharfes Gehör und scharfe Sicht',
        'Die Eule ist bei Weisheitswürfen (Wahrnehmung), die auf dem Gehör oder der Sicht beruhen, im Vorteil.',
      ],
    ],
    actions: [
      [
        'Krallen',
        'Nahkampf-Waffenangriff: +3 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 8 (2W6 + 1) Hiebschaden.',
      ],
    ],
  },
  'giant-poisonous-snake': {
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 3 m, ein Ziel. Treffer: 6 (1W4 + 4) Stichschaden, und das Ziel muss einen Konstitutionsrettungswurf mit SG 11 ablegen. Bei einem Misserfolg erleidet es 10 (3W6) Giftschaden, bei einem Erfolg die Hälfte.',
      ],
    ],
  },
  'giant-rat': {
    traits: [
      [
        'Scharfer Geruchssinn',
        'Die Ratte ist bei Weisheitswürfen (Wahrnehmung), die auf dem Geruchssinn beruhen, im Vorteil.',
      ],
      [
        'Rudeltaktik',
        'Die Ratte ist bei Angriffswürfen gegen eine Kreatur im Vorteil, wenn sich mindestens ein nicht kampfunfähiger Verbündeter der Ratte im Umkreis von 1,5 m um die Kreatur befindet.',
      ],
    ],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 4 (1W4 + 2) Stichschaden.',
      ],
    ],
  },
  'giant-rat-diseased': {
    traits: [
      [
        'Scharfer Geruchssinn',
        'Die Ratte ist bei Weisheitswürfen (Wahrnehmung), die auf dem Geruchssinn beruhen, im Vorteil.',
      ],
      [
        'Rudeltaktik',
        'Die Ratte ist bei Angriffswürfen gegen eine Kreatur im Vorteil, wenn sich mindestens ein nicht kampfunfähiger Verbündeter der Ratte im Umkreis von 1,5 m um die Kreatur befindet.',
      ],
    ],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 3 (1W4 + 2) Stichschaden. Ist das Ziel eine Kreatur, muss es einen Konstitutionsrettungswurf mit SG 10 bestehen, sonst steckt es sich mit einer Krankheit an. Bis die Krankheit geheilt ist, kann das Ziel nur auf magische Weise Trefferpunkte zurückerhalten, und sein Trefferpunktemaximum sinkt alle 24 Stunden um 3 (1W6). Sinkt das Trefferpunktemaximum des Ziels durch diese Krankheit auf 0, stirbt das Ziel.',
      ],
    ],
  },
  'giant-sea-horse': {
    traits: [
      [
        'Sturmangriff',
        'Bewegt sich das Seepferdchen mindestens 6 m geradlinig auf ein Ziel zu und trifft es dann im selben Zug mit einem Rammangriff, erleidet das Ziel zusätzlich 7 (2W6) Wuchtschaden. Ist das Ziel eine Kreatur, muss es einen Stärkerettungswurf mit SG 11 bestehen, sonst wird es zu Boden geworfen.',
      ],
      ['Wasseratmung', 'Das Seepferdchen kann nur unter Wasser atmen.'],
    ],
    actions: [
      [
        'Rammen',
        'Nahkampf-Waffenangriff: +3 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 4 (1W6 + 1) Wuchtschaden.',
      ],
    ],
  },
  'giant-wasp': {
    actions: [
      [
        'Stachel',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, eine Kreatur. Treffer: 5 (1W6 + 2) Stichschaden, und das Ziel muss einen Konstitutionsrettungswurf mit SG 11 ablegen. Bei einem Misserfolg erleidet es 10 (3W6) Giftschaden, bei einem Erfolg die Hälfte. Senkt der Giftschaden das Ziel auf 0 Trefferpunkte, ist das Ziel stabil, aber 1 Stunde lang vergiftet, selbst nachdem es Trefferpunkte zurückerhalten hat, und solange es auf diese Weise vergiftet ist, ist es gelähmt.',
      ],
    ],
  },
  'giant-weasel': {
    traits: [
      [
        'Scharfes Gehör und scharfer Geruchssinn',
        'Das Wiesel ist bei Weisheitswürfen (Wahrnehmung), die auf dem Gehör oder dem Geruchssinn beruhen, im Vorteil.',
      ],
    ],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 5 (1W4 + 3) Stichschaden.',
      ],
    ],
  },
  'giant-wolf-spider': {
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
        'Nahkampf-Waffenangriff: +3 auf Treffer, Reichweite 1,5 m, eine Kreatur. Treffer: 4 (1W6 + 1) Stichschaden, und das Ziel muss einen Konstitutionsrettungswurf mit SG 11 ablegen. Bei einem Misserfolg erleidet es 7 (2W6) Giftschaden, bei einem Erfolg die Hälfte. Senkt der Giftschaden das Ziel auf 0 Trefferpunkte, ist das Ziel stabil, aber 1 Stunde lang vergiftet, selbst nachdem es Trefferpunkte zurückerhalten hat, und solange es auf diese Weise vergiftet ist, ist es gelähmt.',
      ],
    ],
  },
  gnoll: {
    traits: [
      [
        'Amoklauf',
        'Senkt der Gnoll in seinem Zug eine Kreatur mit einem Nahkampfangriff auf 0 Trefferpunkte, kann der Gnoll eine Bonusaktion nutzen, um sich bis zur Hälfte seiner Bewegungsrate zu bewegen und einen Bissangriff auszuführen.',
      ],
    ],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, eine Kreatur. Treffer: 4 (1W4 + 2) Stichschaden.',
      ],
      [
        'Speer',
        'Nah- oder Fernkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m oder Reichweite 6/18 m, ein Ziel. Treffer: 5 (1W6 + 2) Stichschaden, oder 6 (1W8 + 2) Stichschaden, wenn mit zwei Händen geführt.',
      ],
      [
        'Langbogen',
        'Fernkampf-Waffenangriff: +3 auf Treffer, Reichweite 45/180 m, ein Ziel. Treffer: 5 (1W8 + 1) Stichschaden.',
      ],
    ],
  },
  goat: {
    traits: [
      [
        'Sturmangriff',
        'Bewegt sich die Ziege mindestens 6 m geradlinig auf ein Ziel zu und trifft es dann im selben Zug mit einem Rammangriff, erleidet das Ziel zusätzlich 2 (1W4) Wuchtschaden. Ist das Ziel eine Kreatur, muss es einen Stärkerettungswurf mit SG 10 bestehen, sonst wird es zu Boden geworfen.',
      ],
      [
        'Trittsicher',
        'Die Ziege ist bei Stärke- und Geschicklichkeitsrettungswürfen gegen Effekte, die sie zu Boden werfen würden, im Vorteil.',
      ],
    ],
    actions: [
      [
        'Rammen',
        'Nahkampf-Waffenangriff: +3 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 3 (1W4 + 1) Wuchtschaden.',
      ],
    ],
  },
  goblin: {
    traits: [
      [
        'Flinke Flucht',
        'Der Goblin kann in jedem seiner Züge die Aktion Lösen oder Verstecken als Bonusaktion ausführen.',
      ],
    ],
    actions: [
      [
        'Krummsäbel',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 5 (1W6 + 2) Hiebschaden.',
      ],
      [
        'Kurzbogen',
        'Fernkampf-Waffenangriff: +4 auf Treffer, Reichweite 24/96 m, ein Ziel. Treffer: 5 (1W6 + 2) Stichschaden.',
      ],
    ],
  },
  'gray-ooze': {
    traits: [
      [
        'Amorph',
        'Der Schleim kann sich durch einen Bereich bewegen, der nur 2,5 cm breit ist, ohne sich zwängen zu müssen.',
      ],
      [
        'Metall zersetzen',
        'Jede nichtmagische Waffe aus Metall, die den Schleim trifft, wird zersetzt. Nachdem sie Schaden verursacht hat, erhält die Waffe einen dauerhaften, kumulativen Malus von −1 auf Schadenswürfe. Sinkt ihr Malus auf −5, ist die Waffe zerstört. Nichtmagische Munition aus Metall, die den Schleim trifft, wird zerstört, nachdem sie Schaden verursacht hat.\nDer Schleim kann sich in 1 Runde durch 5 cm dickes nichtmagisches Metall fressen.',
      ],
      [
        'Falsches Erscheinungsbild',
        'Solange der Schleim sich nicht bewegt, ist er nicht von einer öligen Pfütze oder einem nassen Felsen zu unterscheiden.',
      ],
    ],
    actions: [
      [
        'Pseudopodium',
        'Nahkampf-Waffenangriff: +3 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 4 (1W6 + 1) Wuchtschaden plus 7 (2W6) Säureschaden, und trägt das Ziel eine nichtmagische Metallrüstung, wird die Rüstung teilweise zersetzt und erhält einen dauerhaften, kumulativen Malus von −1 auf die RK, die sie gewährt. Die Rüstung ist zerstört, wenn der Malus ihre RK auf 10 senkt.',
      ],
    ],
  },
  grimlock: {
    traits: [
      [
        'Blinde Sinne',
        'Der Grimlock kann seine Blindsicht nicht nutzen, solange er taub ist und nicht riechen kann.',
      ],
      [
        'Scharfes Gehör und scharfer Geruchssinn',
        'Der Grimlock ist bei Weisheitswürfen (Wahrnehmung), die auf dem Gehör oder dem Geruchssinn beruhen, im Vorteil.',
      ],
      [
        'Steintarnung',
        'Der Grimlock ist bei Geschicklichkeitswürfen (Heimlichkeit), um sich in felsigem Gelände zu verstecken, im Vorteil.',
      ],
    ],
    actions: [
      [
        'Stachelknochenkeule',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 5 (1W4 + 3) Wuchtschaden plus 2 (1W4) Stichschaden.',
      ],
    ],
  },
  guard: {
    actions: [
      [
        'Speer',
        'Nah- oder Fernkampf-Waffenangriff: +3 auf Treffer, Reichweite 1,5 m oder Reichweite 6/18 m, ein Ziel. Treffer: 4 (1W6 + 1) Stichschaden oder 5 (1W8 + 1) Stichschaden, wenn mit zwei Händen für einen Nahkampfangriff geführt.',
      ],
    ],
  },
  hawk: {
    traits: [
      [
        'Scharfe Sicht',
        'Der Falke ist bei Weisheitswürfen (Wahrnehmung), die auf der Sicht beruhen, im Vorteil.',
      ],
    ],
    actions: [
      [
        'Krallen',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 1 Hiebschaden.',
      ],
    ],
  },
  hobgoblin: {
    traits: [
      [
        'Kampfvorteil',
        'Einmal pro Zug kann der Hobgoblin einer Kreatur, die er mit einem Waffenangriff trifft, zusätzlich 7 (2W6) Schaden zufügen, wenn sich diese Kreatur im Umkreis von 1,5 m um einen nicht kampfunfähigen Verbündeten des Hobgoblins befindet.',
      ],
    ],
    actions: [
      [
        'Langschwert',
        'Nahkampf-Waffenangriff: +3 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 5 (1W8 + 1) Hiebschaden, oder 6 (1W10 + 1) Hiebschaden, wenn mit zwei Händen geführt.',
      ],
      [
        'Langbogen',
        'Fernkampf-Waffenangriff: +3 auf Treffer, Reichweite 45/180 m, ein Ziel. Treffer: 5 (1W8 + 1) Stichschaden.',
      ],
    ],
  },
  homunculus: {
    traits: [
      [
        'Telepathische Verbindung',
        'Solange sich der Homunkulus auf derselben Existenzebene wie sein Meister befindet, kann er magisch übermitteln, was er wahrnimmt, und die beiden können telepathisch kommunizieren.',
      ],
    ],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, eine Kreatur. Treffer: 1 Stichschaden, und das Ziel muss einen Konstitutionsrettungswurf mit SG 10 bestehen, sonst ist es 1 Minute lang vergiftet. Misslingt der Rettungswurf um 5 oder mehr, ist das Ziel stattdessen 5 (1W10) Minuten lang vergiftet und bewusstlos, solange es auf diese Weise vergiftet ist.',
      ],
    ],
  },
  hyena: {
    traits: [
      [
        'Rudeltaktik',
        'Die Hyäne ist bei Angriffswürfen gegen eine Kreatur im Vorteil, wenn sich mindestens ein nicht kampfunfähiger Verbündeter der Hyäne im Umkreis von 1,5 m um die Kreatur befindet.',
      ],
    ],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +2 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 3 (1W6) Stichschaden.',
      ],
    ],
  },
  'ice-mephit': {
    traits: [
      [
        'Todesexplosion',
        'Stirbt der Mephit, explodiert er in einem Schauer aus scharfkantigem Eis. Jede Kreatur im Umkreis von 1,5 m um ihn muss einen Geschicklichkeitsrettungswurf mit SG 10 ablegen. Bei einem Misserfolg erleidet sie 4 (1W8) Hiebschaden, bei einem Erfolg die Hälfte.',
      ],
      [
        'Falsches Erscheinungsbild',
        'Solange der Mephit sich nicht bewegt, ist er nicht von einem gewöhnlichen Eissplitter zu unterscheiden.',
      ],
      [
        'Angeborenes Zauberwirken',
        'Der Mephit kann den Zauber Nebelwolke angeboren wirken, ohne Materialkomponenten zu benötigen. Sein Attribut zum angeborenen Zauberwirken ist Charisma.',
      ],
    ],
    actions: [
      [
        'Klauen',
        'Nahkampf-Waffenangriff: +3 auf Treffer, Reichweite 1,5 m, eine Kreatur. Treffer: 3 (1W4 + 1) Hiebschaden plus 2 (1W4) Kälteschaden.',
      ],
      [
        'Frostodem (Aufladung 6)',
        'Der Mephit atmet einen 4,5-m-Kegel aus kalter Luft aus. Jede Kreatur in diesem Bereich muss einen Geschicklichkeitsrettungswurf mit SG 10 ablegen. Bei einem Misserfolg erleidet sie 5 (2W4) Kälteschaden, bei einem Erfolg die Hälfte.',
      ],
    ],
  },
  jackal: {
    traits: [
      [
        'Scharfes Gehör und scharfer Geruchssinn',
        'Der Schakal ist bei Weisheitswürfen (Wahrnehmung), die auf dem Gehör oder dem Geruchssinn beruhen, im Vorteil.',
      ],
      [
        'Rudeltaktik',
        'Der Schakal ist bei Angriffswürfen gegen eine Kreatur im Vorteil, wenn sich mindestens ein nicht kampfunfähiger Verbündeter des Schakals im Umkreis von 1,5 m um die Kreatur befindet.',
      ],
    ],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +1 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 1 (1W4 − 1) Stichschaden.',
      ],
    ],
  },
  kobold: {
    traits: [
      [
        'Sonnenlichtempfindlichkeit',
        'Im Sonnenlicht ist der Kobold bei Angriffswürfen sowie bei Weisheitswürfen (Wahrnehmung), die auf der Sicht beruhen, im Nachteil.',
      ],
      [
        'Rudeltaktik',
        'Der Kobold ist bei Angriffswürfen gegen eine Kreatur im Vorteil, wenn sich mindestens ein nicht kampfunfähiger Verbündeter des Kobolds im Umkreis von 1,5 m um die Kreatur befindet.',
      ],
    ],
    actions: [
      [
        'Dolch',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 4 (1W4 + 2) Stichschaden.',
      ],
      [
        'Schleuder',
        'Fernkampf-Waffenangriff: +4 auf Treffer, Reichweite 9/36 m, ein Ziel. Treffer: 4 (1W4 + 2) Wuchtschaden.',
      ],
    ],
  },
  lemure: {
    traits: [
      ['Teufelssicht', 'Magische Dunkelheit behindert die Dunkelsicht des Lemuren nicht.'],
      [
        'Höllische Erneuerung',
        'Ein Lemure, der in den Neun Höllen stirbt, kehrt nach 1W10 Tagen mit all seinen Trefferpunkten ins Leben zurück, es sei denn, er wird von einer guten Kreatur getötet, auf die der Zauber Segnen gewirkt wurde, oder seine Überreste werden mit Weihwasser besprengt.',
      ],
    ],
    actions: [
      [
        'Faust',
        'Nahkampf-Waffenangriff: +3 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 2 (1W4) Wuchtschaden.',
      ],
    ],
  },
  lizard: {
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +0 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 1 Stichschaden.',
      ],
    ],
  },
  lizardfolk: {
    traits: [['Atem anhalten', 'Der Echsenmensch kann 15 Minuten lang den Atem anhalten.']],
    actions: [
      [
        'Mehrfachangriff',
        'Der Echsenmensch führt zwei Nahkampfangriffe aus, jeden mit einer anderen Waffe.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 5 (1W6 + 2) Stichschaden.',
      ],
      [
        'Schwerer Knüppel',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 5 (1W6 + 2) Wuchtschaden.',
      ],
      [
        'Wurfspeer',
        'Nah- oder Fernkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m oder Reichweite 9/36 m, ein Ziel. Treffer: 5 (1W6 + 2) Stichschaden.',
      ],
      [
        'Stachelschild',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 5 (1W6 + 2) Stichschaden.',
      ],
    ],
  },
  'magma-mephit': {
    traits: [
      [
        'Todesexplosion',
        'Stirbt der Mephit, explodiert er in einem Lavaschauer. Jede Kreatur im Umkreis von 1,5 m um ihn muss einen Geschicklichkeitsrettungswurf mit SG 11 ablegen. Bei einem Misserfolg erleidet sie 7 (2W6) Feuerschaden, bei einem Erfolg die Hälfte.',
      ],
      [
        'Falsches Erscheinungsbild',
        'Solange der Mephit sich nicht bewegt, ist er nicht von einem gewöhnlichen Magmahaufen zu unterscheiden.',
      ],
      [
        'Angeborenes Zauberwirken',
        'Der Mephit kann den Zauber Metall erhitzen (Zauberrettungswurf-SG 10) angeboren wirken, ohne Materialkomponenten zu benötigen. Sein Attribut zum angeborenen Zauberwirken ist Charisma.',
      ],
    ],
    actions: [
      [
        'Klauen',
        'Nahkampf-Waffenangriff: +3 auf Treffer, Reichweite 1,5 m, eine Kreatur. Treffer: 3 (1W4 + 1) Hiebschaden plus 2 (1W4) Feuerschaden.',
      ],
      [
        'Feuerodem (Aufladung 6)',
        'Der Mephit atmet einen 4,5-m-Kegel aus Feuer aus. Jede Kreatur in diesem Bereich muss einen Geschicklichkeitsrettungswurf mit SG 11 ablegen. Bei einem Misserfolg erleidet sie 7 (2W6) Feuerschaden, bei einem Erfolg die Hälfte.',
      ],
    ],
  },
  magmin: {
    traits: [
      [
        'Todesexplosion',
        'Stirbt der Magmin, explodiert er in einem Schauer aus Feuer und Magma. Jede Kreatur im Umkreis von 3 m um ihn muss einen Geschicklichkeitsrettungswurf mit SG 11 ablegen. Bei einem Misserfolg erleidet sie 7 (2W6) Feuerschaden, bei einem Erfolg die Hälfte. Brennbare Gegenstände in diesem Bereich, die nicht getragen oder gehalten werden, entzünden sich.',
      ],
      [
        'Entfachtes Leuchten',
        'Als Bonusaktion kann der Magmin sich in Brand setzen oder seine Flammen löschen. Solange er brennt, verbreitet der Magmin helles Licht in einem Radius von 3 m und dämmriges Licht für weitere 3 m.',
      ],
    ],
    actions: [
      [
        'Berührung',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 7 (2W6) Feuerschaden. Ist das Ziel eine Kreatur oder ein brennbarer Gegenstand, entzündet es sich. Bis ein Ziel eine Aktion nutzt, um das Feuer zu löschen, erleidet es am Ende jedes seiner Züge 3 (1W6) Feuerschaden.',
      ],
    ],
  },
  mastiff: {
    traits: [
      [
        'Scharfes Gehör und scharfer Geruchssinn',
        'Der Mastiff ist bei Weisheitswürfen (Wahrnehmung), die auf dem Gehör oder dem Geruchssinn beruhen, im Vorteil.',
      ],
    ],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +3 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 4 (1W6 + 1) Stichschaden. Ist das Ziel eine Kreatur, muss es einen Stärkerettungswurf mit SG 11 bestehen, sonst wird es zu Boden geworfen.',
      ],
    ],
  },
  merfolk: {
    traits: [['Amphibisch', 'Der Meermensch kann Luft und Wasser atmen.']],
    actions: [
      [
        'Speer',
        'Nah- oder Fernkampf-Waffenangriff: +2 auf Treffer, Reichweite 1,5 m oder Reichweite 6/18 m, ein Ziel. Treffer: 3 (1W6) Stichschaden, oder 4 (1W8) Stichschaden, wenn mit zwei Händen geführt.',
      ],
    ],
  },
  mule: {
    traits: [
      ['Lasttier', 'Das Maultier gilt bei der Bestimmung seiner Tragfähigkeit als großes Tier.'],
      [
        'Trittsicher',
        'Das Maultier ist bei Stärke- und Geschicklichkeitsrettungswürfen gegen Effekte, die es zu Boden werfen würden, im Vorteil.',
      ],
    ],
    actions: [
      [
        'Hufe',
        'Nahkampf-Waffenangriff: +2 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 4 (1W4 + 2) Wuchtschaden.',
      ],
    ],
  },
  noble: {
    actions: [
      [
        'Rapier',
        'Nahkampf-Waffenangriff: +3 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 5 (1W8 + 1) Stichschaden.',
      ],
    ],
    reactions: [
      [
        'Parade',
        'Der Adlige erhöht seine RK gegen einen Nahkampfangriff, der ihn treffen würde, um 2. Dazu muss der Adlige den Angreifer sehen und eine Nahkampfwaffe führen.',
      ],
    ],
  },
  octopus: {
    traits: [
      ['Atem anhalten', 'Außerhalb des Wassers kann der Krake 30 Minuten lang den Atem anhalten.'],
      [
        'Unterwassertarnung',
        'Der Krake ist bei Geschicklichkeitswürfen (Heimlichkeit) unter Wasser im Vorteil.',
      ],
      ['Wasseratmung', 'Der Krake kann nur unter Wasser atmen.'],
    ],
    actions: [
      [
        'Tentakel',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 1 Wuchtschaden, und das Ziel wird gepackt (Entkommen-SG 10). Bis der Griff endet, kann der Krake seine Tentakel nicht gegen ein anderes Ziel einsetzen.',
      ],
      [
        'Tintenwolke (Aufladung nach einer kurzen oder langen Rast)',
        'Eine Tintenwolke mit 1,5 m Radius breitet sich rings um den Kraken aus, sofern er unter Wasser ist. Der Bereich ist 1 Minute lang komplett verschleiert, doch eine starke Strömung kann die Tinte zerstreuen. Nachdem er die Tinte ausgestoßen hat, kann der Krake die Aktion Spurten als Bonusaktion ausführen.',
      ],
    ],
  },
  orc: {
    traits: [
      [
        'Aggressiv',
        'Als Bonusaktion kann der Ork sich bis zu seiner Bewegungsrate auf eine feindselige Kreatur zubewegen, die er sehen kann.',
      ],
    ],
    actions: [
      [
        'Zweihandaxt',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 9 (1W12 + 3) Hiebschaden.',
      ],
      [
        'Wurfspeer',
        'Nah- oder Fernkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m oder Reichweite 9/36 m, ein Ziel. Treffer: 6 (1W6 + 3) Stichschaden.',
      ],
    ],
  },
  owl: {
    traits: [
      [
        'Vorbeifliegen',
        'Die Eule provoziert keine Gelegenheitsangriffe, wenn sie aus der Reichweite eines Feindes fliegt.',
      ],
      [
        'Scharfes Gehör und scharfe Sicht',
        'Die Eule ist bei Weisheitswürfen (Wahrnehmung), die auf dem Gehör oder der Sicht beruhen, im Vorteil.',
      ],
    ],
    actions: [
      [
        'Krallen',
        'Nahkampf-Waffenangriff: +3 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 1 Hiebschaden.',
      ],
    ],
  },
  panther: {
    traits: [
      [
        'Scharfer Geruchssinn',
        'Der Panther ist bei Weisheitswürfen (Wahrnehmung), die auf dem Geruchssinn beruhen, im Vorteil.',
      ],
      [
        'Anspringen',
        'Bewegt sich der Panther mindestens 6 m geradlinig auf eine Kreatur zu und trifft sie dann im selben Zug mit einem Klauenangriff, muss das Ziel einen Stärkerettungswurf mit SG 12 bestehen, sonst wird es zu Boden geworfen. Liegt das Ziel am Boden, kann der Panther als Bonusaktion einen Bissangriff gegen es ausführen.',
      ],
    ],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 5 (1W6 + 2) Stichschaden.',
      ],
      [
        'Klaue',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 4 (1W4 + 2) Hiebschaden.',
      ],
    ],
  },
  'poisonous-snake': {
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 1 Stichschaden, und das Ziel muss einen Konstitutionsrettungswurf mit SG 10 ablegen. Bei einem Misserfolg erleidet es 5 (2W4) Giftschaden, bei einem Erfolg die Hälfte.',
      ],
    ],
  },
  pony: {
    actions: [
      [
        'Hufe',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 7 (2W4 + 2) Wuchtschaden.',
      ],
    ],
  },
  pseudodragon: {
    traits: [
      [
        'Scharfe Sinne',
        'Der Pseudodrache ist bei Weisheitswürfen (Wahrnehmung), die auf der Sicht, dem Gehör oder dem Geruchssinn beruhen, im Vorteil.',
      ],
      [
        'Magieresistenz',
        'Der Pseudodrache ist bei Rettungswürfen gegen Zauber und andere magische Effekte im Vorteil.',
      ],
      [
        'Eingeschränkte Telepathie',
        'Der Pseudodrache kann magisch einfache Ideen, Gefühle und Bilder telepathisch an jede Kreatur im Umkreis von 30 m übermitteln, die eine Sprache versteht.',
      ],
    ],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 4 (1W4 + 2) Stichschaden.',
      ],
      [
        'Stachel',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, eine Kreatur. Treffer: 4 (1W4 + 2) Stichschaden, und das Ziel muss einen Konstitutionsrettungswurf mit SG 11 bestehen, sonst ist es 1 Stunde lang vergiftet. Misslingt der Rettungswurf um 5 oder mehr, wird das Ziel für dieselbe Dauer bewusstlos oder bis es Schaden erleidet oder eine andere Kreatur eine Aktion nutzt, um es wachzurütteln.',
      ],
    ],
  },
  quipper: {
    traits: [
      [
        'Blutrausch',
        'Der Quipper ist bei Nahkampfangriffswürfen gegen jede Kreatur im Vorteil, die nicht alle ihre Trefferpunkte hat.',
      ],
      ['Wasseratmung', 'Der Quipper kann nur unter Wasser atmen.'],
    ],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 1 Stichschaden.',
      ],
    ],
  },
  rat: {
    traits: [
      [
        'Scharfer Geruchssinn',
        'Die Ratte ist bei Weisheitswürfen (Wahrnehmung), die auf dem Geruchssinn beruhen, im Vorteil.',
      ],
    ],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +0 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 1 Stichschaden.',
      ],
    ],
  },
  raven: {
    traits: [
      [
        'Nachahmung',
        'Der Rabe kann einfache Geräusche nachahmen, die er gehört hat, etwa eine flüsternde Person, ein weinendes Kleinkind oder ein schnatterndes Tier. Eine Kreatur, welche die Geräusche hört, erkennt mit einem erfolgreichen Weisheitswurf (Motiv erkennen) gegen SG 10, dass es Nachahmungen sind.',
      ],
    ],
    actions: [
      [
        'Schnabel',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 1 Stichschaden.',
      ],
    ],
  },
  'reef-shark': {
    traits: [
      [
        'Rudeltaktik',
        'Der Hai ist bei Angriffswürfen gegen eine Kreatur im Vorteil, wenn sich mindestens ein nicht kampfunfähiger Verbündeter des Hais im Umkreis von 1,5 m um die Kreatur befindet.',
      ],
      ['Wasseratmung', 'Der Hai kann nur unter Wasser atmen.'],
    ],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 6 (1W8 + 2) Stichschaden.',
      ],
    ],
  },
  'riding-horse': {
    actions: [
      [
        'Hufe',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 8 (2W4 + 3) Wuchtschaden.',
      ],
    ],
  },
  'rust-monster': {
    traits: [
      [
        'Eisenwitterung',
        'Das Rostmonster kann den Aufenthaltsort von eisenhaltigem Metall im Umkreis von 9 m durch Witterung genau bestimmen.',
      ],
      [
        'Metall rosten',
        'Jede nichtmagische Waffe aus Metall, die das Rostmonster trifft, wird zersetzt. Nachdem sie Schaden verursacht hat, erhält die Waffe einen dauerhaften, kumulativen Malus von −1 auf Schadenswürfe. Sinkt ihr Malus auf −5, ist die Waffe zerstört. Nichtmagische Munition aus Metall, die das Rostmonster trifft, wird zerstört, nachdem sie Schaden verursacht hat.',
      ],
    ],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +3 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 5 (1W8 + 1) Stichschaden.',
      ],
      [
        'Fühler',
        'Das Rostmonster zersetzt einen nichtmagischen Gegenstand aus eisenhaltigem Metall, den es im Umkreis von 1,5 m sehen kann. Wird der Gegenstand nicht getragen oder gehalten, zerstört die Berührung einen 0,3-m-Würfel davon. Wird der Gegenstand von einer Kreatur getragen oder gehalten, kann die Kreatur einen Geschicklichkeitsrettungswurf mit SG 11 ablegen, um der Berührung des Rostmonsters auszuweichen.\nIst der berührte Gegenstand eine Metallrüstung oder ein Metallschild, der getragen oder gehalten wird, erhält er einen dauerhaften, kumulativen Malus von −1 auf die RK, die er gewährt. Rüstung, deren RK auf 10 sinkt, oder ein Schild, dessen Bonus auf +0 fällt, ist zerstört. Ist der berührte Gegenstand eine gehaltene Metallwaffe, rostet sie wie beim Merkmal Metall rosten beschrieben.',
      ],
    ],
  },
  sahuagin: {
    traits: [
      [
        'Blutrausch',
        'Der Sahuagin ist bei Nahkampfangriffswürfen gegen jede Kreatur im Vorteil, die nicht alle ihre Trefferpunkte hat.',
      ],
      [
        'Eingeschränkt amphibisch',
        'Der Sahuagin kann Luft und Wasser atmen, muss aber mindestens alle 4 Stunden untertauchen, um nicht zu ersticken.',
      ],
      [
        'Hai-Telepathie',
        'Der Sahuagin kann jedem Hai im Umkreis von 36 m mithilfe einer eingeschränkten Telepathie magisch Befehle erteilen.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Sahuagin führt zwei Nahkampfangriffe aus: einen mit seinem Biss und einen mit seinen Klauen oder seinem Speer.',
      ],
      [
        'Biss',
        'Nahkampf-Waffenangriff: +3 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 3 (1W4 + 1) Stichschaden.',
      ],
      [
        'Klauen',
        'Nahkampf-Waffenangriff: +3 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 3 (1W4 + 1) Hiebschaden.',
      ],
      [
        'Speer',
        'Nah- oder Fernkampf-Waffenangriff: +3 auf Treffer, Reichweite 1,5 m oder Reichweite 6/18 m, ein Ziel. Treffer: 4 (1W6 + 1) Stichschaden, oder 5 (1W8 + 1) Stichschaden, wenn mit zwei Händen geführt.',
      ],
    ],
  },
  satyr: {
    traits: [
      [
        'Magieresistenz',
        'Der Satyr ist bei Rettungswürfen gegen Zauber und andere magische Effekte im Vorteil.',
      ],
    ],
    actions: [
      [
        'Rammen',
        'Nahkampf-Waffenangriff: +3 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 6 (2W4 + 1) Wuchtschaden.',
      ],
      [
        'Kurzschwert',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 6 (1W6 + 3) Stichschaden.',
      ],
      [
        'Kurzbogen',
        'Fernkampf-Waffenangriff: +5 auf Treffer, Reichweite 24/96 m, ein Ziel. Treffer: 6 (1W6 + 3) Stichschaden.',
      ],
    ],
  },
  scorpion: {
    actions: [
      [
        'Stachel',
        'Nahkampf-Waffenangriff: +2 auf Treffer, Reichweite 1,5 m, eine Kreatur. Treffer: 1 Stichschaden, und das Ziel muss einen Konstitutionsrettungswurf mit SG 9 ablegen. Bei einem Misserfolg erleidet es 4 (1W8) Giftschaden, bei einem Erfolg die Hälfte.',
      ],
    ],
  },
  scout: {
    traits: [
      [
        'Scharfes Gehör und scharfe Sicht',
        'Der Kundschafter ist bei Weisheitswürfen (Wahrnehmung), die auf dem Gehör oder der Sicht beruhen, im Vorteil.',
      ],
    ],
    actions: [
      [
        'Mehrfachangriff',
        'Der Kundschafter führt zwei Nahkampfangriffe oder zwei Fernkampfangriffe aus.',
      ],
      [
        'Kurzschwert',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 5 (1W6 + 2) Stichschaden.',
      ],
      [
        'Langbogen',
        'Fernkampf-Waffenangriff: +4 auf Treffer, Reichweite 45/180 m, ein Ziel. Treffer: 6 (1W8 + 2) Stichschaden.',
      ],
    ],
  },
  'sea-horse': {
    traits: [['Wasseratmung', 'Das Seepferdchen kann nur unter Wasser atmen.']],
  },
  shadow: {
    traits: [
      [
        'Amorph',
        'Der Schatten kann sich durch einen Bereich bewegen, der nur 2,5 cm breit ist, ohne sich zwängen zu müssen.',
      ],
      [
        'Schattenheimlichkeit',
        'In dämmrigem Licht oder Dunkelheit kann der Schatten die Aktion Verstecken als Bonusaktion ausführen. Außerdem steigt sein Heimlichkeitsbonus auf +6.',
      ],
      [
        'Sonnenlichtschwäche',
        'Im Sonnenlicht ist der Schatten bei Angriffswürfen, Attributswürfen und Rettungswürfen im Nachteil.',
      ],
    ],
    actions: [
      [
        'Stärkeentzug',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, eine Kreatur. Treffer: 9 (2W6 + 2) nekrotischen Schaden, und der Stärkewert des Ziels sinkt um 1W4. Das Ziel stirbt, wenn seine Stärke dadurch auf 0 sinkt. Andernfalls hält die Verringerung an, bis das Ziel eine kurze oder lange Rast beendet.\nStirbt ein nicht böser Humanoider durch diesen Angriff, erhebt sich 1W4 Stunden später ein neuer Schatten aus dem Leichnam.',
      ],
    ],
  },
  shrieker: {
    traits: [
      [
        'Falsches Erscheinungsbild',
        'Solange der Kreischer sich nicht bewegt, ist er nicht von einem gewöhnlichen Pilz zu unterscheiden.',
      ],
    ],
    reactions: [
      [
        'Kreischen',
        'Befindet sich helles Licht oder eine Kreatur im Umkreis von 9 m um den Kreischer, stößt er einen Schrei aus, der im Umkreis von 90 m zu hören ist. Der Kreischer kreischt weiter, bis die Störung außer Reichweite ist, und danach noch 1W4 seiner Züge lang.',
      ],
    ],
  },
  skeleton: {
    actions: [
      [
        'Kurzschwert',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 5 (1W6 + 2) Stichschaden.',
      ],
      [
        'Kurzbogen',
        'Fernkampf-Waffenangriff: +4 auf Treffer, Reichweite 24/96 m, ein Ziel. Treffer: 5 (1W6 + 2) Stichschaden.',
      ],
    ],
  },
  spider: {
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
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, eine Kreatur. Treffer: 1 Stichschaden, und das Ziel muss einen Konstitutionsrettungswurf mit SG 9 bestehen, sonst erleidet es 2 (1W4) Giftschaden.',
      ],
    ],
  },
  sprite: {
    actions: [
      [
        'Langschwert',
        'Nahkampf-Waffenangriff: +2 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 1 Hiebschaden.',
      ],
      [
        'Kurzbogen',
        'Fernkampf-Waffenangriff: +6 auf Treffer, Reichweite 12/48 m, ein Ziel. Treffer: 1 Stichschaden, und das Ziel muss einen Konstitutionsrettungswurf mit SG 10 bestehen, sonst ist es 1 Minute lang vergiftet. Ist das Ergebnis seines Rettungswurfs 5 oder niedriger, wird das vergiftete Ziel für dieselbe Dauer bewusstlos oder bis es Schaden erleidet oder eine andere Kreatur eine Aktion nutzt, um es wachzurütteln.',
      ],
      [
        'Herzsicht',
        'Der Sprite berührt eine Kreatur und kennt magisch deren aktuellen Gefühlszustand. Misslingt dem Ziel ein Charismarettungswurf mit SG 10, kennt der Sprite außerdem die Gesinnung der Kreatur. Himmlische, Unholde und Untote misslingt der Rettungswurf automatisch.',
      ],
      [
        'Unsichtbarkeit',
        'Der Sprite wird magisch unsichtbar, bis er angreift oder einen Zauber wirkt oder bis seine Konzentration endet (als würde er sich auf einen Zauber konzentrieren). Ausrüstung, die der Sprite trägt oder hält, ist mit ihm unsichtbar.',
      ],
    ],
  },
  'steam-mephit': {
    traits: [
      [
        'Todesexplosion',
        'Stirbt der Mephit, explodiert er in einer Dampfwolke. Jede Kreatur im Umkreis von 1,5 m um den Mephiten muss einen Geschicklichkeitsrettungswurf mit SG 10 bestehen, sonst erleidet sie 4 (1W8) Feuerschaden.',
      ],
      [
        'Angeborenes Zauberwirken',
        'Der Mephit kann den Zauber Verschwimmen angeboren wirken, ohne Materialkomponenten zu benötigen. Sein Attribut zum angeborenen Zauberwirken ist Charisma.',
      ],
    ],
    actions: [
      [
        'Klauen',
        'Nahkampf-Waffenangriff: +2 auf Treffer, Reichweite 1,5 m, eine Kreatur. Treffer: 2 (1W4) Hiebschaden plus 2 (1W4) Feuerschaden.',
      ],
      [
        'Dampfodem (Aufladung 6)',
        'Der Mephit atmet einen 4,5-m-Kegel aus sengendem Dampf aus. Jede Kreatur in diesem Bereich muss einen Geschicklichkeitsrettungswurf mit SG 10 ablegen. Bei einem Misserfolg erleidet sie 4 (1W8) Feuerschaden, bei einem Erfolg die Hälfte.',
      ],
    ],
  },
  stirge: {
    actions: [
      [
        'Blut saugen',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, eine Kreatur. Treffer: 5 (1W4 + 3) Stichschaden, und die Stirge heftet sich an das Ziel. Solange die Stirge haftet, greift die Stirge nicht an. Stattdessen verliert das Ziel zu Beginn jedes Zuges der Stirge durch Blutverlust 5 (1W4 + 3) Trefferpunkte.\nDie Stirge kann sich lösen, indem die Stirge 1,5 m ihrer Bewegung aufwendet. Das tut sie, nachdem sie dem Ziel 10 Trefferpunkte an Blut entzogen hat oder das Ziel stirbt. Eine Kreatur, auch das Ziel, kann ihre Aktion nutzen, um die Stirge zu lösen.',
      ],
    ],
  },
  'swarm-of-bats': {
    traits: [
      ['Echoortung', 'Der Schwarm kann seine Blindsicht nicht nutzen, solange er taub ist.'],
      [
        'Scharfes Gehör',
        'Der Schwarm ist bei Weisheitswürfen (Wahrnehmung), die auf dem Gehör beruhen, im Vorteil.',
      ],
      [
        'Schwarm',
        'Der Schwarm kann den Bereich einer anderen Kreatur besetzen und umgekehrt, und der Schwarm kann sich durch jede Öffnung bewegen, die groß genug für eine winzige Fledermaus ist. Der Schwarm kann keine Trefferpunkte zurückerhalten und keine temporären Trefferpunkte erhalten.',
      ],
    ],
    actions: [
      [
        'Bisse',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 0 m, eine Kreatur im Bereich des Schwarms. Treffer: 5 (2W4) Stichschaden, oder 2 (1W4) Stichschaden, wenn der Schwarm die Hälfte seiner Trefferpunkte oder weniger hat.',
      ],
    ],
  },
  'swarm-of-beetles': {
    traits: [
      [
        'Schwarm',
        'Der Schwarm kann den Bereich einer anderen Kreatur besetzen und umgekehrt, und der Schwarm kann sich durch jede Öffnung bewegen, die groß genug für ein winziges Insekt ist. Der Schwarm kann keine Trefferpunkte zurückerhalten und keine temporären Trefferpunkte erhalten.',
      ],
    ],
    actions: [
      [
        'Bisse',
        'Nahkampf-Waffenangriff: +3 auf Treffer, Reichweite 0 m, ein Ziel im Bereich des Schwarms. Treffer: 10 (4W4) Stichschaden, oder 5 (2W4) Stichschaden, wenn der Schwarm die Hälfte seiner Trefferpunkte oder weniger hat.',
      ],
    ],
  },
  'swarm-of-centipedes': {
    traits: [
      [
        'Schwarm',
        'Der Schwarm kann den Bereich einer anderen Kreatur besetzen und umgekehrt, und der Schwarm kann sich durch jede Öffnung bewegen, die groß genug für ein winziges Insekt ist. Der Schwarm kann keine Trefferpunkte zurückerhalten und keine temporären Trefferpunkte erhalten.',
      ],
    ],
    actions: [
      [
        'Bisse',
        'Nahkampf-Waffenangriff: +3 auf Treffer, Reichweite 0 m, ein Ziel im Bereich des Schwarms. Treffer: 10 (4W4) Stichschaden, oder 5 (2W4) Stichschaden, wenn der Schwarm die Hälfte seiner Trefferpunkte oder weniger hat.\nEine Kreatur, die von einem Tausendfüßlerschwarm auf 0 Trefferpunkte gesenkt wird, ist stabil, aber 1 Stunde lang vergiftet, selbst nachdem sie Trefferpunkte zurückerhalten hat, und solange sie auf diese Weise vergiftet ist, ist sie gelähmt.',
      ],
    ],
  },
  'swarm-of-insects': {
    traits: [
      [
        'Schwarm',
        'Der Schwarm kann den Bereich einer anderen Kreatur besetzen und umgekehrt, und der Schwarm kann sich durch jede Öffnung bewegen, die groß genug für ein winziges Insekt ist. Der Schwarm kann keine Trefferpunkte zurückerhalten und keine temporären Trefferpunkte erhalten.',
      ],
    ],
    actions: [
      [
        'Bisse',
        'Nahkampf-Waffenangriff: +3 auf Treffer, Reichweite 0 m, ein Ziel im Bereich des Schwarms. Treffer: 10 (4W4) Stichschaden, oder 5 (2W4) Stichschaden, wenn der Schwarm die Hälfte seiner Trefferpunkte oder weniger hat.',
      ],
    ],
  },
  'swarm-of-rats': {
    traits: [
      [
        'Scharfer Geruchssinn',
        'Der Schwarm ist bei Weisheitswürfen (Wahrnehmung), die auf dem Geruchssinn beruhen, im Vorteil.',
      ],
      [
        'Schwarm',
        'Der Schwarm kann den Bereich einer anderen Kreatur besetzen und umgekehrt, und der Schwarm kann sich durch jede Öffnung bewegen, die groß genug für eine winzige Ratte ist. Der Schwarm kann keine Trefferpunkte zurückerhalten und keine temporären Trefferpunkte erhalten.',
      ],
    ],
    actions: [
      [
        'Bisse',
        'Nahkampf-Waffenangriff: +2 auf Treffer, Reichweite 0 m, ein Ziel im Bereich des Schwarms. Treffer: 7 (2W6) Stichschaden, oder 3 (1W6) Stichschaden, wenn der Schwarm die Hälfte seiner Trefferpunkte oder weniger hat.',
      ],
    ],
  },
  'swarm-of-ravens': {
    traits: [
      [
        'Schwarm',
        'Der Schwarm kann den Bereich einer anderen Kreatur besetzen und umgekehrt, und der Schwarm kann sich durch jede Öffnung bewegen, die groß genug für einen winzigen Raben ist. Der Schwarm kann keine Trefferpunkte zurückerhalten und keine temporären Trefferpunkte erhalten.',
      ],
    ],
    actions: [
      [
        'Schnäbel',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel im Bereich des Schwarms. Treffer: 7 (2W6) Stichschaden, oder 3 (1W6) Stichschaden, wenn der Schwarm die Hälfte seiner Trefferpunkte oder weniger hat.',
      ],
    ],
  },
  'swarm-of-spiders': {
    traits: [
      [
        'Schwarm',
        'Der Schwarm kann den Bereich einer anderen Kreatur besetzen und umgekehrt, und der Schwarm kann sich durch jede Öffnung bewegen, die groß genug für ein winziges Insekt ist. Der Schwarm kann keine Trefferpunkte zurückerhalten und keine temporären Trefferpunkte erhalten.',
      ],
      [
        'Spinnenklettern',
        'Der Schwarm kann an schwierigen Oberflächen klettern, auch kopfüber an Decken, ohne einen Attributswurf ablegen zu müssen.',
      ],
      [
        'Netzgespür',
        'Solange der Schwarm ein Netz berührt, kennt er den genauen Aufenthaltsort jeder anderen Kreatur, die dasselbe Netz berührt.',
      ],
      ['Netzläufer', 'Der Schwarm ignoriert Bewegungseinschränkungen durch Spinnweben.'],
    ],
    actions: [
      [
        'Bisse',
        'Nahkampf-Waffenangriff: +3 auf Treffer, Reichweite 0 m, ein Ziel im Bereich des Schwarms. Treffer: 10 (4W4) Stichschaden, oder 5 (2W4) Stichschaden, wenn der Schwarm die Hälfte seiner Trefferpunkte oder weniger hat.',
      ],
    ],
  },
  'swarm-of-wasps': {
    traits: [
      [
        'Schwarm',
        'Der Schwarm kann den Bereich einer anderen Kreatur besetzen und umgekehrt, und der Schwarm kann sich durch jede Öffnung bewegen, die groß genug für ein winziges Insekt ist. Der Schwarm kann keine Trefferpunkte zurückerhalten und keine temporären Trefferpunkte erhalten.',
      ],
    ],
    actions: [
      [
        'Bisse',
        'Nahkampf-Waffenangriff: +3 auf Treffer, Reichweite 0 m, ein Ziel im Bereich des Schwarms. Treffer: 10 (4W4) Stichschaden, oder 5 (2W4) Stichschaden, wenn der Schwarm die Hälfte seiner Trefferpunkte oder weniger hat.',
      ],
    ],
  },
  thug: {
    traits: [
      [
        'Rudeltaktik',
        'Der Schläger ist bei Angriffswürfen gegen eine Kreatur im Vorteil, wenn sich mindestens ein nicht kampfunfähiger Verbündeter des Schlägers im Umkreis von 1,5 m um die Kreatur befindet.',
      ],
    ],
    actions: [
      ['Mehrfachangriff', 'Der Schläger führt zwei Nahkampfangriffe aus.'],
      [
        'Streitkolben',
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, eine Kreatur. Treffer: 5 (1W6 + 2) Wuchtschaden.',
      ],
      [
        'Schwere Armbrust',
        'Fernkampf-Waffenangriff: +2 auf Treffer, Reichweite 30/120 m, ein Ziel. Treffer: 5 (1W10) Stichschaden.',
      ],
    ],
  },
  'tribal-warrior': {
    traits: [
      [
        'Rudeltaktik',
        'Der Krieger ist bei Angriffswürfen gegen eine Kreatur im Vorteil, wenn sich mindestens ein nicht kampfunfähiger Verbündeter des Kriegers im Umkreis von 1,5 m um die Kreatur befindet.',
      ],
    ],
    actions: [
      [
        'Speer',
        'Nah- oder Fernkampf-Waffenangriff: +3 auf Treffer, Reichweite 1,5 m oder Reichweite 6/18 m, ein Ziel. Treffer: 4 (1W6 + 1) Stichschaden, oder 5 (1W8 + 1) Stichschaden, wenn mit zwei Händen geführt.',
      ],
    ],
  },
  'violet-fungus': {
    traits: [
      [
        'Falsches Erscheinungsbild',
        'Solange der Pilz sich nicht bewegt, ist er nicht von einem gewöhnlichen Pilz zu unterscheiden.',
      ],
    ],
    actions: [
      ['Mehrfachangriff', 'Der Pilz führt 1W4 Angriffe mit Fäulnisberührung aus.'],
      [
        'Fäulnisberührung',
        'Nahkampf-Waffenangriff: +2 auf Treffer, Reichweite 3 m, eine Kreatur. Treffer: 4 (1W8) nekrotischen Schaden.',
      ],
    ],
  },
  vulture: {
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
        'Schnabel',
        'Nahkampf-Waffenangriff: +2 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 2 (1W4) Stichschaden.',
      ],
    ],
  },
  warhorse: {
    traits: [
      [
        'Niedertrampeln',
        'Bewegt sich das Pferd mindestens 6 m geradlinig auf eine Kreatur zu und trifft sie dann im selben Zug mit einem Hufangriff, muss das Ziel einen Stärkerettungswurf mit SG 14 bestehen, sonst wird es zu Boden geworfen. Liegt das Ziel am Boden, kann das Pferd als Bonusaktion einen weiteren Angriff mit seinen Hufen gegen es ausführen.',
      ],
    ],
    actions: [
      [
        'Hufe',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 11 (2W6 + 4) Wuchtschaden.',
      ],
    ],
  },
  'warhorse-skeleton': {
    actions: [
      [
        'Hufe',
        'Nahkampf-Waffenangriff: +6 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 11 (2W6 + 4) Wuchtschaden.',
      ],
    ],
  },
  weasel: {
    traits: [
      [
        'Scharfes Gehör und scharfer Geruchssinn',
        'Das Wiesel ist bei Weisheitswürfen (Wahrnehmung), die auf dem Gehör oder dem Geruchssinn beruhen, im Vorteil.',
      ],
    ],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, eine Kreatur. Treffer: 1 Stichschaden.',
      ],
    ],
  },
  wolf: {
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
        'Nahkampf-Waffenangriff: +4 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 7 (2W4 + 2) Stichschaden. Ist das Ziel eine Kreatur, muss es einen Stärkerettungswurf mit SG 11 bestehen, sonst wird es zu Boden geworfen.',
      ],
    ],
  },
  worg: {
    traits: [
      [
        'Scharfes Gehör und scharfer Geruchssinn',
        'Der Worg ist bei Weisheitswürfen (Wahrnehmung), die auf dem Gehör oder dem Geruchssinn beruhen, im Vorteil.',
      ],
    ],
    actions: [
      [
        'Biss',
        'Nahkampf-Waffenangriff: +5 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 10 (2W6 + 3) Stichschaden. Ist das Ziel eine Kreatur, muss es einen Stärkerettungswurf mit SG 13 bestehen, sonst wird es zu Boden geworfen.',
      ],
    ],
  },
  zombie: {
    traits: [
      [
        'Untote Zähigkeit',
        'Senkt Schaden den Zombie auf 0 Trefferpunkte, muss er einen Konstitutionsrettungswurf mit SG 5 + erlittener Schaden ablegen, es sei denn, der Schaden ist gleißend oder stammt von einem kritischen Treffer. Bei einem Erfolg sinkt der Zombie stattdessen auf 1 Trefferpunkt.',
      ],
    ],
    actions: [
      [
        'Hieb',
        'Nahkampf-Waffenangriff: +3 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 4 (1W6 + 1) Wuchtschaden.',
      ],
    ],
  },
};
