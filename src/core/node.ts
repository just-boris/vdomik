export type VContent = VNode<any> | string | number;

export class VNode<T> {
  constructor(public element: string, public attrs: T | null, public children: VContent[]) {}
}
