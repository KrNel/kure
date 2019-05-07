import React from 'react';
import PropTypes from 'prop-types';

import './DollarDisplay.css';

/**
 *  Formats a number to 3 decimal places.
 *
 *  @param {number} value Number to be formatted
 *  @return {element} Span element containing formatted value
 */
const DollarDisplay = ({ value, payoutDeclined }) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 3
  })

  let declined = '';
  let title = '';
  if (payoutDeclined) {
    declined = 'declined';
    title = 'Payout Declined';
  }

  return (
    <span className={declined} title={title}>{formatter.format(value)}</span>
  )
}

DollarDisplay.propTypes = {
  value: PropTypes.number,
  payoutDeclined: PropTypes.bool,
};

DollarDisplay.defaultProps = {
  value: 0,
  payoutDeclined: false,
};

export default DollarDisplay;
