import React from 'react';
import { Grid } from "semantic-ui-react";
import PropTypes from 'prop-types';

import NavMenu from './Nav/NavMenu';
import HelmetComponent from './PageHeader/PageHeader';

/**
 *  Sets up the HTML <head> and navigation menu.
 *
 *  @param {object} props Component props
 *  @param {string} props.loginURL URL to login via Steem Connect
 *  @returns {Component} Displays the menu, and modifeid the header.
 */
const Header = ({loginURL}) => (
  <React.Fragment>
    <HelmetComponent title='KURE - Curation Network Remedy for Steem' description='Kindred United to Reward Everyone' />

    {/*
    //hambuger menu https://codepen.io/markcaron/pen/pPZVWO
    //https://codepen.io/designosis/pen/LbMgya
    */}

    <Grid className="navMenu">
      <Grid.Column>
        <NavMenu loginURL={loginURL} />
      </Grid.Column>
    </Grid>
  </React.Fragment>
)

Header.propTypes = {
  loginURL: PropTypes.string.isRequired,
};

export default Header;
