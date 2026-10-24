// The one entry point: notes in, a resolved faction world with its warnings out.

import { findCampaign } from '../campaign/scope';
import type { NoteInput } from '../types';
import { discoverEntities } from './discover';
import { resolveKeys } from './keys';
import type { FactionWorld, Warning } from './model';

function warningKey(w: Warning): string {
	return [w.path, w.code, w.key ?? '', w.field ?? ''].join('\u0000');
}

export function buildWorld(notes: readonly NoteInput[]): FactionWorld {
	const { campaign, ignored } = findCampaign(notes);
	if (campaign === null) {
		return { campaign: null, entities: new Map(), warnings: [] };
	}

	const seen = new Map<string, Warning>();
	const warn = (w: Warning) => {
		const key = warningKey(w);
		if (!seen.has(key)) {
			seen.set(key, w);
		}
	};
	for (const path of ignored) {
		warn({ path, code: 'campaign-ignored' });
	}
	const entities = resolveKeys(discoverEntities(notes, campaign, warn), warn);

	// Stable sort: within one note and code, the order the problems were found in stays.
	const warnings = [...seen.values()].sort((a, b) =>
		a.path !== b.path ? (a.path < b.path ? -1 : 1) : a.code < b.code ? -1 : a.code > b.code ? 1 : 0,
	);
	return { campaign, entities, warnings };
}
