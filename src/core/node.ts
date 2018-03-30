export type VAttrs = JSX.HTMLAttributes & JSX.SVGAttributes;

export type VContent = VNode<VAttrs> | string | number | null;

export interface LifecycleListener {
  (element: Element): void;
}

export class VNode<T> {
  constructor(public element: string, public attrs: T, public children: VContent[]) {}
}
