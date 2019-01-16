import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from "semantic-ui-react";

const LoginControl = ({isAuth, loginURL}) => {
  let menu;

  if (isAuth) {
    menu = <Menu.Item
      exact
      as={NavLink}
      to="/logout"
      header
    >
      Logout
    </Menu.Item>
  }else {
    menu = <a className="header item" href={loginURL}>Login</a>;
    /*menu = <Menu.Item
      exact
      as={NavLink}
      to="/login"
      header
    >
      Login
    </Menu.Item>*/
  }
    /*const logInOut = (isAuth) ? "Logout" : "Login"
    const link = (isAuth) ? "/logout" : `${scURL}`*/
  return (
    menu
  )
}

export default LoginControl;
