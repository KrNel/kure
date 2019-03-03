import React, {Component} from 'react';
import { NavLink } from 'react-router-dom';
import {
  Icon,
  Image,
  Menu,
  Sidebar,
  Responsive,
  Segment,
  Container,
} from "semantic-ui-react";
import PropTypes from 'prop-types';

import LoginControl from "./LoginControl";
import "semantic-ui-css/components/menu.min.css";
import "semantic-ui-css/components/tab.min.css";
import "semantic-ui-css/components/transition.min.css";
import logo from '../../images/logo.png';
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
class NavMenu extends Component {

  /*static propTypes = {
    loginURL: PropTypes.string.isRequired,
  };*/

  state = {
    visible: false
  };

  handlePusher = () => {
    const { visible } = this.state;

    if (visible) this.setState({ visible: false });
  };

  handleToggle = () => this.setState(prevState  => ({ visible: !prevState.visible }));

  render() {
    const { items, loginURL, children } = this.props;
    const { visible } = this.state;

    return (
      <React.Fragment>
        <Responsive {...Responsive.onlyMobile}>
          <NavMobile
            items={items}
            onPusherClick={this.handlePusher}
            onToggle={this.handleToggle}
            loginURL={loginURL}
            visible={visible}
          >
            <NavBarChildren>{children}</NavBarChildren>
          </NavMobile>
        </Responsive>
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          <NavDesktop items={items} loginURL={loginURL} />
          <NavBarChildren>{children}</NavBarChildren>
        </Responsive>
      </React.Fragment>
    );
  }
}

const NavBarChildren = ({ children }) => (
  <Container>{children}</Container>
);

const NavMobile = ({
  items,
  onPusherClick,
  onToggle,
  visible,
  loginURL,
  children
}) => (
  <Sidebar.Pushable as={Segment}>
    <Sidebar
      as={Menu}
      animation="overlay"
      icon="labeled"
      vertical
      visible={visible}
      width='thin'
    >
      {
        items.map(item => (
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
    </Sidebar>
    <Sidebar.Pusher
      onClick={onPusherClick}
    >
      <Menu color="blue" secondary size="huge" className="navMenu">
        <Menu.Item className="nopad">
          <Image src={logo} alt="logo" />
        </Menu.Item>
        <Menu.Item header onClick={onToggle}>
          <Icon name="sidebar" />
        </Menu.Item>
        <Menu.Menu position="right">
          <LoginControl loginURL={loginURL} />
        </Menu.Menu>
      </Menu>
      {children}
    </Sidebar.Pusher>
  </Sidebar.Pushable>
);

const NavDesktop = ({ items, loginURL }) => (
  <Menu color="blue" secondary size="huge" className="navMenu">
    <Menu.Item className="nopad">
      <Image src={logo} alt="logo" />
    </Menu.Item>
    {
      items.map(item => (
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
);

{/*<React.Fragment>
  <Menu color="blue" secondary stackable size="huge">
    <Menu.Item className="nopad"><Image src={logo} alt="logo" /></Menu.Item>
    {
      items.map(item => (
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
</React.Fragment>*/}



export default NavMenu;
