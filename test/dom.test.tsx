import * as jsdom from "jsdom-global";
import * as expect from "expect";
import h from "../src/index";
import render from "../src/dom";

describe("Dom rendering", () => {
  let cleanupJsdom: () => void;
  before(() => (cleanupJsdom = jsdom()));
  after(() => cleanupJsdom());

  it("should render dom-elements", () => {
    const element = document.createElement("div");
    render(
      element,
      <div>
        <div class="my-class">Hello!</div>
        <div id="element">
          <h1>Title</h1>
          <p>paragraph</p>
        </div>
      </div>
    );

    expect(element.querySelectorAll("div").length).toBe(3);
    expect(element.querySelector(".my-class")!.textContent).toBe("Hello!");
    expect(element.querySelector("#element h1")!.textContent).toBe("Title");
    expect(element.querySelector("#element p")!.textContent).toBe("paragraph");
  });

  it("should replace only updated elements", () => {
    const element = document.createElement("div");
    render(
      element,
      <div>
        <div class="should-stay">Hello!</div>
        <div class="will-change">first content</div>
      </div>
    );

    const elementStays = element.querySelector(".should-stay");

    render(
      element,
      <div>
        <div class="should-stay">Hello!</div>
        <span class="new-el">new contentt</span>
      </div>
    );

    expect(element.querySelector(".should-stay")).toBe(elementStays);
    expect(element.querySelector(".will-change")).toNotExist();
    expect(element.querySelector(".new-el")).toExist();
  });

  it("should use properties instead of attributes when possible", () => {
    const element = document.createElement("div");
    render(element, <input value="test" data-value="attribute" />);
    const input = element.querySelector("input")!;
    expect(input.getAttribute('value')).toBeFalsy();
    expect(input.value).toBe("test");
    expect(input.getAttribute("data-value")).toBe("attribute");
  });

  it("should attach and detach event listeners", () => {
    const element = document.createElement("div");
    const clickSpy = expect.createSpy();
    render(element, <button onclick={clickSpy}>Click me!</button>);

    element.querySelector("button")!.dispatchEvent(new MouseEvent("click", {}));
    expect(clickSpy).toHaveBeenCalled();
    clickSpy.reset();

    render(element, <button>Click me!</button>);

    element.querySelector("button")!.dispatchEvent(new MouseEvent("click", {}));
    expect(clickSpy).toNotHaveBeenCalled();
  });
});
