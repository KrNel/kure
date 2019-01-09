import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";

import "./index.css";
import "semantic-ui-css/semantic.css";
import App from './App';

//import * as serviceWorker from './serviceWorker';

/*
process.env
https://medium.com/@thejasonfile/using-dotenv-package-to-create-environment-variables-33da4ac4ea8f
https://codeburst.io/process-env-what-it-is-and-why-when-how-to-use-it-effectively-505d0b2831e7

or config
https://medium.com/@millard3/a-joi-ous-environment-2b561e2133ea
*/

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
//serviceWorker.unregister();
