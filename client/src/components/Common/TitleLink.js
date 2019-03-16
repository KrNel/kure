import React from 'react';
import { Link } from 'react-router-dom';

/**
 *  Create the title link, with options to cut off the length.
 */
const TitleLink = ({title, category, author, permlink, cutoff = 0, multiCut = 0}) => {
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
    >
      {title}
    </Link>
  )

}



export default TitleLink;
