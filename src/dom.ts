import { VNode, VContent, VAttrs, LifecycleListener } from "./core/node";

class ElementData {
  listeners: { [k: string]: EventListenerObject };
  onremove: LifecycleListener;

  constructor() {
    this.listeners = {};
  }
}

interface ElementWithData extends Element {
  __vdomData: ElementData;
}

const some = (...array: boolean[]) => array.some(el => el);
function createArray<T, X>(input: ArrayLike<T>, fn?: (value: T, i: number) => X): X[] {
  const result = new Array(input.length);
  if (fn) {
    for (let i = 0; i < input.length; i++) {
      result[i] = fn(input[i], i);
    }
  } else {
    for (let i = 0; i < input.length; i++) {
      result[i] = input[i];
    }
  }
  return result;
}

function getElementData(element: Element) {
  const el = element as ElementWithData;
  if (!el.__vdomData) {
    el.__vdomData = new ElementData();
  }
  return el.__vdomData;
}

function createDom(document: Document, vdom: VContent, callbacks: Function[]): Node | null {
  if (vdom === null || vdom === undefined) {
    return null;
  }
  if (vdom instanceof VNode) {
    const element = document.createElement(vdom.element);
    mountAttributes(element, vdom.attrs);
    mountHooks(element, vdom.attrs, callbacks);
    if (vdom.children) {
      vdom.children.forEach(child => {
        const node = createDom(document, child, callbacks);
        if (node) {
          element.appendChild(node);
        }
      });
    }
    return element;
  }
  return document.createTextNode(`${vdom}`);
}

function mountHooks(element: Element, attrs: VAttrs | null, callbacks: Function[]) {
  if (!attrs) {
    return;
  }
  const { oncreate, onremove } = attrs;
  if (oncreate) {
    callbacks.push(() => oncreate(element));
  }
  if (onremove) {
    const data = getElementData(element);
    data.onremove = () => onremove(element);
  }
}

function mountAttributes(element: Element, attrs: any): boolean {
  if (!attrs) {
    return false;
  }
  return some(
    ...Object.keys(attrs).map(attr => {
      if (attr[0] === "o" && attr[1] === "n") {
        mountListener(element, attr, attrs[attr]);
        return false;
      } else if (attr in element) {
        const aElement: any = element;
        if (aElement[attr] !== attrs[attr]) {
          aElement[attr] = attrs[attr];
          return true;
        }
      } else {
        const value = attrs[attr];
        if (value !== element.getAttribute(attr)) {
          element.setAttribute(attr, value);
          return true;
        }
      }
      return false;
    })
  );
}

function mountListener(element: Element, attribute: string, listener: EventListener) {
  let data = getElementData(element);
  const existing = data.listeners[attribute];
  if (existing) {
    existing.handleEvent = listener;
  } else {
    data.listeners[attribute] = {
      handleEvent: listener
    };
    element.addEventListener(attribute.substr(2), data.listeners[attribute]);
  }
}

function diffChildren(parent: Element, elements: NodeList, vnodes: VContent[], callbacks: Function[]): boolean {
  return some(
    ...createArray({ length: Math.max(elements.length, vnodes.length) }, (_, i) => {
      return diff(parent, elements[i], vnodes[i], callbacks);
    })
  );
}

function diffAttributes(element: Element, attrs: any): boolean {
  const oldAttrs = createArray(element.attributes, a => a.name);
  let changed = some(
    ...oldAttrs.map(name => {
      if (attrs && attrs[name]) {
        return false;
      }
      element.removeAttribute(name);
      return true;
    })
  );
  const data = (element as ElementWithData).__vdomData;
  if (data && data.listeners) {
    Object.keys(data.listeners).forEach(name => {
      if (!attrs || !attrs[name]) {
        element.removeEventListener(name.substr(2), data.listeners[name]);
      }
    });
  }
  return mountAttributes(element, attrs) || changed;
}

function diff(parent: Element, element: Node | null, vdom: VContent, callbacks: Function[]): boolean {
  if (element instanceof Element && vdom instanceof VNode) {
    if (vdom.element === element.tagName.toLowerCase()) {
      const changed = some(
        diffAttributes(element, vdom.attrs),
        diffChildren(element, element.childNodes, vdom.children, callbacks)
      );
      if (changed && vdom.attrs && vdom.attrs.onupdate) {
        const { onupdate } = vdom.attrs;
        callbacks.push(() => onupdate(element));
      }
      return changed;
    }
  }
  if (element instanceof Text && !(vdom instanceof VNode)) {
    const newValue = `${vdom}`;
    if (element.nodeValue !== newValue) {
      element.nodeValue = newValue;
      return true;
    }
    return false;
  }
  const newElement = createDom(parent.ownerDocument, vdom, callbacks);
  if (newElement) {
    if (element) {
      parent.insertBefore(newElement, element);
    } else {
      parent.appendChild(newElement);
    }
  }
  if (element) {
    if (element instanceof Element) {
      unmountElement(element, callbacks);
    }
    element.parentNode!.removeChild(element);
  }
  return true;
}

function unmountElement(element: Element, callbacks: Function[]) {
  createArray(element.children, element => unmountElement(element, callbacks));
  const data = (element as ElementWithData).__vdomData;
  if (data && data.onremove) {
    const { onremove } = data;
    callbacks.push(() => onremove(element));
  }
}

export default function render(root: Element, vdom: VContent) {
  const callbacks: Function[] = [];
  diff(root, root.firstChild, vdom, callbacks);
  callbacks.forEach(cb => cb());
}
