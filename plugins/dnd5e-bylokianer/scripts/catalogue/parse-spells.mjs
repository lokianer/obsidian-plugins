// Splits a book's text (from `pdftotext -enc UTF-8`, reading order) into spell entries: the name,
// the level line, the four header fields and the body. Scanned books carry OCR noise (spaces inside
// words and numbers, `i minute`), so this only cuts and labels; the facts are cleaned afterwards.
// The text is read as one stream: a level phrase followed closely by the casting-time keyword
// starts an entry, its name is the capitals just before it. Holds no book text itself. Pure.

const raw = String.raw;

/** A word that may carry OCR spaces between its letters. */
const spaced = (word) =>
	word
		.split('')
		.map((c) => (c === ' ' ? raw`\s+` : c.replace(/[.*+?^${}()|[\]\\]/g, raw`\$&`)))
		.join(raw`\s*`);

const SCHOOLS = {
	en: [
		'abjuration',
		'conjuration',
		'divination',
		'enchantment',
		'evocation',
		'illusion',
		'necromancy',
		'transmutation',
	],
	it: [
		'abiurazione',
		'ammaliamento',
		'divinazione',
		'evocazione',
		'illusione',
		'invocazione',
		'necromanzia',
		'trasmutazione',
	],
};

const school = (dialect) => `(?:${SCHOOLS[dialect].map(spaced).join('|')})`;

/** The level phrases: `3rd-level evocation`, `Evocation cantrip`; `Invocazione di 3° livello (mago)`. */
const LEVEL = {
	en: new RegExp(
		// OCR reads `1st` as `Ist` or `l s t`, `5th` as `Sth` or `Stli`, `level` as `/eve/`.
		raw`(?:[\dIlS|&]\s*(?:s\s*t|n\s*d|r\s*d|t\s*h|t\s*l\s*i)\s*-?\s*(?:${spaced('level')}|/eve/)\s+${school('en')}|${school('en')}\s+${spaced('cantrip')})(?:\s*\(\s*ritual\s*\))?`,
		'giu',
	),
	// OCR reads `1°` as `I 0`, splits `di` and glues it to the school (`diAmmaliamento`).
	it: new RegExp(
		raw`(?:${school('it')}\s+${spaced('di')}\s+[\dIl]\s*\S?\s*${spaced('livello')}|${spaced('trucchetto')}\s+${spaced('di')}\s*${school('it')})\s*\([^)]*\)`,
		'giu',
	),
};

const WORDS = {
	en: { casting: 'Casting Time', range: 'Range', components: 'Components', duration: 'Duration' },
	it: {
		casting: 'Tempo di lancio',
		range: 'Gittata',
		components: 'Componenti',
		duration: 'Durata',
	},
};

/** A keyword with optional OCR spaces between its letters, followed by a colon. */
const keyword = (word, flags = 'i') => new RegExp(`${spaced(word)}\\s*:`, flags);

/** The most text an entry's body keeps (characters). */
const MAX_BODY = 8000;

/** How far after a level phrase its casting time may start (characters). */
const NEAR = 40;

/** The name before a level phrase: the capitals on its line, else the nearest line above. */
function nameBefore(text, at) {
	const before = text.slice(Math.max(0, at - 160), at);
	const lines = before.split(/\r?\n/);
	const same = lines.pop() ?? '';
	const caps = (s) =>
		s
			.trim()
			.match(/[\p{Lu}\d][\p{Lu}\d\s'’/,:-]*$/u)?.[0]
			.trim() ?? '';
	const own = caps(same);
	if (own.length >= 2) return { name: own, start: at - same.length + same.lastIndexOf(own) };
	for (let i = lines.length - 1, offset = same.length; i >= 0; i--) {
		offset += lines[i].length + 1;
		const found = caps(lines[i]);
		if (found.length >= 2 && found === lines[i].trim()) {
			return { name: found, start: at - offset + lines[i].indexOf(found) };
		}
		if (lines[i].trim() !== '') break;
	}
	return { name: '', start: at };
}

/** The header fields: each keyword's text up to the next keyword; the duration to its line's end. */
function header(text, words) {
	const pos = Object.fromEntries(
		Object.entries(words).map(([key, word]) => {
			const m = text.match(keyword(word));
			return [
				key,
				m === null ? null : { at: m.index ?? 0, end: (m.index ?? 0) + m[0].length },
			];
		}),
	);
	const starts = Object.values(pos).flatMap((p) => (p === null ? [] : [p.at]));
	const value = (key) => {
		const p = pos[key];
		if (p === null) return '';
		const next = Math.min(...starts.filter((s) => s > p.at), text.length);
		let v = text.slice(p.end, next);
		if (key === 'duration') v = v.split(/\r?\n/)[0] ?? '';
		return v.replace(/\s+/g, ' ').trim();
	};
	const duration = pos.duration;
	const end = duration === null ? 0 : text.indexOf('\n', duration.end);
	return {
		casting: value('casting'),
		range: value('range'),
		components: value('components'),
		duration: value('duration'),
		end: end < 0 ? text.length : end,
	};
}

/** Level phrases that start an entry (the casting-time keyword follows closely). */
function heads(text, dialect) {
	const casting = keyword(WORDS[dialect].casting);
	return [...text.matchAll(LEVEL[dialect])]
		.filter((m) => {
			const after = text.slice((m.index ?? 0) + m[0].length);
			const c = after.match(casting);
			return c !== null && (c.index ?? 0) <= NEAR;
		})
		.map((m) => ({ at: m.index ?? 0, level: m[0], ...nameBefore(text, m.index ?? 0) }));
}

/** The spell entries of a book's text, in book order. */
export function segmentSpells(text, dialect) {
	const found = heads(text, dialect);
	return found.map((h, k) => {
		const stop = found[k + 1]?.start ?? text.length;
		const rest = text.slice(h.at + h.level.length, stop);
		const { end, ...fields } = header(rest, WORDS[dialect]);
		return {
			name: h.name,
			levelLine: h.level.replace(/\s+/g, ' ').trim(),
			...fields,
			// The book's last spell runs on into the following chapters; no spell is this long.
			body: rest.slice(end, end + MAX_BODY).trim(),
		};
	});
}

/** Casting-time keywords no entry claimed: what the cutter may have missed, with their context. */
export function unmatched(text, dialect) {
	const claimed = new Set();
	const casting = keyword(WORDS[dialect].casting, 'gi');
	for (const h of heads(text, dialect)) {
		const m = text.slice(h.at).match(keyword(WORDS[dialect].casting));
		if (m !== null) claimed.add(h.at + (m.index ?? 0));
	}
	return [...text.matchAll(casting)]
		.filter((m) => !claimed.has(m.index ?? 0))
		.map((m) =>
			text.slice(Math.max(0, (m.index ?? 0) - 160), (m.index ?? 0) + 40).replace(/\s+/g, ' '),
		);
}
