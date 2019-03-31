import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 *  Creates the post link used in places like thumbnails, titles and the
 *  'fromNow()' date. Only the date has a title atrtibute for the link passed.
 */
const PostLink = (props) => {
  const {
    author,
    category,
    permlink,
    title,
    text,
    link,
  } = props;

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

PostLink.propTypes = {
  author: PropTypes.string,
  category: PropTypes.string,
  permlink: PropTypes.string,
  title: PropTypes.string,
  text: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  link: PropTypes.string,
};

PostLink.defaultProps = {
  author: '',
  category: '',
  permlink: '',
  title: '',
  text: {},
  link: '',
};

export default PostLink;
