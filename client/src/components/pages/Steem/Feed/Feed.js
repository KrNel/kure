import React from 'react';

import Posts from '../Posts'

const Feed = (props) => (
  <Posts
    page='feed'
    match={props.match}
  />
)

export default Feed;
