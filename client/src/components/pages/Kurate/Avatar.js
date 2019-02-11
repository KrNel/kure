import React from 'react';
import './Avatar.css';

/**
 *  Displays the author's avatar (icon)
 *
 *  @param {string} author Author of post
 */
const Avatar = ({author}) => {
  const height = '30px';
  const width = '30px';
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

export default Avatar;
