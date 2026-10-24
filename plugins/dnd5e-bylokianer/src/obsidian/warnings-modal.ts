// Lists what the plugin could not read cleanly: one card per note, its warnings grouped by what
// happened to the data, each showing the key, the value as written and what it was read as.

import { type App, Keymap, Modal, setIcon } from 'obsidian';

import type { FactionWorld, Warning } from '../factions/model';
import { groupWarnings, type NoteWarnings, type WarningGroup } from '../factions/warning-groups';
import type { T } from '../i18n/strings';

const FACTION_NOTE = 'factions.md';

const ICONS: Record<WarningGroup, string> = {
  skipped: 'circle-slash',
  adjusted: 'alert-triangle',
  names: 'help-circle',
  notes: 'file-warning',
};

/** The note's display name: a faction note goes by its folder, any other note by its file name. */
function noteName(path: string): { name: string; file: string | null } {
  const parts = path.split('/');
  const file = parts[parts.length - 1] ?? path;
  if (file === FACTION_NOTE && parts.length > 1) {
    return { name: parts[parts.length - 2] ?? path, file };
  }
  return { name: file.replace(/\.md$/, ''), file: null };
}

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
    this.modalEl.addClass('dnd5e-warnings-modal');
    contentEl.addClass('dnd5e-warnings');
    this.setTitle(t('modal.title'));

    if (world.campaign === null) {
      contentEl.createEl('p', { text: t('modal.noCampaign'), cls: 'dnd5e-warnings-empty' });
      return;
    }

    const entities = [...world.entities.values()];
    const stats = contentEl.createDiv({ cls: 'dnd5e-warnings-stats' });
    this.renderStat(
      stats,
      entities.filter((e) => e.kind === 'faction' && !e.pseudo).length,
      t('stat.factions'),
    );
    this.renderStat(
      stats,
      entities.filter((e) => e.kind === 'character').length,
      t('stat.characters'),
    );
    this.renderStat(stats, world.warnings.length, t('stat.warnings'), world.warnings.length > 0);

    if (world.warnings.length === 0) {
      const empty = contentEl.createDiv({ cls: 'dnd5e-warnings-empty is-clean' });
      setIcon(empty.createSpan({ cls: 'dnd5e-warnings-icon' }), 'check-circle');
      empty.createSpan({ text: t('modal.noWarnings') });
      return;
    }

    for (const note of groupWarnings(world.warnings)) {
      this.renderNote(contentEl, note);
    }
  }

  onClose(): void {
    this.contentEl.empty();
  }

  private renderStat(parent: HTMLElement, value: number, label: string, alert = false): void {
    const stat = parent.createDiv({
      cls: alert ? 'dnd5e-warnings-stat is-alert' : 'dnd5e-warnings-stat',
    });
    stat.createDiv({ cls: 'dnd5e-warnings-stat-value', text: String(value) });
    stat.createDiv({ cls: 'dnd5e-warnings-stat-label', text: label });
  }

  private renderNote(parent: HTMLElement, note: NoteWarnings): void {
    const card = parent.createDiv({ cls: 'dnd5e-warnings-note' });
    const head = card.createDiv({ cls: 'dnd5e-warnings-note-head' });
    const title = head.createSpan();
    const { name, file } = noteName(note.path);
    const link = title.createEl('a', { cls: 'dnd5e-warnings-link', text: name, href: '#' });
    link.setAttr('aria-label', note.path);
    link.addEventListener('click', (event) => {
      event.preventDefault();
      this.openNote(note.path, event);
    });
    if (file !== null) {
      title.createSpan({ cls: 'dnd5e-warnings-file', text: ` · ${file}` });
    }
    head.createSpan({ cls: 'dnd5e-warnings-badge', text: String(note.count) });

    for (const { group, warnings } of note.groups) {
      card.createDiv({ cls: 'dnd5e-warnings-group', text: this.t(`group.${group}`) });
      for (const warning of warnings) {
        this.renderRow(card, group, warning);
      }
    }
  }

  private renderRow(parent: HTMLElement, group: WarningGroup, warning: Warning): void {
    const { t } = this;
    const row = parent.createDiv({ cls: `dnd5e-warnings-row is-${group}` });
    setIcon(row.createSpan({ cls: 'dnd5e-warnings-icon' }), ICONS[group]);
    const body = row.createDiv({ cls: 'dnd5e-warnings-body' });
    const subject = warning.key ?? warning.field;
    if (subject !== undefined) {
      body.createSpan({ cls: 'dnd5e-warnings-chip', text: subject });
    }
    if (warning.field === 'secret_relations') {
      body.createSpan({ cls: 'dnd5e-warnings-secret', text: t('field.secret') });
    }
    if (warning.written !== undefined && warning.read !== undefined) {
      body.createSpan({
        cls: 'dnd5e-warnings-change',
        text: `${warning.written} → ${warning.read}`,
      });
    }
    body.createSpan({
      cls: 'dnd5e-warnings-message',
      text: t(`warning.${warning.code}`, { written: warning.written ?? '' }),
    });
  }

  private openNote(path: string, event: MouseEvent): void {
    const file = this.app.vault.getFileByPath(path);
    if (file === null) {
      return;
    }
    this.close();
    void this.app.workspace.getLeaf(Keymap.isModEvent(event)).openFile(file);
  }
}
