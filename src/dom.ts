import { VNode, VContent, VAttrs, LifecycleListener } from "./core/node";

class ElementData {
  listeners: { [k: string]: EventListenerObject };
  onremove: LifecycleListener;

  constructor() {
    this.listeners = {};
  }
}

const elementsDataMap = new WeakMap<Element, ElementData>();

function getElementData(element: Element) {
  let data = elementsDataMap.get(element);
  if (!data) {
    data = new ElementData();
    elementsDataMap.set(element, data);
  }
  return data;
}

function createDom(document: Document, vdom: VContent | null, callbacks: Function[]): Node | null {
  if (!vdom) {
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

function mountAttributes(element: Element, attrs: any) {
  if (attrs) {
    Object.keys(attrs).forEach(attr => {
      if (attr[0] === "o" && attr[1] === "n") {
        mountListener(element, attr, attrs[attr]);
      } else if (attr in element) {
        (element as any)[attr] = attrs[attr];
      } else {
        const value = attrs[attr];
        if (value) {
          element.setAttribute(attr, value);
        }
      }
    });
  }
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

function diffChildren(
  parent: Element,
  elements: Node[],
  vnodes: VContent[],
  callbacks: Function[]
): void {
  Array.from({ length: Math.max(elements.length, vnodes.length) }).forEach((_, i) => {
    diff(parent, elements[i], vnodes[i], callbacks);
  });
}

function diffAttributes(element: Element, attrs: any) {
  const oldAttrs = Array.from(element.attributes).map(a => a.name);
  oldAttrs.forEach(name => {
    if (!attrs || !attrs[name]) {
      element.removeAttribute(name);
    }
  });
  const data = elementsDataMap.get(element);
  if (data && data.listeners) {
    Object.keys(data.listeners).forEach(name => {
      if (!attrs || !attrs[name]) {
        element.removeEventListener(name.substr(2), data.listeners[name]);
      }
    });
  }
  mountAttributes(element, attrs);
}

function diff(
  parent: Element,
  element: Node | null,
  vdom: VContent | null,
  callbacks: Function[]
): void {
  if (element instanceof Element && vdom instanceof VNode) {
    if (vdom.element === element.tagName.toLowerCase()) {
      diffAttributes(element, vdom.attrs);
      diffChildren(element, Array.from(element.childNodes), vdom.children, callbacks);
      return;
    }
  }
  if (element instanceof Text && !(vdom instanceof VNode)) {
    const newValue = `${vdom}`;
    if (element.nodeValue !== newValue) {
      element.nodeValue = newValue;
    }
    return;
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
}

function unmountElement(element: Element, callbacks: Function[]) {
  Array.from(element.children).forEach(element => unmountElement(element, callbacks));
  const data = elementsDataMap.get(element);
  if (data && data.onremove) {
    const { onremove } = data;
    callbacks.push(() => onremove(element));
  }
}

export default function render(root: Element, vdom: VContent | null) {
  const callbacks: Function[] = [];
  diff(root, root.firstChild, vdom, callbacks);
  callbacks.forEach(cb => cb());
}
