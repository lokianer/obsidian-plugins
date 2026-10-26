// The history side of the plugin: after a relation change (or a moment of a fight), a notice that
// offers to log it to tonight's session note (asking once a day whether session N+1 is due), the write itself, session
// N+1 with the loot carried over, and the parsed log lines of all session notes for the tooltips.

import {
  appendToLog,
  carriedLoot,
  clockTime,
  findTonight,
  formatLogLine,
  type LogEntry,
  localDate,
  needsNext,
  nextSessionPath,
  nextSessionText,
  parseLog,
  type SessionNote,
  sessionsOf,
  withLoot,
} from '@obsidian-plugins/session';
import { type App, Modal, normalizePath, Notice, type Plugin, setIcon, TFile } from 'obsidian';

import { inCampaign } from '../campaign/scope';
import { buildHistory, historyFor, type HistoryEntry } from '../factions/history';
import type { FactionWorld, Mode } from '../factions/model';
import { signed } from '../factions/steps';
import type { T } from '../i18n/strings';
import type { LogMode, Settings } from './settings';
import type { WorldCache } from './world-cache';

const NOTICE_TIME = 10000;

/** A change of one relation value, by names, as the log line states it. */
export interface ValueChange {
  from: string;
  to: string;
  before: number | null;
  after: number | null;
  secret: boolean;
}

function baseName(path: string): string {
  return path.slice(path.lastIndexOf('/') + 1).replace(/\.md$/i, '');
}

/** Asks whether to start session N+1; resolves to the choice, or null when dismissed. */
class NextSessionModal extends Modal {
  private choice: 'next' | 'keep' | null = null;

  constructor(
    app: App,
    private readonly t: T,
    private readonly tonight: SessionNote,
    private readonly done: (choice: 'next' | 'keep' | null) => void,
  ) {
    super(app);
  }

  onOpen(): void {
    const { t, tonight } = this;
    const next = tonight.session + 1;
    this.setTitle(t('log.offerTitle'));
    this.contentEl.createEl('p', {
      text: t('log.offerText', { n: tonight.session, date: tonight.date ?? '', next }),
    });
    const buttons = this.contentEl.createDiv({ cls: 'modal-button-container' });
    const create = buttons.createEl('button', { cls: 'mod-cta', text: t('log.create', { next }) });
    create.addEventListener('click', () => this.pick('next'));
    const keep = buttons.createEl('button', { text: t('log.keep', { n: tonight.session }) });
    keep.addEventListener('click', () => this.pick('keep'));
  }

  private pick(choice: 'next' | 'keep'): void {
    this.choice = choice;
    this.close();
  }

  onClose(): void {
    this.contentEl.empty();
    this.done(this.choice);
  }
}

export class SessionLog {
  /** One open notice per relation, so fiddling with a slider offers one line, not many. */
  private readonly pending = new Map<string, { notice: Notice; change: ValueChange }>();
  private readonly parsed = new Map<string, { session: number; entries: LogEntry[] }>();
  private history: HistoryEntry[] = [];
  private loaded = false;
  private readonly listeners = new Set<() => void>();

  constructor(
    private readonly plugin: Plugin,
    private readonly cache: WorldCache,
    private readonly t: T,
    private readonly settings: () => Settings,
    private readonly save: (settings: Settings) => Promise<void>,
  ) {
    plugin.registerEvent(
      plugin.app.metadataCache.on('changed', (file) => {
        if (this.loaded && (this.parsed.has(file.path) || this.isSession(file))) void this.reload();
      }),
    );
    plugin.register(cache.onChange(() => void this.reload()));
  }

  // ── logging ────────────────────────────────────────────────────────────────────────────────

  /** Offers to log a change; repeated changes of the same relation merge into one offer. */
  offer(change: ValueChange): void {
    const key = `${change.from}\u0000${change.to}\u0000${change.secret ? 's' : 'p'}`;
    const open = this.pending.get(key);
    const merged = open === undefined ? change : { ...change, before: open.change.before };
    open?.notice.hide();
    if (merged.before === merged.after) {
      this.pending.delete(key);
      return;
    }
    const tonight = this.tonight();
    if (tonight === null) return;
    const line = `${merged.from} → ${merged.to}: ${this.value(merged.before)} → ${this.value(merged.after)}`;
    const notice = this.notice(line, tonight.path, () => {
      this.pending.delete(key);
      void this.log(merged);
    });
    this.pending.set(key, { notice, change: merged });
    window.setTimeout(() => {
      if (this.pending.get(key)?.notice === notice) this.pending.delete(key);
    }, NOTICE_TIME);
  }

  /**
   * The notice offering a line for the log: the line, and below it a full-width button — an icon,
   * "Log" and tonight's session under it, wrapping however long its name.
   */
  private notice(text: string, session: string, log: () => void): Notice {
    const fragment = createFragment();
    const box = fragment.createDiv({ cls: 'dnd5e-log-notice' });
    box.createDiv({ cls: 'dnd5e-log-notice-change', text });
    const button = box.createEl('button', { cls: ['mod-cta', 'dnd5e-log-button'] });
    setIcon(button.createSpan({ cls: 'dnd5e-log-button-icon' }), 'scroll-text');
    const label = button.createSpan({ cls: 'dnd5e-log-button-label' });
    label.createSpan({ cls: 'dnd5e-log-button-action', text: this.t('log.button') });
    label.createSpan({ cls: 'dnd5e-log-button-session', text: baseName(session) });
    const notice = new Notice(fragment, NOTICE_TIME);
    button.addEventListener('click', (event) => {
      event.preventDefault();
      notice.hide();
      log();
    });
    return notice;
  }

