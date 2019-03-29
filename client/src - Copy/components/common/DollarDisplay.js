import React from 'react';
import PropTypes from 'prop-types';

/**
 *  Formats a number to 3 decimal places.
 *
 *  @param {number} value Number to be formatted
 *  @return {element} Span element containing formatted value
 */
const DollarDisplay = ({ value }) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 3
  })
  return (
    <span>{formatter.format(value)}</span>
  )
}

DollarDisplay.propTypes = {
  value: PropTypes.number,
};

DollarDisplay.defaultProps = {
  value: 0,
};

export default DollarDisplay;
