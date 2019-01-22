import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, Image } from "semantic-ui-react";
import LoginControl from "../Auth/LoginControl";

import "semantic-ui-css/components/menu.min.css";
import "semantic-ui-css/components/tab.min.css";
import "semantic-ui-css/components/transition.min.css";
import logo from '../../images/logo.png';
import './NavMenu.css';

const NavMenu = ({isAuth, loginURL}) => {

  const items = [
    {name : "/", label : "Home"},
    {name : "/groups", label : "Communities"},
    {name : "/posts", label : "Posts"},
    {name : "/kurate", label : "Kurate"}
  ];

  return (
    <div>
      <Menu color="blue" secondary stackable size="huge">
        <Menu.Item className="nopad"><Image src={logo} alt="logo" /></Menu.Item>
        {
          items.map((item) => (
            <Menu.Item
              exact
              as={NavLink}
              to={item.name}
              key={item.name}
              header
            >
              {item.label}
            </Menu.Item>
          ))
        }
        <Menu.Menu position="right">
          <LoginControl isAuth={isAuth} loginURL={loginURL} />
        </Menu.Menu>
      </Menu>
    </div>
  )
}

export default NavMenu;
