import React from 'react';
import { Helmet } from "react-helmet";
import PropTypes from 'prop-types';

/**
 *  The Helmet header for index.html.
 *
 *  @param {object} props Component props
 *  @param {string} props.title Title of the page
 *  @param {string} props.description Description of the page
 *  @returns {Component} Helmet component for the HTML header
 */
const Header = ({title, description}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
    </Helmet>
  )
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default Header;
