// A stand-in for the `obsidian` module in the UI tests: just enough of the classes and functions the
// renderers import to run them in happy-dom. Obsidian's npm package ships types only.

export class Component {
  load(): void {}
  unload(): void {}
  addChild<C extends Component>(child: C): C {
    return child;
  }
  register(_cb: () => unknown): void {}
  registerEvent(_ref: unknown): void {}
  registerDomEvent(el: EventTarget, type: string, cb: EventListener): void {
    el.addEventListener(type, cb);
  }
}

export class ItemView extends Component {
  contentEl: HTMLElement = document.createElement('div');
  constructor(readonly leaf: unknown) {
    super();
  }
}

export class Modal extends Component {
  modalEl: HTMLElement = document.createElement('div');
  contentEl: HTMLElement = this.modalEl.createDiv();
  constructor(readonly app: unknown) {
    super();
  }
  open(): void {}
  close(): void {}
  setTitle(_title: string): this {
    return this;
  }
}

export class TFile {}

/** Every notice shown, newest last, so a test can check what the GM was told. */
export const notices: string[] = [];

export class Notice {
  constructor(message: string | DocumentFragment) {
    notices.push(typeof message === 'string' ? message : (message.textContent ?? ''));
  }
  hide(): void {}
}

export class AbstractInputSuggest<T> {
  constructor(_app: unknown, _input: HTMLInputElement) {}
  onSelect(_cb: (value: T) => void): this {
    return this;
  }
  close(): void {}
}

export function debounce<A extends unknown[]>(fn: (...args: A) => void, wait: number) {
  let timer: number | undefined;
  const run = (...args: A) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), wait);
  };
  run.cancel = () => window.clearTimeout(timer);
  return run;
}

export const Keymap = {
  isModEvent: (event: MouseEvent) => event.ctrlKey || event.metaKey,
};

export const MarkdownRenderer = {
  render(_app: unknown, markdown: string, el: HTMLElement): Promise<void> {
    el.createEl('p', { text: markdown });
    return Promise.resolve();
  },
};

export function setIcon(el: HTMLElement, name: string): void {
  el.setAttribute('data-icon', name);
}

export function normalizePath(path: string): string {
  return path.replace(/\\/g, '/').replace(/\/+/g, '/');
}

export { parse as parseYaml } from 'yaml';

export class FuzzySuggestModal<T> extends Modal {
  setPlaceholder(_text: string): void {}
  getItems(): T[] {
    return [];
  }
}

/** Obsidian's settings row, enough for the dialogs: name, text, dropdown, buttons. */
export class Setting {
  readonly settingEl: HTMLElement;
  readonly controlEl: HTMLElement;
  constructor(parent: HTMLElement) {
    this.settingEl = parent.createDiv({ cls: 'setting-item' });
    this.settingEl.createDiv({ cls: 'setting-item-name' });
    this.controlEl = this.settingEl.createDiv({ cls: 'setting-item-control' });
  }
  setName(name: string): this {
    this.settingEl.querySelector('.setting-item-name')?.setText(name);
    return this;
  }
  setDesc(_desc: string): this {
    return this;
  }
  setHeading(): this {
    return this;
  }
  addText(cb: (text: TextComponent) => void): this {
    cb(new TextComponent(this.controlEl));
    return this;
  }
  addDropdown(cb: (dropdown: DropdownComponent) => void): this {
    cb(new DropdownComponent(this.controlEl));
    return this;
  }
  addButton(cb: (button: ButtonComponent) => void): this {
    cb(new ButtonComponent(this.controlEl));
    return this;
  }
  addExtraButton(cb: (button: ButtonComponent) => void): this {
    cb(new ButtonComponent(this.controlEl, 'clickable-icon'));
    return this;
  }
}

class TextComponent {
  readonly inputEl: HTMLInputElement;
  constructor(parent: HTMLElement) {
    this.inputEl = parent.createEl('input', { type: 'text' });
  }
  setValue(value: string): this {
    this.inputEl.value = value;
    return this;
  }
  setPlaceholder(text: string): this {
    this.inputEl.placeholder = text;
    return this;
  }
  onChange(cb: (value: string) => unknown): this {
    this.inputEl.addEventListener('input', () => cb(this.inputEl.value));
    return this;
  }
}

class DropdownComponent {
  readonly selectEl: HTMLSelectElement;
  constructor(parent: HTMLElement) {
    this.selectEl = parent.createEl('select');
  }
  addOption(value: string, label: string): this {
    this.selectEl.createEl('option', { text: label, attr: { value } });
    return this;
  }
  setValue(value: string): this {
    this.selectEl.value = value;
    return this;
  }
  onChange(cb: (value: string) => unknown): this {
    this.selectEl.addEventListener('change', () => cb(this.selectEl.value));
    return this;
  }
}

class ButtonComponent {
  readonly buttonEl: HTMLButtonElement;
  constructor(parent: HTMLElement, cls?: string) {
    this.buttonEl = parent.createEl('button', cls === undefined ? undefined : { cls });
  }
  setButtonText(text: string): this {
    this.buttonEl.setText(text);
    return this;
  }
  setCta(): this {
    this.buttonEl.addClass('mod-cta');
    return this;
  }
  setIcon(name: string): this {
    this.buttonEl.setAttribute('data-icon', name);
    return this;
  }
  setTooltip(text: string): this {
    this.buttonEl.setAttribute('aria-label', text);
    return this;
  }
  onClick(cb: () => unknown): this {
    this.buttonEl.addEventListener('click', () => cb());
    return this;
  }
}
