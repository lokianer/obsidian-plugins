// The dice stage, modelled on Baldur's Gate 3's ability checks and drawn by the plugin itself: what
// is rolled and the difficulty class on top, the dice in the middle (each in its own shape) that
// tumble, land and light up, the numbers of the formula flying in as chips, the total counting up,
// and the verdict — Success, Failure, a critical one with golden rays for a kept natural 20. A
// click or Space skips to the result at any moment; the result is decided before it plays. Every
// part has its own row and the dice wrap and shrink by count, so nothing overlaps.

import { keptD20, type Roll, verdict } from '../dice/formula';
import { dieShape, shownDice } from '../dice/shapes';
import type { StringKey, T } from '../i18n/strings';

export interface StageRoll {
  /** What is rolled: "Orrin: Persuasion", or the formula. */
  label: string;
  dc: number | null;
  roll: Roll;
  /** A table roll's row (Markdown with links); null for a gap; absent for a plain roll. */
  result?: string | null;
}

/** Writes a table row's Markdown into an element (Obsidian's renderer, so links work). */
export type RenderText = (markdown: string, el: HTMLElement) => void;

/** Dice drawn at most; the rest show as one chip. */
const MAX_DRAWN = 12;
const TUMBLE = 1300;

/** The verdicts as the stage and the Dice tab name them. */
export const VERDICT_KEYS: Record<NonNullable<ReturnType<typeof verdict>>, StringKey> = {
  'critical-success': 'dice.criticalSuccess',
  'critical-failure': 'dice.criticalFailure',
  success: 'dice.success',
  failure: 'dice.failure',
};

/** Columns and size of the dice by how many are drawn. */
function layout(count: number): { cols: number; size: number } {
  if (count <= 1) return { cols: 1, size: 180 };
  if (count === 2) return { cols: 2, size: 140 };
  if (count <= 4) return { cols: count, size: 110 };
  if (count <= 8) return { cols: 4, size: 88 };
  return { cols: 6, size: 64 };
}

export class DiceStage {
  readonly el: HTMLElement;
  private timers: number[] = [];
  private animations: Animation[] = [];
  private current: StageRoll | null = null;
  private skipped = false;
  private done: (() => void) | null = null;

