# Deck of Many Things — design

Date: 2026-10-25. Status: **reviewed 2026-10-25 (every call in §8 accepted); D1 and D2 built**. Module 4 of
`dnd5e-byLokianer`, after the spellbook.

Asked for by the maintainer: "the Deck of Many Things, with the option to make one's own, otherwise
always the standard one".

## 1. What can ship

The **Deck of Many Things is in the SRD 5.1** (magic items, CC-BY-4.0), so its 22 cards, their
effects and the drawing rules can ship. Source: the 5e-bits SRD database. Its entry is **incomplete**:
the effects of Star, Sun, Talons, Throne, Vizier and The Void are missing, and Skull's avatar of death
has no stat block. Those are typed in from the SRD 5.1 document itself and checked in tests like the
spells (every card has a text in both languages, numbers and dice match). German texts are our own
translation, as for the spellbook. No card art from any book: the faces are our own design.

## 2. Goals

- **A Deck tab** (command **Open Deck of Many Things**, a ribbon icon like the faction world and the
  spellbook), one per workspace.
- **The standard deck by default**: the SRD's 22 cards, or its 13-card version (the 75 % case), as a
  setting; 22 by default.
- **Drawing by the rules**:
  1. Pick who draws: a party member of the campaign, or a free name.
  2. Declare the number of cards (a stepper, 1–22).
  3. Draw one card after another: the card turns over (a short flip, none with reduced motion) and
     shows its effect.
  4. The rules run themselves: the **Fool** and the **Jester** leave the deck once drawn, every other
     card returns; the **Fool** counts its redraw as the same declared draw; the **Jester** offers
     "10,000 XP" or "two more draws"; the **Idiot** offers one more draw; **The Void** and
     **Donjon** end the drawing. Draws beyond the declared number have no effect, as the SRD says.
- **Card face**: the playing card it stands for in a corner (K♦ for Sun, the jokers for Fool and
  Jester), the name in both languages, the effect, a small "leaves the deck" or "ends the drawing"
  badge where it applies. Colours from the theme: diamonds and hearts in red, clubs and spades in the
  text colour; nothing else.
- **The deck at a glance**: every card face down in a grid; the ones that have left are shown
  struck through. A history of every draw below (date, who, which card).
- **German too**: card names (Thron, Schlüssel, Ritter, Leere, Kerker …), effects and the rules texts,
  following the plugin's language setting like the spellbook, metres and W dice.
- **Own decks** (phase D2): any note with `type: deck` in the campaign can be drawn from in the same
  tab, picked from a list beside the standard deck.

## 3. Files first: the deck note

Drawing changes state (the Fool and the Jester leave; a history grows), so the state lives in a note.
On the first draw from the standard deck, the plugin creates `Deck of Many Things.md` in the campaign
folder (and says so):

```markdown
---
type: deck
deck: standard-22
---

# Deck of Many Things

- [ ] Vizier
- [ ] Sun
      …
- [x] Fool
- [ ] Jester

## Draws

- 2026-10-25 · [[Mira]] · Throne
- 2026-10-25 · [[Mira]] · Fool, then Key
```

- A ticked card has left the deck. A card ticked by hand leaves too; unticking puts it back.
- `deck: standard-22` (or `standard-13`) says the cards are the SRD's: the tab shows their SRD
  effects in the UI language, the note keeps only the names.
- The **Draws** list is plain lines; the plugin appends one per draw with `app.vault.process`.
- Without the plugin the note still reads as what it is: a deck with a log.

## 4. Own decks (phase D2)

The format the example vault already uses (`Silverstadt/Decks/Omens of the River.md`): a note with
`type: deck` whose first task list is the deck — an open item is still in it, a ticked one is out.

- Each item is a card: the text up to a `—` (or the whole line) is its name, the rest and any
  indented lines below are its effect.
- `returns: true` in the frontmatter makes drawn cards return (like the standard deck); without it a
  drawn card is ticked and stays out (like Omens of the River).
- `leaves:` and `ends:` (lists of card names) mark cards that leave the deck or end the drawing in a
  returning deck.
- **Deck builder** (asked for 2026-10-25: "a deck builder, typed in by hand or with an import"):
  command **New deck** and a button in the tab open a dialog — the deck's name, whether drawn cards
  return, and the cards as rows (name, effect, "leaves" / "ends"), added one by one, or filled from:
  - **the standard deck** — all 22 cards with their effects in the current language, to edit;
  - **pasted text** — one card per line, `Name — effect` (also `Name: effect`, `**Name.** effect`,
    list items, task items and Markdown table rows; header and separator rows skipped);
  - **a JSON file** — `{ "name", "returns", "cards": [{ "name", "effect", "leaves", "ends" }] }`, or
    just the array of cards, or of names (picked with the platform's file dialog, read in the
    browser — works on phones).
    It writes a new note in the campaign's deck folder (setting, `Decks` by default) and opens it in
    the tab. A deck is edited in its note afterwards: the builder makes notes, it does not rewrite them.
- The tab lists the standard deck first, then every `type: deck` note of the campaign, and remembers
  the one last picked.
- **Reset** (asked for 2026-10-25): a button in the tab asks "clear the draw history" or "clear it and
  put every card back" (unticks the list); only the Draws lines and the ticks are edited.

## 5. Non-goals and anti-goals

- No effects applied to character notes (XP, alignment, Intelligence, items): the tab shows what
  happens, the GM applies it.
- No network, no card images from books.

## 6. Phases

1. **D1 — Standard deck:** card data (English and German, the six missing effects from the SRD
   document), the tab with deck picker, who draws, declared count, drawing with all the rules above,
   the deck note with draws, the 13/22 setting.
2. **D2 — Own decks:** reading `type: deck` notes (both kinds), drawing from them in the tab, the
   deck builder with the standard-deck copy, text and JSON import, the reset, example vault notes.

## 7. Architecture

```
src/deck/cards.ts        the 22 SRD cards: index, playing card, English and German name and effect
src/deck/rules.ts        pure: a draw session (declared, drawn, extra draws, end) as a state machine
src/deck/note.ts         pure: parse a deck note (cards, ticked, returns/leaves/ends), the line edits
src/obsidian/deck-view.ts   the tab
```

The random draw uses `crypto.getRandomValues` (available on desktop and phones), behind a function
the tests replace.

## 8. Calls I made without the maintainer (check these)

- Its own tab with a ribbon icon, like the faction world and the spellbook.
- The standard deck has 22 cards by default; 13 as a setting.
- The deck's state lives in a note `Deck of Many Things.md` in the campaign folder, created on the
  first draw, with a draw history in it.
- Own decks use the example vault's task-list format; `returns`, `leaves` and `ends` as frontmatter.
- The rules of the Fool, Jester, Idiot, The Void and Donjon are automated for the standard deck only;
  own decks know only "returns", "leaves" and "ends".
- Skull's avatar of death: shown as a stat block on the card if a source has it — none does (5e-bits,
  Open5e), so it is left out rather than typed from memory.
