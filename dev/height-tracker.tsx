import h from "../src";
import Component from "./component";

export default class HeghtTracker extends Component {
  state = {
    height: 0,
    elements: [0] as number[]
  };

  addElement = () => {
    this.state.elements.push(Math.floor(Math.random() * 2));
    this.update();
  };

  removeElement = () => {
    this.state.elements.pop();
    this.update();
  };

  trackHeight = (element: Element) => {
    const height = element.getBoundingClientRect().height;
    if (this.state.height !== height) {
      this.state.height = height;
      this.update();
    }
  };

  content() {
    const { height, elements } = this.state;
    return (
      <div>
        <button onclick={this.addElement}>+</button>
        <button onclick={this.removeElement}>-</button>
        <ul oncreate={this.trackHeight} onupdate={this.trackHeight}>
          {elements.map(el => <li>{el}</li>)}
        </ul>
        <div>{height}</div>
      </div>
    );
  }
}
