import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 *  Builds the '/@user' link.
 */
const UserLink = ({user}) => (
  <Link
    to={'/@'+user}
  >
    {user}
  </Link>
)

UserLink.propTypes = {
  user: PropTypes.string,
};

UserLink.defaultProps = {
  user: '',
};

export default UserLink;
