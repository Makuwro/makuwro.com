import App from "./App";
import React from "react";
import { render } from "react-dom";

render(
  <App />,
  document.getElementById("root")
);

if (module.hot) {

  module.hot.accept();

}
