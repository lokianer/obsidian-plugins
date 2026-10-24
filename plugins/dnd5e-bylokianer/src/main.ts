import { getLanguage, Plugin } from 'obsidian';

import { buildWorld } from './factions/world';
import { createT } from './i18n/strings';
import { collectNotes } from './obsidian/notes';
import { WarningsModal } from './obsidian/warnings-modal';

export default class Dnd5ePlugin extends Plugin {
	async onload(): Promise<void> {
		const t = createT(getLanguage());
		this.addCommand({
			id: 'show-faction-warnings',
			name: t('command.showWarnings'),
			callback: async () => {
				new WarningsModal(this.app, buildWorld(await collectNotes(this.app)), t).open();
			},
		});
	}
}
