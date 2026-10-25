// Obsidian's DOM helpers (`createEl`, `createSvg`, `setCssProps` …) on happy-dom's prototypes, as
// Obsidian adds them to the browser's. Strict where Obsidian is strict: an array `cls` goes to
// `classList.add`, which throws on a token with a space — the bug that once hid the graph's nodes.

interface Info {
  cls?: string | string[];
  text?: string;
  href?: string;
  attr?: Record<string, string | number | boolean | null>;
  type?: string;
  value?: string;
  placeholder?: string;
}

/** `classList.add` as browsers do it: a token with a space throws (happy-dom lets it pass). */
function addClasses(el: Element, classes: readonly string[]): void {
  const bad = classes.find((c) => c === '' || /\s/.test(c));
  if (bad !== undefined) {
    throw new DOMException(`The token provided ('${bad}') contains HTML space characters`);
  }
  el.classList.add(...classes);
}

function apply(el: Element, info: Info = {}): void {
  if (Array.isArray(info.cls)) addClasses(el, info.cls);
  else if (info.cls !== undefined) el.setAttribute('class', info.cls);
  if (info.text !== undefined) el.textContent = info.text;
  if (info.href !== undefined) el.setAttribute('href', info.href);
  if (info.type !== undefined) el.setAttribute('type', info.type);
  if (info.placeholder !== undefined) el.setAttribute('placeholder', info.placeholder);
  for (const [key, value] of Object.entries(info.attr ?? {})) {
    if (value !== null && value !== false) el.setAttribute(key, String(value));
  }
  if (info.value !== undefined && 'value' in el) (el as HTMLInputElement).value = info.value;
}

function createEl(this: Node, tag: string, info?: Info | string): HTMLElement {
  const el = document.createElement(tag);
  apply(el, typeof info === 'string' ? { cls: info } : info);
  this.appendChild(el);
  return el;
}

function createSvg(this: Node, tag: string, info?: Info): SVGElement {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  apply(el, info);
  this.appendChild(el);
  return el;
}

const helpers = {
  createEl,
  createDiv(this: Node, info?: Info) {
    return createEl.call(this, 'div', info);
  },
  createSpan(this: Node, info?: Info) {
    return createEl.call(this, 'span', info);
  },
  createSvg,
  empty(this: Node) {
    while (this.firstChild) this.removeChild(this.firstChild);
  },
  appendText(this: Node, text: string) {
    this.appendChild(document.createTextNode(text));
  },
  addClass(this: Element, ...classes: string[]) {
    addClasses(this, classes);
  },
  removeClass(this: Element, ...classes: string[]) {
    this.classList.remove(...classes);
  },
  toggleClass(this: Element, cls: string, on: boolean) {
    this.classList.toggle(cls, on);
  },
  hasClass(this: Element, cls: string) {
    return this.classList.contains(cls);
  },
  setText(this: Element, text: string) {
    this.textContent = text;
  },
  setAttr(this: Element, key: string, value: string | number | boolean | null) {
    if (value === null || value === false) this.removeAttribute(key);
    else this.setAttribute(key, String(value));
  },
  setCssProps(this: HTMLElement, props: Record<string, string>) {
    for (const [key, value] of Object.entries(props)) this.style.setProperty(key, value);
  },
  setCssStyles(this: HTMLElement, styles: Partial<CSSStyleDeclaration>) {
    Object.assign(this.style, styles);
  },
  hide(this: HTMLElement) {
    this.setCssProps({ display: 'none' });
  },
};

for (const [name, fn] of Object.entries(helpers)) {
  Object.defineProperty(Node.prototype, name, { value: fn, configurable: true, writable: true });
}

const globals: Record<string, unknown> = {
  createDiv: (info?: Info) => createEl.call(document.createDocumentFragment(), 'div', info),
  createFragment: () => document.createDocumentFragment(),
  activeDocument: document,
  activeWindow: window,
};
for (const [name, value] of Object.entries(globals)) {
  Object.defineProperty(window, name, { value, configurable: true, writable: true });
}
