import React from 'react';

import Posts from '../Posts'

const Blog = (props) => (
  <Posts
    page='blog'
    match={props.match}
  />
)

export default Blog;