  constructor(
    parent: HTMLElement,
    private readonly t: T,
    /** Whether to animate (the setting and the system's reduced motion). */
    private readonly motion: () => boolean,
    /** A click on the stage while nothing plays (roll again, close …). */
    private readonly onIdleClick: () => void = () => undefined,
    private readonly render: RenderText = (md, el) => el.setText(md),
  ) {
    this.el = parent.createDiv({
      cls: 'dnd5e-stage',
      attr: { role: 'button', tabindex: '0', 'aria-live': 'polite' },
    });
    this.el.addEventListener('click', () => this.press());
    this.el.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        this.press();
      }
    });
    this.idle(t('dice.title'), null);
  }

  get playing(): boolean {
    return this.done !== null;
  }

  private press(): void {
    if (this.playing) this.skip();
    else this.onIdleClick();
  }

  /** The stage before a roll: what will be rolled and the hint. */
  idle(label: string, dc: number | null): void {
    this.stop();
    this.build(label, dc, []);
    this.part('hint')?.setText(this.t('dice.clickToRoll'));
  }

  /** Plays a roll; resolves when the verdict shows (at once when skipped or without motion). */
  play(r: StageRoll): Promise<void> {
    this.stop();
    this.current = r;
    this.skipped = false;
    const shown = r.roll.dice.flatMap((d) => shownDice(d).map((s) => ({ ...s, kept: d.kept })));
    this.build(r.label, r.dc, shown);
    return new Promise((resolve) => {
      this.done = resolve;
      if (!this.motion()) {
        this.finish();
        return;
      }
      this.part('hint')?.setText(this.t('dice.clickToSkip'));
      this.tumble();
    });
  }

  /** Jumps to the result. */
  skip(): void {
    if (!this.playing) return;
    this.skipped = true;
    this.finish();
  }

  private stop(): void {
    for (const t of this.timers) window.clearTimeout(t);
    this.timers = [];
    for (const a of this.animations) a.cancel();
    this.animations = [];
  }

  private later(ms: number, run: () => void): void {
    this.timers.push(window.setTimeout(run, ms));
  }

  private part(name: string): HTMLElement | null {
    return this.el.querySelector<HTMLElement>(`.dnd5e-stage-${name}`);
  }

  private build(
    label: string,
    dc: number | null,
    dice: { sides: number; text: string; kept: boolean }[],
  ): void {
    const el = this.el;
    el.empty();
    el.removeClass('is-critical');
    el.createDiv({ cls: 'dnd5e-stage-rays' });
    el.createDiv({ cls: 'dnd5e-stage-label', text: label });
    if (dc !== null) {
      const box = el.createDiv({ cls: 'dnd5e-stage-dc' });
      box.createDiv({ cls: 'dnd5e-stage-dc-label', text: this.t('dice.dc') });
      box.createDiv({ cls: 'dnd5e-stage-dc-value' }).createSpan({ text: String(dc) });
    }
    const drawn = dice.slice(0, MAX_DRAWN);
    const arena = el.createDiv({ cls: 'dnd5e-stage-arena' });
    arena.toggleClass('has-ring', drawn.length > 0 && drawn.length <= 2);
    const { cols, size } = layout(drawn.length);
    const row = arena.createDiv({ cls: 'dnd5e-stage-dice' });
    row.setCssProps({ '--dnd5e-die-cols': String(cols), '--dnd5e-die-size': `${size}px` });
    if (drawn.length === 0) this.drawDie(row, { sides: 20, text: '20', kept: true });
    for (const d of drawn) this.drawDie(row, d);
    const rest = dice.slice(MAX_DRAWN);
    if (rest.length > 0) {
      el.createDiv({
        cls: 'dnd5e-stage-rest',
        text: this.t('dice.more', {
          count: rest.length,
          values: rest.map((d) => d.text).join(', '),
        }),
      });
    }
    el.createDiv({ cls: 'dnd5e-stage-mods' });
    el.createDiv({ cls: 'dnd5e-stage-total' });
    el.createDiv({ cls: 'dnd5e-stage-result' });
    el.createDiv({ cls: 'dnd5e-stage-banner' });
    el.createDiv({ cls: 'dnd5e-stage-hint' });
  }

  private drawDie(row: HTMLElement, d: { sides: number; text: string; kept: boolean }): void {
    const box = row.createDiv({ cls: 'dnd5e-stage-die' });
    box.dataset.sides = String(d.sides);
    box.dataset.value = d.text;
    box.dataset.kept = String(d.kept);
    const shape = dieShape(d.sides);
    const svg = box.createSvg('svg', { attr: { viewBox: '0 0 200 200', 'aria-hidden': 'true' } });
    for (const face of shape.faces) {
      svg.createSvg('polygon', {
        cls: ['dnd5e-stage-face', `is-${face.tone}`],
        attr: { points: face.points.map((pt) => pt.join(',')).join(' ') },
      });
    }
    const num = svg.createSvg('text', {
      cls: 'dnd5e-stage-num',
      attr: {
        x: String(shape.label.x),
        y: String(shape.label.y),
        'font-size': String(d.text.length > 2 ? shape.label.size * 0.75 : shape.label.size),
      },
    });
    num.textContent = String(d.sides === 100 ? '00' : d.sides);
  }

  private dice(): HTMLElement[] {
    return [...this.el.querySelectorAll<HTMLElement>('.dnd5e-stage-die')];
  }

  /** The dice spin in 3D with their numbers flickering, then land with a wiggle. */
  private tumble(): void {
    const dice = this.dice();
    dice.forEach((die, i) => {
      if (typeof die.animate !== 'function') return;
      this.animations.push(
        die.animate(
          [
            {
              transform: 'translateY(-50px) rotateX(0) rotateY(0) rotateZ(0) scale(.6)',
              filter: 'blur(0)',
            },
            {
              transform:
                'translateY(8px) rotateX(540deg) rotateY(300deg) rotateZ(200deg) scale(1.05)',
              filter: 'blur(1.5px)',
              offset: 0.6,
            },
            {
              transform: 'rotateX(720deg) rotateY(360deg) rotateZ(350deg) scale(1)',
              filter: 'blur(0)',
              offset: 0.85,
            },
            { transform: 'rotateX(720deg) rotateY(360deg) rotateZ(366deg) scale(1)', offset: 0.93 },
            { transform: 'rotateX(720deg) rotateY(360deg) rotateZ(360deg) scale(1)' },
          ],
          { duration: TUMBLE + (i % 6) * 60, easing: 'cubic-bezier(.2,.7,.2,1)' },
        ),
      );
    });
    const flicker = window.setInterval(() => {
      for (const die of dice) {
        const sides = Number(die.dataset.sides);
        const num = die.querySelector('.dnd5e-stage-num');
        if (num !== null)
          num.textContent = String(
            1 + Math.floor(Math.random() * (sides === 100 ? 10 : sides)) * (sides === 100 ? 10 : 1),
          );
      }
    }, 70);
    this.timers.push(flicker);
    this.later(TUMBLE - 100, () => {
      window.clearInterval(flicker);
      this.land();
      this.later(350, () => this.chips(0));
    });
  }

  /** The dice show their faces; those not kept turn grey. */
  private land(): void {
    for (const die of this.dice()) {
      const num = die.querySelector('.dnd5e-stage-num');
      if (num !== null) num.textContent = die.dataset.value ?? '';
      die.toggleClass('is-dropped', die.dataset.kept === 'false');
    }
  }

  /** The numbers of the formula fly in one by one, then the total counts up. */
  private chips(from: number): void {
    const r = this.current;
    if (r === null) return;
    const keptSum = r.roll.dice.filter((d) => d.kept).reduce((s, d) => s + d.value, 0);
    const total = this.part('total');
    if (from === 0 && total !== null) total.setText(String(keptSum));
    const numbers = r.roll.numbers;
    if (from < numbers.length) {
      const chip = this.part('mods')?.createSpan({ cls: 'dnd5e-stage-mod', text: numbers[from] });
      if (chip !== undefined && typeof chip.animate === 'function') {
        this.animations.push(
          chip.animate(
            [
              { opacity: 0, transform: 'translateY(12px)' },
              { opacity: 1, transform: 'none' },
            ],
            {
              duration: 260,
              fill: 'forwards',
            },
          ),
        );
      }
      this.later(300, () => this.chips(from + 1));
      return;
    }
    this.countUp(keptSum, r.roll.total);
  }

  private countUp(from: number, to: number): void {
    const total = this.part('total');
    const steps = Math.min(12, Math.abs(to - from));
    if (steps === 0 || total === null) {
      this.later(150, () => this.finish());
      return;
    }
    let i = 0;
    const tick = () => {
      i++;
      total.setText(String(Math.round(from + ((to - from) * i) / steps)));
      if (i < steps) this.later(55, tick);
      else this.later(200, () => this.finish());
    };
    tick();
  }

  /** The result in full: faces, chips, total, verdict. */
  private finish(): void {
    const r = this.current;
    this.stop();
    if (r === null) return;
    this.land();
    const mods = this.part('mods');
    if (mods !== null) {
      mods.empty();
      for (const n of r.roll.numbers)
        mods.createSpan({ cls: ['dnd5e-stage-mod', 'is-in'], text: n });
    }
    this.part('total')?.setText(String(r.roll.total));
    const result = this.part('result');
    if (result !== null && r.result !== undefined) {
      result.empty();
      if (r.result === null) {
        result.addClass('is-gap');
        result.setText(this.t('dice.noRow'));
      } else this.render(r.result, result);
    }
    const v = verdict(r.roll, r.dc);
    const banner = this.part('banner');
    if (banner !== null && v !== null) {
      banner.setText(this.t(VERDICT_KEYS[v]));
      banner.addClass(v.endsWith('success') ? 'is-success' : 'is-failure');
      if (this.motion() && !this.skipped && typeof banner.animate === 'function') {
        this.animations.push(
          banner.animate(
            [
              { opacity: 0, letterSpacing: '.6em' },
              { opacity: 1, letterSpacing: '.2em' },
            ],
            {
              duration: 450,
            },
          ),
        );
      }
    }
    const nat = keptD20(r.roll);
    const kept = this.dice().find((d) => d.dataset.kept === 'true' && d.dataset.sides === '20');
    if (nat === 20) {
      this.el.addClass('is-critical');
      kept?.addClass('is-glowing');
    } else if (nat === 1) kept?.addClass('is-fumble');
    else if (v === 'success') kept?.addClass('is-glowing');
    this.part('hint')?.setText(this.t('dice.clickAgain'));
    const done = this.done;
    this.done = null;
    done?.();
  }
}
