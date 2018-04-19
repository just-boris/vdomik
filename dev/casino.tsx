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
        <svg width="44" height="44" xmlns="http://www.w3.org/2000/svg">
          <path fill="none" d="M-1-1h46v46H-1z" />
          <g>
            <g stroke="null">
              <path d="M41.792 9.708L22.425.908a.865.865 0 0 0-.73 0l-19.367 8.8a.881.88 0 0 0-.516.801V32.51c0 .333.189.637.486.787l19.368 9.68a.889.889 0 0 0 .394.093.889.889 0 0 0 .395-.093l19.367-9.68a.882.881 0 0 0 .486-.787V10.509a.881.88 0 0 0-.516-.8zm-1.245 22.258l-18.487 9.24-18.487-9.24v-20.89L22.06 2.675l18.487 8.4v20.891z" />
              <path d="M42.229 10.145a.88.88 0 0 0-1.166-.437L22.06 18.343 3.057 9.708a.88.88 0 1 0-.729 1.602l19.368 8.8a.877.877 0 0 0 .729 0l19.367-8.8a.88.88 0 0 0 .437-1.165z" />
              <path d="M22.06 18.43a.88.88 0 0 0-.88.88v22.88a.88.88 0 0 0 1.76 0V19.31a.88.88 0 0 0-.88-.88zm0-9.681c-1.53 0-2.64.74-2.64 1.76 0 1.019 1.11 1.76 2.64 1.76s2.641-.741 2.641-1.76c0-1.02-1.11-1.76-2.64-1.76zm-4.401 11.44c-1.022 0-1.761 1.111-1.761 2.64s.74 2.64 1.76 2.64 1.761-1.11 1.761-2.64-.74-2.64-1.76-2.64zm-5.282 3.12c-1.022 0-1.761 1.11-1.761 2.64s.74 2.64 1.76 2.64 1.761-1.111 1.761-2.64c0-1.53-.74-2.64-1.76-2.64zm-5.282 3.04c-1.022 0-1.761 1.111-1.761 2.64s.74 2.64 1.76 2.64 1.761-1.11 1.761-2.64c0-1.529-.74-2.64-1.76-2.64zm20.247-5.28c-1.021 0-1.76 1.11-1.76 2.64s.739 2.64 1.76 2.64 1.76-1.11 1.76-2.64c0-1.529-.739-2.64-1.76-2.64zm8.804 4.4c-1.022 0-1.761 1.111-1.761 2.64s.74 2.64 1.76 2.64c1.022 0 1.761-1.11 1.761-2.64s-.74-2.64-1.76-2.64z" />
            </g>
          </g>
        </svg>
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
