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
    className,
  } = props;

  if (!link) {
    return (
      <Link
        to={`/${category}/@${author}/${permlink}`}
        title={title}
        className={className}
      >
        {text}
      </Link>
    )
  }else {
    return (
      <Link
        to={link}
        title={title}
        className={className}
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
  title: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
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
