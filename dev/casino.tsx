import h from "../src";
import Component from "./component";

export default class Casino extends Component {
  state = {
    randomNumbers: this.randomize(3)
  };

  private randomize(length: number) {
    return new Array(length)
      .join(".")
      .split(".")
      .map(() => Math.ceil(Math.random() * 10));
  }

  onDiceClick() {
    this.state.randomNumbers = this.randomize(this.randomize(1)[0]);
    this.update();
  }

  content() {
    const { randomNumbers } = this.state;
    return (
      <div>
        <h2>Casino</h2>
        <table>
          <tr>
            {randomNumbers.map(num => <td>{num}</td>)}
            <td>
              = <b>{randomNumbers.reduce((a, b) => a + b)}</b>
            </td>
            <td>
              <button onclick={this.onDiceClick.bind(this)}>Dice!</button>
            </td>
          </tr>
        </table>
      </div>
    );
  }
}
