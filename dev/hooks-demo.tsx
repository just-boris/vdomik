import h from "../src";
import Component from "./component";

export default class HooksDemo extends Component {
    state = {
      destroyed: false
    };

    onDestroyClick = () => {
      this.state.destroyed = true;
      this.update();
    };

    onActivateClick = () => {
      this.state.destroyed = false;
      this.update();
    }

    content() {
      if (this.state.destroyed) {
        return <button onclick={this.onActivateClick}>Activate</button>;
      }
      return (
        <div onremove={() => console.log("bye")}>
          <ul
            oncreate={element => {
              console.log(element);
              console.log(element.childNodes.length, element.getBoundingClientRect().height);
            }}
            onremove={e => console.log(e)}
          >
            {[1, 2, 3].map(i => <li onremove={() => console.log("bye!")}>{i}</li>)}
          </ul>
          <button onclick={this.onDestroyClick}>Destory everyting!</button>
        </div>
      );
    }
  }