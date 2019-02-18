import React from 'react';

import {BASE_STEEM_URL} from '../../../settings';

/**
 *  Displays the category hyperlink.
 *
 *  @param {string} category Category of post
 *  @returns {component} createdFromNow Time since post was created
 */
const Category = ({category}) => (
  <a href={BASE_STEEM_URL+'/'+category}>{category}</a>
)

export default Category;
