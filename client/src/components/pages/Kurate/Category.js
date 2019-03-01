import React from 'react';
import { Link } from 'react-router-dom';

/**
 *  Displays the category hyperlink.
 *
 *  @param {string} category Category of post
 *  @returns {component} createdFromNow Time since post was created
 */
const Category = ({category}) => (
  <Link
    to={`/created/${category}`}
  >
    {category}
  </Link>
)

export default Category;
