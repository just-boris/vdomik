import "./jsx";
import { VNode, VAttrs } from "./core/node";

export * from "./core/node";

export default function h(element: string, attributes: VAttrs, ...children: any[]) {
  const flatChildren = [].concat(...children);
  return new VNode(element, attributes, flatChildren);
}
