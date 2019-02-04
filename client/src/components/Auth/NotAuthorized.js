import React from 'react';
import PropTypes from 'prop-types';

/**
 *  Authenticating acess to certain routes passed in as a Component parameter.
 *
 *  @param {object} props - Component props
 *  @param {object} props.location - Route object for location
 *  @returns {element} - Displays markup for trying to access a page while unauthenticated
 */
const NotAuthorized = ({ location }) => (
  <div className='ui inverted blue raised very padded text container segment'>
    {'You need to login to view this page.'}
  </div>
);

NotAuthorized.propTypes = {
  location: PropTypes.shape(PropTypes.object.isRequired).isRequired,
};

export default NotAuthorized;
