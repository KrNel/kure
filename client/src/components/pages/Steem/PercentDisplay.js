import React from 'react';
import PropTypes from 'prop-types';

/**
 *  Formats a number to a percentage with 2 decimal places.
 *
 *  @param {number} value Number to be formatted
 *  @return {element} Span element containing formatted value
 */
const PercentDisplay = ({ value }) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2
  })
  return (
    <span>{formatter.format(value)}</span>
  )
}

PercentDisplay.propTypes = {
  value: PropTypes.number,
};

PercentDisplay.defaultProps = {
  value: 0,
};

export default PercentDisplay;
