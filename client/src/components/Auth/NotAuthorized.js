import React from 'react';

const NotAuthorized = ({ location }) => (
  <div className='ui inverted red raised very padded text container segment'>
    <strong>Error!</strong> You need to login to view this page.
  </div>
);

export default NotAuthorized;
