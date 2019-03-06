import React from 'react';

import HelmetComponent from './PageHeader/PageHeader';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

/**
 *  Sets up the HTML <head> and navigation menu.
 *
 *  @param {object} props Component props
 *  @param {string} props.loginURL URL to login via Steem Connect
 *  @returns {Component} Displays the menu, and modifeid the header.
 */
const Header = () => (
  <ErrorBoundary>
    <HelmetComponent title='KURE - Curation Network Remedy for Steem' description='Kindred United to Reward Everyone' />
  </ErrorBoundary>
)

export default Header;
