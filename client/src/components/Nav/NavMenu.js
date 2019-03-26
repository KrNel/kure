import React, {Component} from 'react';
import { NavLink } from 'react-router-dom';
import {
  Icon,
  Image,
  Menu,
  Sidebar,
  Responsive,
  Container,
} from "semantic-ui-react";
import PropTypes from 'prop-types';

import LoginControl from "./LoginControl";
import "semantic-ui-css/components/menu.min.css";
import "semantic-ui-css/components/tab.min.css";
import "semantic-ui-css/components/transition.min.css";
import logo from '../../images/logo.png';
import './NavMenu.css';

const items = [
  {name : "/", label : "Home"},
  {name : "/steem", label : "Steem"},
  {name : "/groups", label : "Communities"},
  //{name : "/kurated", label : "Kurated"},
];

/**
 *  Navigation menu.
 *
 *  Renders the page navigation menu.
 *  LoginControl component used to detemine Login/Logout right menu display.
 *
 *  @param {object} props Component props
 *  @returns {Component} Displays the desktop and mobile menus
 */
class NavMenu extends Component {

  static propTypes = {
    loginURL: PropTypes.string.isRequired,
    children: PropTypes.shape(PropTypes.object.isRequired),
  };

  static defaultProps = {
    children: {},
  }

  state = {
    visible: false
  };

  handlePusher = () => {
    const { visible } = this.state;

    if (visible) this.setState({ visible: false });
  };

  handleToggle = () => this.setState(prevState  => ({ visible: !prevState.visible }));

  render() {
    const { loginURL, children } = this.props;
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

/**
 *  Children passed from main NavMenu component. These are the pages that
 *  need to go through the Nav so that the Sidebar renders properly over them.
 *
 *  @param {object} props Component props
 *  @param {object} props.children App pages to view
 *  @returns {Component} Container with children
 */
const NavBarChildren = ({ children }) => (
  <Container>{children}</Container>
);

NavBarChildren.propTypes = {
  children: PropTypes.shape(PropTypes.object.isRequired),
};

NavBarChildren.defaultProps = {
  children: {},
}

/**
 *  Mobile NavMenu, displaying the mobile icon for a sidebar to open up.
 *
 *  @param {object} props Component props
 *  @param {array} props.items Menu items to render
 *  @param {function} props.onPusherClick Shows the sidebar
 *  @param {function} props.onToggle Toggles show or hide
 *  @param {boolean} props.visible Determinse if sidebar is seen or not
 *  @param {string} props.loginURL URL to login via Steem Connect
 *  @param {object} props.children Pages for the app
 *  @returns {Component} Displays the mobile menu
 */
const NavMobile = ({
  items,
  onPusherClick,
  onToggle,
  visible,
  loginURL,
  children
}) => (
  <Sidebar.Pushable>
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
        <Menu.Item fitted>
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

NavMobile.propTypes = {
  loginURL: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.object.isRequired),
  onPusherClick: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  children: PropTypes.shape(PropTypes.object.isRequired),
};

NavMobile.defaultProps = {
  items: [],
  children: {},
}

/**
 *  Desktop NavMenu
 *
 *  @param {object} props Component props
 *  @param {array} props.items Menu items to render
 *  @param {string} props.loginURL URL to login via Steem Connect
 *  @returns {Component} Displays the mobile menu
 */
const NavDesktop = ({ items, loginURL }) => (
  <Menu color="blue" secondary size="huge" className="navMenu">
    <Menu.Item fitted to='/' as={NavLink}>
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

NavDesktop.propTypes = {
  loginURL: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.object.isRequired),
};

NavDesktop.defaultProps = {
  items: [],
}

export default NavMenu;
