import h, { VContent, render } from "../src";

interface ComponentElement extends Element {
  __componentData: Component;
}

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

export function createComponent<C extends Component<T>, T>(Contructor: new (e: Element, p?: T) => C, props?: T) {
  return h(getTagName((Contructor as any).name), {
    oncreate: (element: Element) => {
      const component = new Contructor(element, props);
      (element as ComponentElement).__componentData = component;
      component.update();
    },
    onupdate: (element: Element) => {
      const component = (element as ComponentElement).__componentData;
      if (component) {
        component.update();
      }
    },
    onremove: (element: Element) => {
      const component = (element as ComponentElement).__componentData;
      if (component) {
        component.remove();
      }
    }
  });
}
