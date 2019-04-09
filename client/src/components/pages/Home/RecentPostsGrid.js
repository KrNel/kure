import React from 'react';
import PropTypes from 'prop-types'

import PostGrid from '../Kurated/PostGrid';

/**
 *  Component to display the post data sent.
 *  If posts exist, display them. If not, display message.
 *
 *  @param {object} props Component props
 *  @param {object} props.post The post data to display
 *  @returns {element} Displays the post, or message if no posts are in the app
 */
const RecentPostsGrid = ({posts}) => {
  if (posts.length) {
    return posts.map((p, i) => (
      <PostGrid key={p._id} post={p} />
    ))
  }else {
    return 'No posts'
  }
}

RecentPostsGrid.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object),
};

RecentPostsGrid.defaultProps = {
  posts: [],
}

export default RecentPostsGrid;
