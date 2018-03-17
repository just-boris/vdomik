import h from "../src";
import render from "../src/dom";

const root = document.createElement("div");
document.body.appendChild(root);

function randomize(length: number) {
  return Array.from({ length }, () => Math.ceil(Math.random() * 10));
}

const items = ["one", 2];
let text = "test";
let randomNumbers = randomize(3);

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
      <ul>
        {items.map((item, index) => <li class={index === items.length - 1 && "last"}>{item}</li>)}
      </ul>
      <h2>Casino</h2>
      <table>
        <tr>
          <td>
            <button id="dice">Dice!</button>
          </td>
          {randomNumbers.map(num => <td>{num}</td>)}
          <td>
            = <b>{randomNumbers.reduce((a, b) => a + b)}</b>
          </td>
        </tr>
      </table>
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

root.querySelector("#dice")!.addEventListener("click", () => {
  randomNumbers = randomize(randomize(1)[0]);
  app();
});
