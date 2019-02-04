import React from 'react';
import { Label } from "semantic-ui-react";
import PropTypes from 'prop-types';

/**
 *  Component to display an error label for validation purposes.
 *
 *  @param {object} props - Component props
 *  @param {string} props.text - Message error to display
 *  @returns {Component} - Displays an error label
 */
const ErrorLabel = ({text}) => {
  return (
    <Label basic color='red' pointing style={{position:"absolute", zIndex: 10}}>
      {text}
    </Label>
  )
}

ErrorLabel.propTypes = {
  text: PropTypes.string.isRequired,
};

export default ErrorLabel;
