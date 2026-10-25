// The Deck of Many Things of the SRD 5.1: its 22 cards in the order of the SRD's table, each with
// the playing card that stands for it, in English and in this plugin's German translation.

import type { Lang } from '../npc/races';

export type Suit = 'diamonds' | 'hearts' | 'clubs' | 'spades' | 'joker';
export type Rank = 'ace' | 'king' | 'queen' | 'jack' | 'two' | 'joker-tm' | 'joker';

export interface DeckCard {
  /** A stable key: `vizier`, `the-void`. */
  index: string;
  rank: Rank;
  suit: Suit;
  /** In the 13-card deck too, not only in the full one. */
  small: boolean;
  /** Leaves the deck once drawn (the Fool and the Jester); every other card returns. */
  leaves: boolean;
  /** Ends the drawing (The Void and Donjon). */
  ends: boolean;
  name: Record<Lang, string>;
  /** The effect, in Markdown. */
  text: Record<Lang, string>;
}

type Entry = Omit<DeckCard, 'small' | 'leaves' | 'ends'> & Partial<DeckCard>;

const card = (entry: Entry): DeckCard => ({ small: false, leaves: false, ends: false, ...entry });

export const DECK_CARDS: readonly DeckCard[] = [
  card({
    index: 'vizier',
    rank: 'ace',
    suit: 'diamonds',
    name: { en: 'Vizier', de: 'Wesir' },
    text: {
      en: 'At any time you choose within one year of drawing this card, you can ask a question in meditation and mentally receive a truthful answer to that question. Besides information, the answer helps you solve a puzzling problem or other dilemma. In other words, the knowledge comes with wisdom on how to apply it.',
      de: 'Zu einem beliebigen Zeitpunkt innerhalb eines Jahres, nachdem du diese Karte gezogen hast, kannst du in Meditation eine Frage stellen und erhältst im Geist eine wahrheitsgemäße Antwort darauf. Über die Information hinaus hilft dir die Antwort, ein rätselhaftes Problem oder ein anderes Dilemma zu lösen. Mit anderen Worten: Das Wissen kommt mit der Weisheit, wie es anzuwenden ist.',
    },
  }),
  card({
    index: 'sun',
    rank: 'king',
    suit: 'diamonds',
    small: true,
    name: { en: 'Sun', de: 'Sonne' },
    text: {
      en: 'You gain 50,000 XP, and a wondrous item (which the GM determines randomly) appears in your hands.',
      de: 'Du erhältst 50.000 EP, und ein wundersamer Gegenstand (den der SL zufällig bestimmt) erscheint in deinen Händen.',
    },
  }),
  card({
    index: 'moon',
    rank: 'queen',
    suit: 'diamonds',
    small: true,
    name: { en: 'Moon', de: 'Mond' },
    text: {
      en: 'You are granted the ability to cast the *wish* spell 1d3 times.',
      de: 'Dir wird die Fähigkeit verliehen, den Zauber *Wunsch* 1W3-mal zu wirken.',
    },
  }),
  card({
    index: 'star',
    rank: 'jack',
    suit: 'diamonds',
    small: true,
    name: { en: 'Star', de: 'Stern' },
    text: {
      en: "Increase one of your ability scores by 2. The score can exceed 20 but can't exceed 24.",
      de: 'Erhöhe einen deiner Attributswerte um 2. Der Wert kann 20 übersteigen, aber nicht 24.',
    },
  }),
  card({
    index: 'comet',
    rank: 'two',
    suit: 'diamonds',
    name: { en: 'Comet', de: 'Komet' },
    text: {
      en: 'If you single-handedly defeat the next hostile monster or group of monsters you encounter, you gain experience points enough to gain one level. Otherwise, this card has no effect.',
      de: 'Besiegst du das nächste feindselige Monster oder die nächste Gruppe von Monstern, der du begegnest, ganz allein, erhältst du genug Erfahrungspunkte, um eine Stufe aufzusteigen. Andernfalls hat diese Karte keine Wirkung.',
    },
  }),
  card({
    index: 'the-fates',
    rank: 'ace',
    suit: 'hearts',
    name: { en: 'The Fates', de: 'Die Schicksalsfäden' },
    text: {
      en: "Reality's fabric unravels and spins anew, allowing you to avoid or erase one event as if it never happened. You can use the card's magic as soon as you draw the card or at any other time before you die.",
      de: 'Das Gewebe der Wirklichkeit löst sich auf und wird neu gesponnen, sodass du ein Ereignis vermeiden oder auslöschen kannst, als wäre es nie geschehen. Du kannst die Magie der Karte sofort nutzen, wenn du sie ziehst, oder zu jedem anderen Zeitpunkt vor deinem Tod.',
    },
  }),
  card({
    index: 'throne',
    rank: 'king',
    suit: 'hearts',
    small: true,
    name: { en: 'Throne', de: 'Thron' },
    text: {
      en: 'You gain proficiency in the Persuasion skill, and you double your proficiency bonus on checks made with that skill. In addition, you gain rightful ownership of a small keep somewhere in the world. However, the keep is currently in the hands of monsters, which you must clear out before you can claim the keep as yours.',
      de: 'Du erhältst Übung in der Fertigkeit Überzeugen, und dein Übungsbonus verdoppelt sich bei Würfen mit dieser Fertigkeit. Außerdem wirst du rechtmäßiger Besitzer einer kleinen Burg irgendwo auf der Welt. Allerdings ist die Burg derzeit in der Hand von Monstern, die du vertreiben musst, bevor du die Burg als deine beanspruchen kannst.',
    },
  }),
  card({
    index: 'key',
    rank: 'queen',
    suit: 'hearts',
    small: true,
    name: { en: 'Key', de: 'Schlüssel' },
    text: {
      en: 'A rare or rarer magic weapon with which you are proficient appears in your hands. The GM chooses the weapon.',
      de: 'Eine seltene oder noch seltenere magische Waffe, in deren Umgang du geübt bist, erscheint in deinen Händen. Der SL wählt die Waffe.',
    },
  }),
  card({
    index: 'knight',
    rank: 'jack',
    suit: 'hearts',
    small: true,
    name: { en: 'Knight', de: 'Ritter' },
    text: {
      en: 'You gain the service of a 4th-level fighter who appears in a space you choose within 30 feet of you. The fighter is of the same race as you and serves you loyally until death, believing the fates have drawn him or her to you. You control this character.',
      de: 'Ein Kämpfer der 4. Stufe tritt in deine Dienste. Er erscheint in einem Feld deiner Wahl im Umkreis von 9 m um dich. Der Kämpfer gehört deinem Volk an und dient dir treu bis in den Tod, weil er glaubt, das Schicksal habe ihn zu dir geführt. Du kontrollierst diesen Charakter.',
    },
  }),
  card({
    index: 'gem',
    rank: 'two',
    suit: 'hearts',
    name: { en: 'Gem', de: 'Juwel' },
    text: {
      en: 'Twenty-five pieces of jewelry worth 2,000 gp each or fifty gems worth 1,000 gp each appear at your feet.',
      de: 'Fünfundzwanzig Schmuckstücke im Wert von je 2.000 GM oder fünfzig Edelsteine im Wert von je 1.000 GM erscheinen zu deinen Füßen.',
    },
  }),
  card({
    index: 'talons',
    rank: 'ace',
    suit: 'clubs',
    name: { en: 'Talons', de: 'Klauen' },
    text: {
      en: "Every magic item you wear or carry disintegrates. Artifacts in your possession aren't destroyed but do vanish.",
      de: 'Jeder magische Gegenstand, den du trägst oder bei dir hast, zerfällt. Artefakte in deinem Besitz werden nicht zerstört, verschwinden aber.',
    },
  }),
  card({
    index: 'the-void',
    rank: 'king',
    suit: 'clubs',
    small: true,
    ends: true,
    name: { en: 'The Void', de: 'Die Leere' },
    text: {
      en: "This black card spells disaster. Your soul is drawn from your body and contained in an object in a place of the GM's choice. One or more powerful beings guard the place. While your soul is trapped in this way, your body is incapacitated. A *wish* spell can't restore your soul, but the spell reveals the location of the object that holds it. You draw no more cards.",
      de: 'Diese schwarze Karte bedeutet Unheil. Deine Seele wird aus deinem Körper gezogen und in einem Gegenstand an einem Ort nach Wahl des SL eingeschlossen. Ein oder mehrere mächtige Wesen bewachen diesen Ort. Solange deine Seele so gefangen ist, ist dein Körper kampfunfähig. Ein *Wunsch*-Zauber kann deine Seele nicht zurückbringen, enthüllt aber, wo sich der Gegenstand befindet, der sie festhält. Du ziehst keine weiteren Karten.',
    },
  }),
  card({
    index: 'flames',
    rank: 'queen',
    suit: 'clubs',
    small: true,
    name: { en: 'Flames', de: 'Flammen' },
    text: {
      en: 'A powerful devil becomes your enemy. The devil seeks your ruin and plagues your life, savoring your suffering before attempting to slay you. This enmity lasts until either you or the devil dies.',
      de: 'Ein mächtiger Teufel wird dein Feind. Der Teufel sinnt auf dein Verderben und plagt dein Leben, genießt dein Leiden und versucht schließlich, dich zu töten. Diese Feindschaft währt, bis du oder der Teufel stirbt.',
    },
  }),
  card({
    index: 'skull',
    rank: 'jack',
    suit: 'clubs',
    small: true,
    name: { en: 'Skull', de: 'Schädel' },
    text: {
      en: "You summon an avatar of death — a ghostly humanoid skeleton clad in a tattered black robe and carrying a spectral scythe. It appears in a space of the GM's choice within 10 feet of you and attacks you, warning all others that you must win the battle alone. The avatar fights until you die or it drops to 0 hit points, whereupon it disappears. If anyone tries to help you, the helper summons its own avatar of death. A creature slain by an avatar of death can't be restored to life.",
      de: 'Du beschwörst einen Avatar des Todes — ein geisterhaftes humanoides Skelett in einer zerlumpten schwarzen Robe mit einer geisterhaften Sense. Er erscheint in einem Feld nach Wahl des SL im Umkreis von 3 m um dich und greift dich an, wobei er alle anderen warnt, dass du den Kampf allein gewinnen musst. Der Avatar kämpft, bis du stirbst oder er auf 0 Trefferpunkte sinkt; dann verschwindet er. Versucht jemand, dir zu helfen, beschwört der Helfer seinen eigenen Avatar des Todes. Eine Kreatur, die von einem Avatar des Todes getötet wurde, kann nicht wieder zum Leben erweckt werden.',
    },
  }),
  card({
    index: 'idiot',
    rank: 'two',
    suit: 'clubs',
    name: { en: 'Idiot', de: 'Idiot' },
    text: {
      en: 'Permanently reduce your Intelligence by 1d4 + 1 (to a minimum score of 1). You can draw one additional card beyond your declared draws.',
      de: 'Deine Intelligenz sinkt dauerhaft um 1W4 + 1 (auf mindestens 1). Du darfst über deine angesagten Züge hinaus eine weitere Karte ziehen.',
    },
  }),
  card({
    index: 'donjon',
    rank: 'ace',
    suit: 'spades',
    ends: true,
    name: { en: 'Donjon', de: 'Verlies' },
    text: {
      en: "You disappear and become entombed in a state of suspended animation in an extradimensional sphere. Everything you were wearing and carrying stays behind in the space you occupied when you disappeared. You remain imprisoned until you are found and removed from the sphere. You can't be located by any divination magic, but a *wish* spell can reveal the location of your prison. You draw no more cards.",
      de: 'Du verschwindest und wirst in einem Zustand der Starre in einer extradimensionalen Sphäre eingeschlossen. Alles, was du getragen und bei dir hattest, bleibt in dem Feld zurück, in dem du verschwunden bist. Du bleibst gefangen, bis man dich findet und aus der Sphäre befreit. Keine Erkenntnismagie kann dich aufspüren, doch ein *Wunsch*-Zauber kann den Ort deines Gefängnisses enthüllen. Du ziehst keine weiteren Karten.',
    },
  }),
  card({
    index: 'ruin',
    rank: 'king',
    suit: 'spades',
    small: true,
    name: { en: 'Ruin', de: 'Ruin' },
    text: {
      en: 'All forms of wealth that you carry or own, other than magic items, are lost to you. Portable property vanishes. Businesses, buildings, and land you own are lost in a way that alters reality the least. Any documentation that proves you should own something lost to this card also disappears.',
      de: 'Jede Form von Reichtum, die du bei dir hast oder besitzt, magische Gegenstände ausgenommen, geht dir verloren. Bewegliches Eigentum verschwindet. Geschäfte, Gebäude und Land, die dir gehören, gehen auf eine Weise verloren, die die Wirklichkeit am wenigsten verändert. Auch jedes Dokument, das beweist, dass dir etwas gehören sollte, das du durch diese Karte verloren hast, verschwindet.',
    },
  }),
  card({
    index: 'euryale',
    rank: 'queen',
    suit: 'spades',
    small: true,
    name: { en: 'Euryale', de: 'Euryale' },
    text: {
      en: "The card's medusa-like visage curses you. You take a -2 penalty on saving throws while cursed in this way. Only a god or the magic of The Fates card can end this curse.",
      de: 'Das medusenhafte Antlitz der Karte verflucht dich. Solange du so verflucht bist, erhältst du einen Malus von −2 auf Rettungswürfe. Nur ein Gott oder die Magie der Karte *Die Schicksalsfäden* kann diesen Fluch beenden.',
    },
  }),
  card({
    index: 'rogue',
    rank: 'jack',
    suit: 'spades',
    small: true,
    name: { en: 'Rogue', de: 'Schurke' },
    text: {
      en: "A nonplayer character of the GM's choice becomes hostile toward you. The identity of your new enemy isn't known until the NPC or someone else reveals it. Nothing less than a *wish* spell or divine intervention can end the NPC's hostility toward you.",
      de: 'Ein Nichtspielercharakter nach Wahl des SL wird dir feindlich gesinnt. Wer dein neuer Feind ist, bleibt unbekannt, bis der NSC oder jemand anders es enthüllt. Nur ein *Wunsch*-Zauber oder göttliches Eingreifen kann die Feindseligkeit des NSC beenden.',
    },
  }),
  card({
    index: 'balance',
    rank: 'two',
    suit: 'spades',
    name: { en: 'Balance', de: 'Gleichgewicht' },
    text: {
      en: 'Your mind suffers a wrenching alteration, causing your alignment to change. Lawful becomes chaotic, good becomes evil, and vice versa. If you are true neutral or unaligned, this card has no effect on you.',
      de: 'Dein Geist erleidet eine quälende Verwandlung, die deine Gesinnung ändert. Rechtschaffen wird chaotisch, gut wird böse und umgekehrt. Bist du neutral oder ohne Gesinnung, hat diese Karte keine Wirkung auf dich.',
    },
  }),
  card({
    index: 'fool',
    rank: 'joker-tm',
    suit: 'joker',
    leaves: true,
    name: { en: 'Fool', de: 'Narr' },
    text: {
      en: 'You lose 10,000 XP, discard this card, and draw from the deck again, counting both draws as one of your declared draws. If losing that much XP would cause you to lose a level, you instead lose an amount that leaves you with just enough XP to keep your level.',
      de: 'Du verlierst 10.000 EP, legst diese Karte ab und ziehst erneut aus dem Deck; beide Züge zählen als einer deiner angesagten Züge. Würdest du durch so viele EP eine Stufe verlieren, verlierst du stattdessen nur so viele, dass dir gerade genug EP bleiben, um deine Stufe zu behalten.',
    },
  }),
  card({
    index: 'jester',
    rank: 'joker',
    suit: 'joker',
    small: true,
    leaves: true,
    name: { en: 'Jester', de: 'Possenreißer' },
    text: {
      en: 'You gain 10,000 XP, or you can draw two additional cards beyond your declared draws.',
      de: 'Du erhältst 10.000 EP, oder du darfst über deine angesagten Züge hinaus zwei weitere Karten ziehen.',
    },
  }),
];

