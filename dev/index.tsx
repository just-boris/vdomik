import h from "../src";
import render from "../src/dom";

const root = document.createElement("div");
document.body.appendChild(root);

const items = ["one", 2];
let text = "test";

function app() {
  render(
    root,
    <div>
      <h2>Todo list</h2>
      <form>
        <p>
          <label>
            Add:
            <input type="text" name="text" value={text} required />
          </label>
          <button>Add</button>
        </p>
      </form>
      <ul>{items.map(i => <li>{i}</li>)}</ul>
    </div>
  );
}

app();

const form = root.querySelector("form")!;

form.addEventListener("submit", event => {
  event.preventDefault();
  items.push(form.querySelector("input")!.value);
  text = "";
  app();
});
