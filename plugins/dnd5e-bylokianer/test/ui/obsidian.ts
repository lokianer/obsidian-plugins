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
  contentEl: HTMLElement = document.createElement('div');
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
