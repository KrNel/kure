import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 *  Create the title link, with options to cut off the length. Supplying the
 *  initial 'cutoff' along with the 'multiCut' value allows twi seprate cuts,
 *  based on Latin and non-Latin chracters which take up varying amounts
 *  of space.
 */
const TitleLink = (props) => {
  const {
    category,
    author,
    permlink,
    cutoff,
    multiCut,
    className,
  } = props;

  let {
    title,
  } = props;

  if (cutoff && !multiCut) {
    title = (title.length > cutoff)
      ? title.substr(0,cutoff) + " ..."
      : title
  }else if (multiCut) {
    // eslint-disable-next-line
    title = (title.length > cutoff) //longer than 14 chars?
      //eslint-disable-next-line
      ? (/[^\u0000-\u007f]/.test(title)) //non latin?
        ? title.substr(0,multiCut) + " ..." //truncate non latin
        : title.substr(0,cutoff) + " ..." //truncate latin
      : title //no truncate
  }
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
  cutoff: PropTypes.number,
  multiCut: PropTypes.number,
  className: PropTypes.string,
};

TitleLink.defaultProps = {
  title: '',
  category: '',
  author: '',
  permlink: '',
  cutoff: 0,
  multiCut: 0,
  className: '',
};

export default TitleLink;
