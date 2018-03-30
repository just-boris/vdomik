import h from "../src";
import Component, { createComponent } from "./component";
import TodoList, { TodoListProps } from "./todo-list";
import Casino from "./casino";
import HooksDemo from "./hooks-demo";
import HeightTracker from "./height-tracker";

export default class App extends Component {
    state = {
      items: ["one", 2],
      text: "test"
    };

    content() {
      const {items, text} = this.state;
      return <div>
        {createComponent(TodoList, {items, text})}
        {createComponent(Casino)}
        {createComponent(HooksDemo)}
        {createComponent(HeightTracker)}
        <button onclick={() => this.update()}>Rerender</button>
      </div>;
    }
  }