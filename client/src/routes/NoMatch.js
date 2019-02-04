import React from 'react';
import PropTypes from 'prop-types';

/**
 *  Component for no routes found in application.
 *
 *  @param {object} props - Component props
 *  @param {bool} props.location - Route location object
 *  @returns {element} - Renders markup for a route/page not found
 */
const NoMatch = ({ location }) => (
  <div className='ui inverted red raised very padded text container segment'>
    <strong>Error!</strong>
    {' No route found matching:'}
    <div className='ui inverted black segment'>
      <code>{location.pathname}</code>
    </div>
  </div>
);

NoMatch.propTypes = {
  location: PropTypes.shape(PropTypes.object.isRequired).isRequired,
};

export default NoMatch;
