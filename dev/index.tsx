import { render } from "../src";
import { createComponent } from "./component";
import App from "./app";

const root = document.createElement("div");
document.body.appendChild(root);

render(root, createComponent(App));
