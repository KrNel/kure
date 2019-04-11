import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import NotAuthorized from '../components/Auth/NotAuthorized';
import Authorizing from '../components/Auth/Authorizing';

/**
 *  Authenticating access to certain routes passed in as a Component parameter.
 *
 *  @param {object} props Component props
 *  @param {Component} props.Component Component passed in to allow authenticated access
 *  @param {bool} props.isAuth Determines if user is authenticated
 *  @param {bool} props.isAuthorizing Shows a loading spinner for user authentication process
 *  @returns {Component} Renders the route for component requesting authenticated access
 */
const PrivateRoute = ({ component: Component, isAuthorizing, isAuth, ...rest }) => (
  <Route
    {...rest}
    render={(props) => (
      (isAuthorizing)
        ? <Authorizing />
      : (isAuth)
            ? <Component {...props} {...rest} />
            : <NotAuthorized />
    )}
  />
)

PrivateRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  isAuthorizing: PropTypes.bool.isRequired,
  isAuth: PropTypes.bool.isRequired,
};


/**
 *  Map redux state to component props.
 *
 *  @param {object} state - Redux state
 *  @returns {object} - An object to be passed to component
 */
const mapStateToProps = state => {
  const { isAuth, isAuthorizing } = state.auth;

  return {
    isAuth,
    isAuthorizing
  }
}

export default connect(mapStateToProps)(PrivateRoute)
