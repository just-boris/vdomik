import { VNode, VContent } from "./core/node";

function createDom(document: Document, vdom: VContent): Node | null {
  if (!vdom) {
    return null;
  }
  if (vdom instanceof VNode) {
    const element = document.createElement(vdom.element);
    if (vdom.attrs) {
      Object.keys(vdom.attrs).forEach(attr => element.setAttribute(attr, vdom.attrs[attr]));
    }
    if (vdom.children) {
      vdom.children.forEach(child => mount(element, child));
    }
    return element;
  }
  return document.createTextNode(`${vdom}`);
}

function mount(root: Element, vdom: VContent) {
  const document = root.ownerDocument;
  const node = createDom(document, vdom);
  if (node) {
    root.appendChild(node);
  }
}

function diffChildren(parent: Element, elements: Node[], vnodes: VContent[]): void {
  Array.from({ length: Math.max(elements.length, vnodes.length) }).forEach((_, i) => {
    diff(parent, elements[i], vnodes[i]);
  });
}

function diff(parent: Element, element: Node | null, vdom: VContent): void {
  if (element instanceof Element && vdom instanceof VNode) {
    if (vdom.element === element.tagName.toLowerCase()) {
      // TODO diff attributes
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
