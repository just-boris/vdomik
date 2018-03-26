import "./jsx";
import { VNode } from "./core/node";

export * from "./core/node";

export default function h(element: string, attributes: any, ...children: any[]) {
  const flatChildren = [].concat(...children);
  return new VNode(element, attributes, flatChildren);
}
