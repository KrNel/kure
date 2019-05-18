import React from 'react';
import PropTypes from 'prop-types';

import UserCard from './UserCard';

const Following = (props) => {
  const {
    followingCount,
    following,
  } = props;

  return (
    <div id='follows'>
      <div>Following</div>
      {
        following.map(follower => {
          const user = follower.following;

          return (
            <div className='follow' key={user}>
              <UserCard user={user} />
            </div>
          )
        })
      }
    </div>
  )
}

export default Following;
