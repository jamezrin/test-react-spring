import React, { StrictMode } from "react";
import ReactDOM from "react-dom";
import { createGlobalStyle } from "styled-components";

import App from "./App";

const BodyStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
  }

  html {
    box-sizing: border-box;
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }
`;

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <BodyStyle />
    <App />
  </StrictMode>,
  rootElement
);
