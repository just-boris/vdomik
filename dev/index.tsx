import h from "../src";
import render from "../src/dom";

const root = document.createElement("div");
document.body.appendChild(root);

render(
  root,
  <div>
    <p>
      <label>
        Hello:
        <input type="text" value="Tester" />
      </label>
    </p>
    <p>
      <label>
        Select:
        <select>
          <option value="1">One</option>
          <option value="2">Two</option>
        </select>
      </label>
    </p>
  </div>
);
