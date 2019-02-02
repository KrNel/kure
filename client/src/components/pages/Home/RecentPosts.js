import React from 'react';
import SteemConnect from '../../../utilities/auth/scAPI';

//const RecentPosts = ({post, isAuth}) => {
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

export default RecentPosts;
