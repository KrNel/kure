import React from 'react';
import PropTypes from 'prop-types';

import './Avatar.css';

/**
 *  Displays the author's avatar (icon)
 *
 *  @param {string} author Author of post
 */
const Avatar = ({author, height = '30px', width = '30px'}) => {
  const bgURL = `https://steemitimages.com/u/${author}/avatar`;
  return (
    <div
      className="avatar"
      role="img"
      style={{
        backgroundImage: 'url('+bgURL+')',
        height: height,
        width: width,
      }}
    />
  )
}

Avatar.propTypes = {
  author: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string,
};

Avatar.defaultProps = {
  author: '',
  height: '',
  width: '',
};

export default Avatar;
