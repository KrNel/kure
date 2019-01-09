import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from "semantic-ui-react";

const LoginControl = ({isAuth, scURL}) => {
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
    menu = <a className="header item" href={scURL}>Login</a>;
  }
    /*const logInOut = (isAuth) ? "Logout" : "Login"
    const link = (isAuth) ? "/logout" : `${scURL}`*/
  return (
    menu
  )
}

export default LoginControl;
