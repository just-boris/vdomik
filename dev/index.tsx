import render from "../src/dom";
import App from "./app";

const root = document.createElement("div");
document.body.appendChild(root);

render(root, new App().render());
