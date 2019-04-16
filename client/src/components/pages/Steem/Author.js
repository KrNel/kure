import React from 'react';
import PropTypes from 'prop-types';

import UserLink from './UserLink';

/**
 *  Displays the author hyperlink.
 *
 *  @param {string} author Author of post
 *  @returns {component} createdFromNow Time since post was created
 */
const Author = ({author}) => (
  <strong>
    <UserLink user={author} />
  </strong>
)

Author.propTypes = {
  author: PropTypes.string,
};

Author.defaultProps = {
  author: '',
};

export default Author;
