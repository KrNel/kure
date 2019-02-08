import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid } from "semantic-ui-react";
import { connect } from 'react-redux';

import Header from './components/Header/Header';
import SteemConnect from './utilities/auth/scAPI';
import './App.css';
import { handleReturning } from './actions/authActions';

/**
 *  Root application compoenent.
 *
 *  @param {object} props Component props
 *  @param {bool} props.isAuth Determines if user is authenticated
 *  @returns {Component} Header and page components to render
 */
class App extends Component {

  static propTypes = {
    isAuth: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    children: PropTypes.shape(PropTypes.object.isRequired).isRequired,
  };

  componentDidMount() {
    const {isAuth, dispatch} = this.props;
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
      <React.Fragment>
        <Header loginURL={loginURL} />

        <Grid container className="wrapper">
          <Grid.Column width={16}>
            {children}
          </Grid.Column>
        </Grid>
      </React.Fragment>
    )
  }
}

/**
 *  Map redux state to component props.
 *
 *  @param {object} state - Redux state
 *  @returns {object} - Authentication data
 */
const mapStateToProps = state => {
  const { isAuth } = state.auth;

  return {
    isAuth
  }
}

export default connect(mapStateToProps)(App)
