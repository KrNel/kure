import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, Image } from "semantic-ui-react";
import PropTypes from 'prop-types';

import LoginControl from "../../Auth/LoginControl";
import "semantic-ui-css/components/menu.min.css";
import "semantic-ui-css/components/tab.min.css";
import "semantic-ui-css/components/transition.min.css";
import logo from '../../../images/logo.png';
import './NavMenu.css';

/**
 *  Navigation menu.
 *
 *  Renders the page navigation menu.
 *  LoginControl component used to detemine Login/Logout right menu display.
 *
 *  @param {object} props Component props
 *  @param {string} props.loginURL URL to login via Steem Connect
 *  @returns {Component} Displays the menu
 */
const NavMenu = ({loginURL}) => {

  const items = [
    {name : "/", label : "Home"},
    {name : "/kurate", label : "Kurate"},
    {name : "/groups", label : "Communities"},
    {name : "/posts", label : "Kurated"},

  ];

  return (
    <React.Fragment>
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
          <LoginControl loginURL={loginURL} />
        </Menu.Menu>
      </Menu>
    </React.Fragment>
  )
}

NavMenu.propTypes = {
  loginURL: PropTypes.string.isRequired,
};

export default NavMenu;
