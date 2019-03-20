import React from 'react';

import Body from './PostBody';
import Avatar from '../Avatar';
import Author from '../Author';
import TimeAgo from '../TimeAgo';
import './Comment.css';


const Comment = ({comment}) => {

  return (
    <div className='comment'>
      <ul>
        <li className='commentAvatar'>
          <Avatar author={comment.author} height='40px' width='40px' />
        </li>
        <li className='commentContent'>
          <div className='commentHead'>
            <Author author={comment.author} />
            {`\u00A0\u2022\u00A0`}
            <TimeAgo date={comment.created} />
          </div>
          <div className='commentBody'>
            <Body
              full
              rewriteLinks={false}
              body={comment.body}
              json_metadata={comment.json_metadata}
            />
          </div>
        </li>
      </ul>
      <div className='clear' />
    </div>
  )
}

export default Comment;
