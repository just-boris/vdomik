import { VNode } from "./core/node";

type VContent = VNode<any> | string;

function createDom(document: Document, vdom: VContent): Node {
  if (typeof vdom === "string") {
    return document.createTextNode(vdom);
  }
  const element = document.createElement(vdom.element);
  if (vdom.attrs) {
    Object.keys(vdom.attrs).forEach(attr => element.setAttribute(attr, vdom.attrs[attr]));
  }
  if (vdom.children) {
    vdom.children.forEach(child => element.appendChild(createDom(document, child)));
  }
  return element;
}

export default function render(root: Element, vdom: VContent) {
  const document = root.ownerDocument;
  const node = createDom(document, vdom);
  root.appendChild(node);
}
