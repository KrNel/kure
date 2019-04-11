import React from 'react';

/**
 *  Display component for unauthorized access attempts.
 *
 *  @param {object} props Component props
 *  @param {object} props.location Route object for location
 *  @returns {element} Displays markup for trying to access a page while unauthenticated
 */
const NotAuthorized = () => (
  <div className='ui inverted blue raised padded text container segment'>
    {'You need to login to view this page.'}
  </div>
);

export default NotAuthorized;
