import React from 'react';

import UserLink from '../../common/UserLink';

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

export default Author;
