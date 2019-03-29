import React from 'react';
import PropTypes from 'prop-types'

import PostBox from '../Kurated/PostBox';

/**
 *  Component to display the post data sent.
 *  If posts exist, display them. If not, display message.
 *
 *  @param {object} props Component props
 *  @param {object} props.post The post data to display
 *  @returns {element} Displays the post, or message if no posts are in the app
 */
const RecentPostsBoxes = ({posts}) => {
  if (posts.length) {
    return posts.map((p, i) => (
      <PostBox key={p._id} post={p} />
    ))
  }
}

RecentPostsBoxes.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object),
};

RecentPostsBoxes.defaultProps = {
  posts: [],
}

export default RecentPostsBoxes;
