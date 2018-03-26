import h from "../src";
import Component from "./component";

export default class TodoList extends Component {
  state: {
    items: any[];
    text: string;
  };

  constructor(items: any[], text: string) {
    super();
    this.state = {
      items,
      text
    };
  }

  onSubmitClick(event: Event) {
    event.preventDefault();
    this.state.items.push((event.target as HTMLFormElement).querySelector("input")!.value);
    this.state.text = "";
    this.update();
  }

  removeItem(index: number) {
    this.state.items.splice(index, 1);
    this.update();
  }

  content() {
    const { items, text } = this.state;
    return (
      <div>
        <h2>Todo list</h2>
        <form onsubmit={event => this.onSubmitClick(event)}>
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
                  onclick={() => this.removeItem(index)}
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
      </div>
    );
  }
}
