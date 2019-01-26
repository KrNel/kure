import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from "semantic-ui-react";

const LoginControl = ({isAuth, loginURL}) => {
  let menu;

  if (isAuth) {
    menu =
    <React.Fragment>
      <Menu.Item
        exact
        as={NavLink}
        to="/manage"
        header
      >
        Manage
      </Menu.Item>
      <Menu.Item
        exact
        as={NavLink}
        to="/logout"
        header
      >
        Logout
      </Menu.Item>
    </React.Fragment>
  }else {
    menu = <a className="header item" href={loginURL}>Login</a>;
  }

  return (
    menu
  )
}

export default LoginControl;
