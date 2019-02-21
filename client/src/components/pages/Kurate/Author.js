import React from 'react';
import { Link } from 'react-router-dom';

/**
 *  Displays the author hyperlink.
 *
 *  @param {string} author Author of post
 *  @returns {component} createdFromNow Time since post was created
 */
const Author = ({author}) => (
  <strong>
    <Link
      to={'@'+author}
    >
      {author}
    </Link>
  </strong>
)

export default Author;
