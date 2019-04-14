import React from 'react';
import PropTypes from 'prop-types'

import './Thumbnail.css';

/**
 *  Displays the main image for the post as  thumbnail.
 *
 *  @param {string} thumb URL for the post's image
 */
const Thumbnail = ({thumb}) => {
  const height = '73px'
  const width = '130px';

  return (
    <div
      className="thumb"
      role="img"
      style={{
        backgroundImage: `url(https://steemitimages.com/256x512/${thumb})`,
        height: height,
        width: width,
      }}
    />
  )
}

Thumbnail.propTypes = {
  thumb: PropTypes.string.isRequired,
};

export default Thumbnail;
