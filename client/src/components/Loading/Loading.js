import React from 'react';
import { Loader } from "semantic-ui-react";
import PropTypes from 'prop-types';

/**
 *  Component to show a loading spinner.
 *
 *  @param {object} props Component props
 *  @param {string} props.size Size of the loading spinner
 *  @param {string} props.text Message to show in loading spinner
 *  @returns {Component} Displays loading spinner
 */
const Loading = ({size, text}) => (
  <Loader
    active
    inline='centered'
    size={size}
    content={text}
  />
);

Loading.propTypes = {
  text: PropTypes.string,
  size: PropTypes.string,
};

Loading.defaultProps = {
  size: 'medium',
  text: ''
};

export default Loading;
