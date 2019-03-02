import React from 'react';
//import { Link } from 'react-router-dom';

/**
 *  Displays the category hyperlink.
 *
 *  @param {string} category Category of post
 *  @returns {component} createdFromNow Time since post was created
 */
const Category = ({category}) => (
  <React.Fragment>
    {/*<Link
      to={`/created/${category}`}
    >
      {category}
    </Link>*/}
    <a
      target='_blank'
      rel='noopener noreferrer'
      href={`https://steemit.com/created/${category}`}
    >
      {category}
    </a>
  </React.Fragment>
)

export default Category;
