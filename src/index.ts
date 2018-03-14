import "./jsx";
import { VNode } from "./core/node";

export default function h(element: string, attributes: any, ...children: any[]) {
  return new VNode(element, attributes, children);
}
