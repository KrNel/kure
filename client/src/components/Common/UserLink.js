import React from 'react';
import { Link } from 'react-router-dom';

/**
 *  Builds the '/@user' link
 */
const UserLink = ({user}) => (
  <Link
    to={'/@'+user}
  >
    {user}
  </Link>
)

export default UserLink;
