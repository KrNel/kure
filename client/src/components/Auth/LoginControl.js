import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from "semantic-ui-react";
import { connect } from 'react-redux';

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

const mapStateToProps = state => {
  const { isAuth } = state.auth;

  return {
    isAuth
  }
}

export default connect(mapStateToProps)(LoginControl)
