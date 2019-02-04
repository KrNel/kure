import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from "semantic-ui-react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

/**
 *  Menu component for Login/Logout display.
 *
 *  Controller for displaying if a user sees a Login or Logout in the menu.
 *  Also shows a Manage menu if user is logged in.
 *
 *  @param {object} props - Component props
 *  @param {bool} props.isAuth - Determines if user is authenticated
 *  @param {function} props.loginURL - URL to login via Steem Connect
 *  @returns {Component} - Menu component that displays Login, or Logout & Manage
 */
const LoginControl = ({isAuth, loginURL}) => {
  let menu;

  if (isAuth) {
    menu =
    (
      <React.Fragment>
        <Menu.Item
          exact
          as={NavLink}
          to="/manage"
          header
        >
          {'Manage'}
        </Menu.Item>
        <Menu.Item
          exact
          as={NavLink}
          to="/logout"
          header
        >
          {'Logout'}
        </Menu.Item>
      </React.Fragment>
    )
  }else {
    menu = <a className="header item" href={loginURL}>Login</a>;
  }

  return (
    menu
  )
}

LoginControl.propTypes = {
  isAuth: PropTypes.bool.isRequired,
  loginURL: PropTypes.string.isRequired,
};

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

export default connect(mapStateToProps)(LoginControl)
