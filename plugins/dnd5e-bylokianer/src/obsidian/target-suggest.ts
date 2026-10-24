// Suggestions for a relation's target: the campaign's factions and characters.

import { AbstractInputSuggest, type App } from 'obsidian';

import { rankTargets, type Target } from '../factions/targets';
import type { T } from '../i18n/strings';

export class TargetSuggest extends AbstractInputSuggest<Target> {
  constructor(
    app: App,
    input: HTMLInputElement,
    private readonly targets: readonly Target[],
    private readonly t: T,
  ) {
    super(app, input);
  }

  protected getSuggestions(query: string): Target[] {
    return rankTargets(this.targets, query);
  }

  renderSuggestion(target: Target, el: HTMLElement): void {
    el.addClass('dnd5e-suggestion');
    el.createDiv({ cls: 'dnd5e-suggestion-name', text: target.key });
    el.createDiv({
      cls: 'dnd5e-suggestion-detail',
      text: `${this.t(`card.kind.${target.kind}`)} · ${target.detail}`,
    });
  }
}
