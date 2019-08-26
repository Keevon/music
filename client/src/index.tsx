import React from "react";
import ReactDOM from "react-dom";
import { pdfjs } from "react-pdf";
import { ThemeProvider } from "styled-components";

import App from "./components/App";
import * as serviceWorker from "./serviceWorker";
import { theme } from "./themes/default";

import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
