import h, { VContent, render } from "../src";

const components = new WeakMap<Element, Component>();

function getTagName(name: string): string {
  const processed = name
    .replace(/(^[A-Z])/, first => first.toLowerCase())
    .replace(/([A-Z])/g, letter => `-${letter.toLowerCase()}`);
  return `k-${processed}`;
}

export default abstract class Component<P = {}> {
  constructor(protected element: Element, protected props?: P) {}

  update() {
    render(this.element, this.content());
  }

  remove() {
    render(this.element, null);
  }

  abstract content(): VContent;
}

export function createComponent<C extends Component<T>, T>(
  Contructor: new (e: Element, p?: T) => C,
  props?: T
) {
  return h(getTagName(Contructor.name), {
    oncreate: (element: Element) => {
      const component = new Contructor(element, props);
      components.set(element, component);
      component.update();
    },
    onupdate: (element: Element) => {
      const component = components.get(element);
      if (component) {
        component.update();
      }
    },
    onremove: (element: Element) => {
      const component = components.get(element);
      if (component) {
        component.remove();
      }
    }
  });
}
