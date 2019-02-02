import React, { Component } from 'react';
import { Grid } from "semantic-ui-react";
import { connect } from 'react-redux';

import Header from './components/Header/Header';
import SteemConnect from './utilities/auth/scAPI';
import './App.css';
import { handleReturning } from './actions/authActions';

class App extends Component {

  componentDidMount() {
    const {isAuth, isAuthorizing, dispatch} = this.props;
    if (!isAuth) {
      dispatch(handleReturning());
    }
  }

  componentWillUnmount() {
    //this.signal.cancel('Api is being canceled');
  }

  render () {
    const {
      children
    } = this.props;

    const scState = `${window.location.pathname}`;
    const loginURL = SteemConnect.getLoginURL(scState);

    return (
      <div>
        <Header loginURL={loginURL} />

        <Grid container className="wrapper">
          <Grid.Column width={16}>
            {children}
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { isAuth, isAuthorizing } = state.auth;

  return {
    isAuth,
    isAuthorizing
  }
}

export default connect(mapStateToProps)(App)
