import React from 'react';
import { Link } from 'react-router-dom';

const PostLink = ({ author, category, permlink, title = '', text, link = ''}) => {

  if (!link) {
    return (
      <Link
        to={'/'+category+'/@'+author+'/'+permlink}
        title={title}
      >
        {text}
      </Link>
    )
  }else {
    return (
      <Link
        to={link}
        title={title}
      >
        {text}
      </Link>
    )
  }
}

export default PostLink;
