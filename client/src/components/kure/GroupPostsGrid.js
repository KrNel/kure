import React from 'react';
import PropTypes from 'prop-types';

import PostGrid from '../pages/Kurated/PostGrid';
import './GroupPostsGrid.css';

/**
 *  Displays a grid view for the post data that belong to a commmunity group.
 */
const GroupPostsGrid = ({posts}) => (
  <React.Fragment>
    {
      posts.map(post => <PostGrid key={post._id} post={post} /> )
    }
  </React.Fragment>
)

GroupPostsGrid.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object.isRequired),
};

GroupPostsGrid.defaultProps = {
  posts: [],
};

export default GroupPostsGrid;
