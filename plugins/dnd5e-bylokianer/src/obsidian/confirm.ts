// A yes-or-no question before something is removed from a note.

import { type App, Modal } from 'obsidian';

import type { T } from '../i18n/strings';

/** Asks `text` under `title`; resolves true when the GM confirms with `ok`. */
export function confirm(app: App, t: T, title: string, text: string, ok: string): Promise<boolean> {
  return new Promise((resolve) => {
    let answer = false;
    const modal = new Modal(app);
    modal.setTitle(title);
    modal.contentEl.createEl('p', { text });
    const buttons = modal.contentEl.createDiv({ cls: 'modal-button-container' });
    const yes = buttons.createEl('button', { cls: 'mod-warning', text: ok });
    yes.addEventListener('click', () => {
      answer = true;
      modal.close();
    });
    const no = buttons.createEl('button', { text: t('confirm.cancel') });
    no.addEventListener('click', () => modal.close());
    modal.onClose = () => resolve(answer);
    modal.open();
  });
}
