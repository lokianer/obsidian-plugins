// The named steps of the −5 … +5 scale and their colours (design §4.4, §4.5). Pure.

import type { StringKey, T } from '../i18n/strings';

export const MIN_VALUE = -5;
export const MAX_VALUE = 5;

/** The value clamped to the scale and rounded, so every caller names the same step. */
export function toStep(value: number): number {
  return Math.min(MAX_VALUE, Math.max(MIN_VALUE, Math.round(value))) || 0;
}

export function stepName(value: number, t: T): string {
  return t(`step.${toStep(value)}` as StringKey);
}

/** A signed number as the card writes it: `+3`, `0`, `−3` (typographic minus). */
export function signed(value: number): string {
  const step = toStep(value);
  return step > 0 ? `+${step}` : step < 0 ? `−${-step}` : '0';
}

/**
 * The colour of a value as a CSS expression over the theme's colours: red at −5, yellow at 0,
 * green at +5, mixed in between, so every theme supplies its own three anchors.
 */
export function stepColour(value: number): string {
  const step = toStep(value);
  if (step === 0) {
    return 'var(--color-yellow)';
  }
  const anchor = step < 0 ? 'var(--color-red)' : 'var(--color-green)';
  const share = (Math.abs(step) / MAX_VALUE) * 100;
  return share === 100 ? anchor : `color-mix(in srgb, ${anchor} ${share}%, var(--color-yellow))`;
}
