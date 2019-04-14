import React from 'react';
import PropTypes from 'prop-types';

import Posts from '../Posts'

const Feed = ({match}) => (
  <Posts
    page='feed'
    match={match}
  />
)

Feed.propTypes = {
  match: PropTypes.shape(PropTypes.object.isRequired),
};

Feed.defaultProps = {
  match: {},
};

export default Feed;
