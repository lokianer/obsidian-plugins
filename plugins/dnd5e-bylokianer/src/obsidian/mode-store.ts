// The Public / True mode of the open faction world, shared with the tension panel. Public whenever
// no world tab is open.

import type { Mode } from '../factions/model';

export class ModeStore {
  private value: Mode = 'public';
  private readonly listeners = new Set<(mode: Mode) => void>();

  get mode(): Mode {
    return this.value;
  }

  set(mode: Mode): void {
    if (mode === this.value) return;
    this.value = mode;
    for (const listener of this.listeners) listener(mode);
  }

  onChange(listener: (mode: Mode) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}
