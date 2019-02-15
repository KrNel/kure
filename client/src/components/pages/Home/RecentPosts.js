import React from 'react';
import PropTypes from 'prop-types'

import SteemConnect from '../../../utils/auth/scAPI';

/**
 *  Component to display the post data sent.
 *  If posts exist, display them. If not, display message.
 *
 *  @param {object} props Component props
 *  @param {object} props.post The post data to display
 *  @param {function} props.isAuth Determines if user is authenticated
 *  @returns {element} Displays the post, or message if no posts are in the app
 */
const RecentPosts = ({post, isAuth}) => {
  const loginURL = SteemConnect.getLoginURL('/');
  if (post.st_title) {
    return <div className="recPost">{post.st_title}</div>;
  }else {
    if (isAuth)
      return (
        <div className="recPost">
          {"There are no communities yet. Go to"}
          <a href="/manage">
            {"Manage"}
          </a>
          {"and be the first to create a community!"}
        </div>
      )
    else {
      return (
        <div className="recPost">
          {"There are no posts yet. "}
          <a href={loginURL}>
            {"Login"}
          </a>
          {" first, then "}
          <a href="/manage">
            {"create"}
          </a>
          {" a community."}
        </div>
      )
    }
  }
}

RecentPosts.propTypes = {
  post: PropTypes.shape(PropTypes.object.isRequired).isRequired,
  isAuth: PropTypes.bool.isRequired,
};

export default RecentPosts;
