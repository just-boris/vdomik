import * as jsdom from "jsdom-global";
import * as expect from "expect";
import h from "../src/index";
import render from "../src/dom";

describe("Dom rendering", () => {
  let cleanupJsdom: () => void;
  let element: Element;
  before(() => {
    cleanupJsdom = jsdom();
  });
  after(() => {
    cleanupJsdom();
  });

  beforeEach(() => {
    element = document.createElement("div");
  });

  it("should render dom-elements", () => {
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

  it("should append new elements", () => {
    render(
      element,
      <div>
        <div id="first">1</div>
      </div>
    );

    const first = element.querySelector("#first");

    render(
      element,
      <div>
        <div id="first">1</div>
        <div id="second">2</div>
      </div>
    );

    expect(element.querySelector("#first")).toBe(first);
    expect(element.querySelector("#second")).toExist();
  });

  it("should remove elements", () => {
    render(
      element,
      <div>
        <div id="first">1</div>
        <div id="second">2</div>
        <div id="third">3</div>
      </div>
    );

    const first = element.querySelector("#first");

    render(
      element,
      <div>
        <div id="first">1</div>
      </div>
    );

    expect(element.querySelector("#first")).toBe(first);
    expect(element.querySelector("#second")).toNotExist();
    expect(element.querySelector("#third")).toNotExist();
  });

  it("should replace only updated elements", () => {
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
    render(element, <input value="test" data-value="attribute" />);
    const input = element.querySelector("input")!;
    expect(input.getAttribute("value")).toBeFalsy();
    expect(input.value).toBe("test");
    expect(input.getAttribute("data-value")).toBe("attribute");
  });

  it("should insert raw html using special property", () => {
    render(element, <div unsafeInnerHTML={`<div><span id="test"></span></div>`} />);
    expect(element.querySelector("#test")).toExist();
    render(element, <div unsafeInnerHTML={`<span id="test2"></span>`} />);
    expect(element.querySelector("#test2")).toExist();
  });

  it("should not call event hooks from underlying render calls", () => {
    const removeListener = expect.createSpy();
    render(
      element,
      <div
        class="host"
        oncreate={element => render(element, <div class="child" onremove={removeListener} />)}
        onremove={element => render(element, null)}
      />
    );
    render(element, null);
    expect(removeListener.calls.length).toBe(1);
  });

  it("should set the right inline styles", () => {
    render(element, <div style="padding: 10px" />);
    expect(element.querySelector("div")!.style.padding).toBe("10px");
  });

  it("should attach and detach event listeners", () => {
    const clickSpy = expect.createSpy();
    render(element, <button onclick={clickSpy}>Click me!</button>);

    element.querySelector("button")!.dispatchEvent(new MouseEvent("click", {}));
    expect(clickSpy).toHaveBeenCalled();
    clickSpy.reset();

    render(element, <button>Click me!</button>);

    element.querySelector("button")!.dispatchEvent(new MouseEvent("click", {}));
    expect(clickSpy).toNotHaveBeenCalled();
  });

  it("should invoke lifecycle hooks", () => {
    const onCreate = expect.createSpy();
    const onRemove = expect.createSpy();

    render(
      element,
      <div>
        <div oncreate={onCreate} onremove={onRemove} />
      </div>
    );

    expect(onCreate).toHaveBeenCalled();
    expect(onRemove).toNotHaveBeenCalled();

    onCreate.reset();
    onRemove.restore();
    render(element, null);

    expect(onCreate).toNotHaveBeenCalled();
    expect(onRemove).toHaveBeenCalled();
  });

  it("should call parent hooks first on create", () => {
    let parentCalled = false;
    const onCreateParent = expect.createSpy().andCall(() => (parentCalled = true));
    const onCreateChild = expect.createSpy().andCall(() => {
      if (!parentCalled) {
        throw new Error("Parent must be called before children");
      }
    });
    render(
      element,
      <div oncreate={onCreateParent}>
        <div oncreate={onCreateChild} />
        <div oncreate={onCreateChild} />
      </div>
    );

    expect(onCreateParent.calls.length).toBe(1);
    expect(onCreateChild.calls.length).toBe(2);
  });

  it("should call parent hooks last on remove", () => {
    let parentCalled = false;
    const onRemoveParent = expect.createSpy().andCall(() => (parentCalled = true));
    const onRemoveChild = expect.createSpy().andCall(() => {
      if (parentCalled) {
        throw new Error("Parent must be called after children");
      }
    });
    render(
      element,
      <div onremove={onRemoveParent}>
        <div onremove={onRemoveChild} />
        <div onremove={onRemoveChild} />
      </div>
    );
    render(element, null);

    expect(onRemoveParent.calls.length).toBe(1);
    expect(onRemoveChild.calls.length).toBe(2);
  });

  it("should call update hooks on changed elements", () => {
    let parentCalled = false;
    const onUpdateParent = expect.createSpy().andCall(() => (parentCalled = true));
    const onUpdateFirst = expect.createSpy().andCall(() => {
      if (parentCalled) {
        throw new Error("Parent must be called after children");
      }
    });
    const onUpdateSecond = expect.createSpy();
    render(
      element,
      <div>
        <div>first</div>
        <div>second</div>
      </div>
    );
    render(
      element,
      <div onupdate={onUpdateParent}>
        <div onupdate={onUpdateFirst}>first</div>
        <div onupdate={onUpdateSecond}>second</div>
      </div>
    );
  });
});
