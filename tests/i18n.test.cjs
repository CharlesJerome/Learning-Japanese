'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../dist/i18n.js'), 'utf8');

// Model text-node replacement and connectivity: both matter when a renderer
// replaces children that the translation layer previously visited.
function setup() {
  const events = () => {
    const listeners = new Map();
    return {
      addEventListener(type, listener) {
        if (!listeners.has(type)) listeners.set(type, []);
        listeners.get(type).push(listener);
      },
      dispatchEvent(event) {
        for (const listener of [...(listeners.get(event.type) || [])]) listener(event);
      }
    };
  };
  class Node {
    constructor(nodeType) { this.nodeType = nodeType; this.parentNode = null; }
    get parentElement() { return this.parentNode?.nodeType === 1 ? this.parentNode : null; }
    get isConnected() { return this.nodeType === 9 || !!this.parentNode?.isConnected; }
    remove() {
      if (!this.parentNode) return;
      const siblings = this.parentNode.childNodes;
      siblings.splice(siblings.indexOf(this), 1);
      this.parentNode = null;
    }
  }
  class Text extends Node {
    constructor(value) { super(3); this.nodeValue = String(value); }
    get textContent() { return this.nodeValue; }
    set textContent(value) { this.nodeValue = String(value); }
  }
  class Element extends Node {
    constructor(tagName, attributes = {}) {
      super(1); this.tagName = tagName; this.childNodes = []; this.dataset = {};
      this.attributes = {}; Object.assign(this, events());
      for (const [name, value] of Object.entries(attributes)) this.setAttribute(name, value);
    }
    setAttribute(name, value) {
      this.attributes[name] = String(value);
      if (name === 'id' || name === 'lang') this[name] = String(value);
      if (name.startsWith('data-')) this.dataset[name.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = String(value);
    }
    append(...nodes) {
      for (const item of nodes) {
        const node = typeof item === 'string' ? new Text(item) : item;
        node.remove(); node.parentNode = this; this.childNodes.push(node);
      }
    }
    get textContent() { return this.childNodes.map(node => node.textContent).join(''); }
    set textContent(value) {
      for (const node of this.childNodes) node.parentNode = null;
      this.childNodes = [];
      if (String(value)) this.append(new Text(value));
    }
    matches(selector) {
      if (selector.startsWith('#')) return this.id === selector.slice(1);
      if (selector.startsWith('.')) return (this.attributes.class || '').split(/\s+/).includes(selector.slice(1));
      const attribute = selector.match(/^\[([^=\]]+)(?:="([^"]*)")?\]$/);
      if (attribute) return attribute[2] === undefined
        ? Object.hasOwn(this.attributes, attribute[1])
        : this.attributes[attribute[1]] === attribute[2];
      return this.tagName === selector;
    }
    closest(selectors) {
      for (let node = this; node; node = node.parentElement) {
        if (selectors.split(',').some(selector => node.matches(selector))) return node;
      }
      return null;
    }
    querySelectorAll(selectors) {
      return descendants(this).filter(node => node.nodeType === 1 && selectors.split(',').some(selector => node.matches(selector)));
    }
  }
  function descendants(root) {
    return (root.childNodes || []).flatMap(node => [node, ...descendants(node)]);
  }
  const document = Object.assign(new Node(9), events());
  const html = new Element('html'); html.parentNode = document;
  document.childNodes = [html]; document.documentElement = html;
  document.querySelectorAll = selector => Element.prototype.querySelectorAll.call(document, selector);
  document.getElementById = id => descendants(document).find(node => node.id === id) || null;
  document.createTreeWalker = root => {
    const nodes = descendants(root).filter(node => node.nodeType === 3);
    let index = -1;
    return { currentNode: root, nextNode() { this.currentNode = nodes[++index]; return this.currentNode || null; } };
  };
  const window = events(), saved = new Map();
  vm.runInNewContext(source, {
    window, document, NodeFilter: { SHOW_TEXT: 4 },
    localStorage: { getItem: key => saved.get(key) ?? null, setItem: (key, value) => saved.set(key, value) },
    CustomEvent: class { constructor(type, options = {}) { this.type = type; this.detail = options.detail; } }
  });
  function element(text, attributes = {}, parent = html) {
    const node = new Element('div', attributes); node.textContent = text; parent.append(node); return node;
  }
  return { i18n: window.NihongoI18n, window, document, element, saved };
}

test('a translated value that is also a source key roundtrips without replacing its original key', () => {
  const { i18n, element } = setup();
  const goal = element('  YOUR 6-MONTH GOAL  ');
  i18n.refresh();
  for (let round = 0; round < 3; round++) {
    i18n.choose('my'); i18n.refresh();
    assert.equal(goal.textContent, '  ၆ လ ရည်မှန်းချက်  ');
    i18n.choose('en'); i18n.refresh();
    assert.equal(goal.textContent, '  YOUR 6-MONTH GOAL  ');
  }
});

test('authored mixed labels and dynamic account messages have English and Burmese forms', () => {
  const { i18n, element, saved } = setup();
  const labels = [
    ['Listen / နားထောင်', 'Listen', 'နားထောင်'],
    ['Sign in / ဝင်မယ်', 'Sign in', 'ဝင်မယ်'],
    ['Profile saved. / အကောင့်အချက်အလက် သိမ်းပြီးပါပြီ', 'Profile saved.', 'ပရိုဖိုင် သိမ်းပြီးပါပြီ။'],
    ['Loading your progress… / တိုးတက်မှုကို ဖတ်နေပါတယ်', 'Loading your progress…', 'တိုးတက်မှုကို ဖတ်နေပါတယ်'],
    ['YOUTUBE · N5 · မြန်မာ', 'YOUTUBE · N5 · BURMESE', 'YOUTUBE · N5 · မြန်မာ']
  ].map(([source, en, my]) => ({ node: element(source), en, my }));
  i18n.refresh();
  for (const row of labels) assert.equal(row.node.textContent, row.en);
  i18n.choose('my');
  for (const row of labels) assert.equal(row.node.textContent, row.my);
  i18n.choose('en');
  for (const row of labels) assert.equal(row.node.textContent, row.en);
  assert.equal(saved.get('nihongo-language'), 'en');
});

test('setText replaces an older source and keeps the latest status across language switches', () => {
  const { i18n, element } = setup();
  const status = element('Sign in');
  i18n.refresh(); // Its original child was tracked before the status renderer took ownership.
  i18n.setText(status, 'Loading your progress… / တိုးတက်မှုကို ဖတ်နေပါတယ်');
  i18n.refresh(); i18n.choose('my');
  i18n.setText(status, 'Progress saved to your account / သင့်အကောင့်မှာ သိမ်းပြီးပါပြီ');
  i18n.refresh();
  assert.equal(status.textContent, 'သင့်အကောင့်မှာ သိမ်းပြီးပါပြီ');
  i18n.choose('en'); i18n.refresh();
  assert.equal(status.textContent, 'Progress saved to your account');
  i18n.choose('my');
  assert.equal(status.textContent, 'သင့်အကောင့်မှာ သိမ်းပြီးပါပြီ');
});

test('current interpolation parameters survive repeated refresh and language changes', () => {
  const { i18n, element } = setup();
  i18n.register({ 'Saved {count} cards': { my: 'ကတ် {count} ခု သိမ်းပြီး' } });
  const status = element('');
  i18n.setText(status, 'Saved {count} cards', { count: 1 });
  i18n.refresh();
  i18n.setText(status, 'Saved {count} cards', { count: 3 });
  i18n.choose('my');
  assert.equal(status.textContent, 'ကတ် 3 ခု သိမ်းပြီး');
  i18n.choose('en');
  assert.equal(status.textContent, 'Saved 3 cards');
});

test('external replacements and edits are not overwritten by previously tracked text', () => {
  const { i18n, element } = setup();
  const owned = element(''), staticLabel = element('Sign in'), edited = element('Email');
  i18n.setText(owned, 'Sign in'); i18n.refresh();
  owned.textContent = 'A newer account status';
  staticLabel.textContent = 'A newly rendered profile';
  edited.childNodes[0].nodeValue = 'A name supplied by the learner';
  i18n.choose('my'); i18n.choose('en');
  assert.equal(owned.textContent, 'A newer account status');
  assert.equal(staticLabel.textContent, 'A newly rendered profile');
  assert.equal(edited.textContent, 'A name supplied by the learner');
});

test('removed nodes stop participating in translation refreshes', () => {
  const { i18n, element } = setup();
  const removed = element('Sign in');
  i18n.refresh(); removed.remove(); i18n.choose('my');
  assert.equal(removed.textContent, 'Sign in');
});

test('Japanese lessons, native language names and user-provided Burmese remain intact', () => {
  const { i18n, element } = setup();
  const japanese = element('今日は日本語を勉強します。', { lang: 'ja' });
  const japaneseGloss = element('Sign in', {}, japanese);
  const name = element('မောင်အောင် / learner');
  const greeting = element('၆ လ ရည်မှန်းချက်', { id: 'profile-greeting' });
  const languageMenu = element('', { id: 'language-menu' });
  const burmeseOption = element('မြန်မာ', { 'data-language': 'my' }, languageMenu);
  const unknown = 'သင်ယူသူ ရေးထားသော စာသား / custom text';
  i18n.refresh(); i18n.choose('my'); i18n.choose('en');
  assert.equal(japanese.textContent, '今日は日本語を勉強します。Sign in');
  assert.equal(japaneseGloss.textContent, 'Sign in');
  assert.equal(name.textContent, 'မောင်အောင် / learner');
  assert.equal(greeting.textContent, '၆ လ ရည်မှန်းချက်');
  assert.equal(burmeseOption.textContent, 'မြန်မာ');
  assert.equal(i18n.t(unknown), unknown);
});

test('markup inserted by a languagechange renderer is translated before choose returns', () => {
  const { i18n, element, window } = setup();
  let rendered;
  window.addEventListener('languagechange', () => {
    rendered?.remove(); rendered = element('Show answer / အဖြေကြည့်မယ်');
  });
  i18n.choose('my');
  assert.equal(rendered.textContent, 'အဖြေကြည့်မယ်');
  i18n.choose('en');
  assert.equal(rendered.textContent, 'Show answer');
});
