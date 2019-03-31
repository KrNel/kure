import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 *  Create the title link.
 *
 *  @param {string} author Author of post
 *  @param {number} category Category of the post
 *  @param {string} permlink Steem permlink for post
 *  @param {string} title Post's title
 *  @param {string} className Class to add if provided
 *  @param {Component} Link React router link object
 */
const TitleLink = (props) => {
  const {
    title,
    category,
    author,
    permlink,
    className,
  } = props;

  return (
    <Link
      to={'/'+category+'/@'+author+'/'+permlink}
      className={className}
    >
      {title}
    </Link>
  )
}

TitleLink.propTypes = {
  title: PropTypes.string,
  category: PropTypes.string,
  author: PropTypes.string,
  permlink: PropTypes.string,
  className: PropTypes.string,
};

TitleLink.defaultProps = {
  title: '',
  category: '',
  author: '',
  permlink: '',
  className: '',
};

export default TitleLink;
