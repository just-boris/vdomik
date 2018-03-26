import h from "../src";
import Component from "./component";
import TodoList from "./todo-list";
import Casino from "./casino";
import HooksDemo from "./hooks-demo";

export default class App extends Component {
    state = {
      items: ["one", 2],
      text: "test"
    };

    content() {
      return <div>
        {new TodoList(this.state.items, this.state.text).render()}
        {new Casino().render()}
        {new HooksDemo().render()}
      </div>;
    }
  }