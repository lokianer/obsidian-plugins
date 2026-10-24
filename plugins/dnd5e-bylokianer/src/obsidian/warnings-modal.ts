// Lists what the plugin could not read cleanly, one row per warning, each linking to its note.

import { type App, Modal } from 'obsidian';

import type { FactionWorld, Warning } from '../factions/model';
import type { T } from '../i18n/strings';

export class WarningsModal extends Modal {
	constructor(
		app: App,
		private readonly world: FactionWorld,
		private readonly t: T,
	) {
		super(app);
	}

	onOpen(): void {
		const { contentEl, world, t } = this;
		contentEl.addClass('dnd5e-warnings');
		this.setTitle(t('modal.title'));

		if (world.campaign === null) {
			contentEl.createEl('p', { text: t('modal.noCampaign'), cls: 'dnd5e-warnings-summary' });
			return;
		}

		const entities = [...world.entities.values()];
		contentEl.createEl('p', {
			cls: 'dnd5e-warnings-summary',
			text: t('summary', {
				factions: entities.filter((e) => e.kind === 'faction' && !e.pseudo).length,
				characters: entities.filter((e) => e.kind === 'character').length,
				warnings: world.warnings.length,
			}),
		});

		if (world.warnings.length === 0) {
			contentEl.createEl('p', { text: t('modal.noWarnings'), cls: 'dnd5e-warnings-empty' });
			return;
		}

		const list = contentEl.createEl('ul', { cls: 'dnd5e-warnings-list' });
		for (const warning of world.warnings) {
			this.renderRow(list, warning);
		}
	}

	onClose(): void {
		this.contentEl.empty();
	}

	private renderRow(list: HTMLElement, warning: Warning): void {
		const row = list.createEl('li', { cls: 'dnd5e-warnings-row' });
		row.createDiv({
			cls: 'dnd5e-warnings-message',
			text: this.t(`warning.${warning.code}`, {
				key: warning.key ?? '',
				field: warning.field ?? 'relations',
			}),
		});
		const link = row.createEl('a', { cls: 'dnd5e-warnings-path', text: warning.path, href: '#' });
		link.addEventListener('click', (event) => {
			event.preventDefault();
			this.close();
			void this.app.workspace.openLinkText(warning.path, '', false);
		});
	}
}
