import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';

import store from './redux'
import "./index.css";
import "semantic-ui-css/semantic.css";
import AppRoutes from './routes/Routes';

/**
 *  Rendering of main application component with redux store.
 *
 *  @param {Component} Component A component
 *  @returns {ReactDOM} A React DOM object to inject into public/index.html
 */
const renderApp = Component => {
  ReactDOM.render(
    <Provider store={store}>
      <HelmetProvider>
        <Router>
          <Component />
        </Router>
      </HelmetProvider>
    </Provider>,
    document.getElementById("root")
  )
};

renderApp(AppRoutes);
