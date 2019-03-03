import React from 'react';

import HelmetComponent from './PageHeader/PageHeader';

/**
 *  Sets up the HTML <head> and navigation menu.
 *
 *  @param {object} props Component props
 *  @param {string} props.loginURL URL to login via Steem Connect
 *  @returns {Component} Displays the menu, and modifeid the header.
 */
const Header = () => (
  <HelmetComponent title='KURE - Curation Network Remedy for Steem' description='Kindred United to Reward Everyone' />
)

export default Header;
