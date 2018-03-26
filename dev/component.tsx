import h, { VContent } from "../src";
import render from "../src/dom";

export default abstract class Component {
  element: Element;

  update() {
    render(this.element, this.content());
  }

  private getTagName() {
    const processed = this.constructor.name
      .replace(/(^[A-Z])/, first => first.toLowerCase())
      .replace(/([A-Z])/g, letter => `-${letter.toLowerCase()}`);
    return `k-${processed}`;
  }

  private oncreate(element: Element) {
    this.element = element;
    this.update();
  }

  private onremove(element: Element) {
    render(element, null);
  }

  render() {
    return h(this.getTagName(), {
      oncreate: (element: Element) => this.oncreate(element),
      onremove: (element: Element) => this.onremove(element)
    });
  }

  abstract content(): VContent;
}
