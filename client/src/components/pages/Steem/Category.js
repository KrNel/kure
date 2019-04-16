import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 *  Displays the category hyperlink.
 *
 *  @param {string} category Category of post
 *  @returns {component} createdFromNow Time since post was created
 */
const Category = ({category}) => (
  <React.Fragment>
    <Link
      to={`/created/${category}`}
    >
      {category}
    </Link>
  </React.Fragment>
)

Category.propTypes = {
  category: PropTypes.string,
};

Category.defaultProps = {
  category: '',
};

export default Category;
