import React from 'react';

import {BASE_STEEM_URL} from '../../../settings';

/**
 *  Displays the author hyperlink.
 *
 *  @param {string} author Author of post
 *  @returns {component} createdFromNow Time since post was created
 */
const Author = ({author}) => (
  <strong>
    <a href={BASE_STEEM_URL+'/@'+author}>{author}</a>
  </strong>
)

export default Author;
