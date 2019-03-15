import React from 'react';
import PropTypes from 'prop-types';

const DollarDisplay = ({ value }) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
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
