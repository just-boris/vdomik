export class VNode<T> {
  constructor(public element: string, public attrs?: T, public children?: any[]) {}
}