  /**
   * Offers a line of the battle tracker or the dice, by its setting: a notice with the log
   * button, written at once, or not at all.
   */
  offerLine(text: string, mode: LogMode): void {
    if (mode === 'off') return;
    const tonight = this.tonight();
    if (tonight === null) return;
    const time = clockTime(new Date());
    if (mode === 'auto') {
      void this.write(`- ${time} ${text}`, false);
      return;
    }
    this.notice(text, tonight.path, () => void this.write(`- ${time} ${text}`, false));
  }

  private value(v: number | null): string {
    return v === null ? '—' : signed(v);
  }

  private isSession(file: TFile): boolean {
    const type: unknown = this.plugin.app.metadataCache.getFileCache(file)?.frontmatter?.type;
    return typeof type === 'string' && type.trim().toLowerCase() === 'session';
  }

  private sessions(world: FactionWorld | null = this.cache.current): SessionNote[] {
    const { app } = this.plugin;
    return sessionsOf(
      app.vault
        .getMarkdownFiles()
        .filter((f) => world?.campaign == null || inCampaign(world.campaign, f.path))
        .map((f) => ({
          path: f.path,
          frontmatter: app.metadataCache.getFileCache(f)?.frontmatter,
        })),
    );
  }

  private tonight(): SessionNote | null {
    return findTonight(this.sessions());
  }

  private log(change: ValueChange): Promise<void> {
    return this.write(formatLogLine({ time: clockTime(new Date()), ...change }), change.secret);
  }

  /** Writes a line, after asking about session N+1 when today's first log needs it. */
  private async write(line: string, secret: boolean): Promise<void> {
    const tonight = this.tonight();
    if (tonight === null) {
      new Notice(this.t('log.noSession'));
      return;
    }
    const today = localDate(new Date());
    let target = tonight.path;
    if (needsNext(tonight, today)) {
      const answer = this.settings().sessionAnswer;
      const choice = answer?.date === today ? answer.choice : await this.ask(tonight);
      if (choice === null) return;
      if (answer?.date !== today) {
        await this.save({ ...this.settings(), sessionAnswer: { date: today, choice } });
      }
      if (choice === 'next') target = await this.createNext(tonight, today);
    }
    const file = this.plugin.app.vault.getFileByPath(target);
    if (file === null) return;
    await this.plugin.app.vault.process(file, (text) => appendToLog(text, line, { secret }));
    new Notice(this.t('log.logged', { session: baseName(target) }));
  }

  private ask(tonight: SessionNote): Promise<'next' | 'keep' | null> {
    return new Promise((resolve) =>
      new NextSessionModal(this.plugin.app, this.t, tonight, resolve).open(),
    );
  }

  /** The command: creates session N+1 after the newest one and returns its path. */
  async startNext(): Promise<string | null> {
    const tonight = this.tonight();
    if (tonight === null) {
      new Notice(this.t('log.noSession'));
      return null;
    }
    return this.createNext(tonight, localDate(new Date()));
  }

  /**
   * Session N+1 from the template (or a minimal note), with tonight's loot carried over and
   * marked with where it came from; an existing file of that name is reused.
   */
  private async createNext(tonight: SessionNote, today: string): Promise<string> {
    const { vault, fileManager } = this.plugin.app;
    const n = tonight.session + 1;
    const path = normalizePath(nextSessionPath(tonight, n));
    if (vault.getFileByPath(path) !== null) return path;
    const templateFile = vault.getFileByPath(normalizePath(this.settings().sessionTemplate));
    const template = templateFile === null ? null : await vault.cachedRead(templateFile);
    let text = nextSessionText(template, n, today);
    const previous = vault.getFileByPath(tonight.path);
    if (previous !== null) {
      const origin = fileManager.generateMarkdownLink(previous, path);
      text = withLoot(text, carriedLoot(await vault.cachedRead(previous), origin));
    }
    await vault.create(path, text);
    return path;
  }

  // ── history ────────────────────────────────────────────────────────────────────────────────

  onChange(listener: () => void): () => void {
    this.listeners.add(listener);
    if (!this.loaded) void this.reload();
    return () => this.listeners.delete(listener);
  }

  /** A relation's newest changes, formatted for a tooltip ("−2 → −3 in S14"). */
  describe(from: string, to: string, mode: Mode): string[] {
    return historyFor(this.history, from, to, mode).map(
      (h) =>
        `${this.value(h.before)} → ${this.value(h.after)} ${this.t('history.in', { session: h.session })}`,
    );
  }

  private async reload(): Promise<void> {
    const world = this.cache.current;
    if (world === null || world.campaign === null) return;
    const { vault } = this.plugin.app;
    const sessions = this.sessions(world);
    this.parsed.clear();
    for (const s of sessions) {
      const file = vault.getFileByPath(s.path);
      if (file instanceof TFile) {
        this.parsed.set(s.path, {
          session: s.session,
          entries: parseLog(await vault.cachedRead(file)),
        });
      }
    }
    this.history = buildHistory(world, [...this.parsed.values()]);
    this.loaded = true;
    for (const listener of this.listeners) listener();
  }
}
