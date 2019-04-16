import React from 'react';
import PropTypes from 'prop-types';

import Posts from '../Posts'

const Blog = ({match}) => (
  <Posts
    page='blog'
    match={match}
  />
)

Blog.propTypes = {
  match: PropTypes.shape(PropTypes.object.isRequired),
};

Blog.defaultProps = {
  match: {},
};

export default Blog;
