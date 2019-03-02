import React from 'react';
//import { Link } from 'react-router-dom';

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
    <a
      target='_blank'
      rel='noopener noreferrer'
      href={`https://steemit.com/${category}/@${author}/${permlink}`}
    >
      {title}
    </a>
  )

}

{/*
   <Link
    to={'/'+category+'/@'+author+'/'+permlink}
  >
    {(title.length > 70)
      ? title.substr(0,70) + " ..."
      : title}
  </Link>
*/}

export default TitleLink;
