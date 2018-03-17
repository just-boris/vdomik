import { VNode, VContent } from "./core/node";

function createDom(document: Document, vdom: VContent): Node | null {
  if (!vdom) {
    return null;
  }
  if (vdom instanceof VNode) {
    const element = document.createElement(vdom.element);
    mountAttributes(element, vdom.attrs);
    if (vdom.children) {
      vdom.children.forEach(child => {
        const node = createDom(document, child);
        if (node) {
          element.appendChild(node);
        }
      });
    }
    return element;
  }
  return document.createTextNode(`${vdom}`);
}

function mountAttributes(element: Element, attrs: any) {
  if (attrs) {
    Object.keys(attrs).forEach(attr => {
      const value = attrs[attr];
      if (value) {
        element.setAttribute(attr, value);
      }
    });
  }
}

function diffChildren(parent: Element, elements: Node[], vnodes: VContent[]): void {
  Array.from({ length: Math.max(elements.length, vnodes.length) }).forEach((_, i) => {
    diff(parent, elements[i], vnodes[i]);
  });
}

function diffAttributes(element: Element, attrs: any) {
  const oldAttrs = Array.from(element.attributes).map(a => a.name);
  oldAttrs.forEach(name => {
    if (!attrs[name]) {
      element.removeAttribute(name);
    }
  });
  mountAttributes(element, attrs);
}

function diff(parent: Element, element: Node | null, vdom: VContent): void {
  if (element instanceof Element && vdom instanceof VNode) {
    if (vdom.element === element.tagName.toLowerCase()) {
      diffAttributes(element, vdom.attrs);
      diffChildren(element, Array.from(element.childNodes), vdom.children);
      return;
    }
  }
  if (element instanceof Text && !(vdom instanceof Node)) {
    const newValue = `${vdom}`;
    if (element.nodeValue !== newValue) {
      element.nodeValue = newValue;
    }
    return;
  }
  const newElement = createDom(parent.ownerDocument, vdom);
  if (newElement) {
    if (element) {
      parent.insertBefore(newElement, element);
    } else {
      parent.appendChild(newElement);
    }
  }
  if (element) {
    element.parentNode!.removeChild(element);
  }
}

export default function render(root: Element, vdom: VContent) {
  diff(root, root.firstChild, vdom);
}