/** The cards of a deck of 13 or 22. */
export function deckOf(size: 13 | 22): DeckCard[] {
  return DECK_CARDS.filter((c) => size === 22 || c.small);
}

const SUITS: Record<Suit, string> = {
  diamonds: '♦',
  hearts: '♥',
  clubs: '♣',
  spades: '♠',
  joker: '★',
};
const RANKS: Record<Lang, Record<Rank, string>> = {
  en: {
    ace: 'A',
    king: 'K',
    queen: 'Q',
    jack: 'J',
    two: '2',
    'joker-tm': 'Joker ™',
    joker: 'Joker',
  },
  de: {
    ace: 'A',
    king: 'K',
    queen: 'D',
    jack: 'B',
    two: '2',
    'joker-tm': 'Joker ™',
    joker: 'Joker',
  },
};

/** The playing card's corner: "K♦", "D♥" in German, "Joker ™". */
export function corner(c: DeckCard, lang: Lang): string {
  const rank = RANKS[lang][c.rank];
  return c.suit === 'joker' ? rank : `${rank}${SUITS[c.suit]}`;
}

/** Red for diamonds and hearts, as on a playing card. */
export const isRed = (c: DeckCard): boolean => c.suit === 'diamonds' || c.suit === 'hearts';

const fold = (s: string) =>
  s
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/^(the|die)\s+/, '')
    .trim();

/** The card a note names, in either language, with or without its article. */
export function cardByName(name: string): DeckCard | undefined {
  const key = fold(name);
  return DECK_CARDS.find((c) => fold(c.name.en) === key || fold(c.name.de) === key);
}
