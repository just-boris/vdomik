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

function onSubmitClick(event: Event) {
  event.preventDefault();
  items.push((event.target as HTMLFormElement).querySelector("input")!.value);
  text = "";
  app();
}

function removeItem(index: number) {
  items.splice(index, 1);
  app();
}

function onDiceClick() {
  randomNumbers = randomize(randomize(1)[0]);
  app();
}

function app() {
  render(
    root,
    <div>
      <h2>Todo list</h2>
      <form onsubmit={onSubmitClick}>
        <p>
          <label>
            Add:
            <input type="text" name="text" value={text} required />
          </label>
          <button>Add</button>
        </p>
      </form>
      {items.length > 0 ? (
        <ul>
          {items.map((item, index) => (
            <li class={index === items.length - 1 && "last"}>
              {item}{" "}
              <a
                href="javascript:void(0)"
                style="text-decoration: none;"
                onclick={() => removeItem(index)}
              >
                &times;
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>
          <i>Empty list</i>
        </p>
      )}
      <h2>Casino</h2>
      <table>
        <tr>
          {randomNumbers.map(num => <td>{num}</td>)}
          <td>
            = <b>{randomNumbers.reduce((a, b) => a + b)}</b>
          </td>
          <td>
            <button onclick={onDiceClick}>Dice!</button>
          </td>
        </tr>
      </table>
    </div>
  );
}

app();
