import React from 'react';
import PropTypes from 'prop-types';
import { Header } from 'semantic-ui-react';

import UserCard from './UserCard';

const Followers = (props) => {
  const {
    followerCount,
    followers,
  } = props;

  return (
    <div id='follows'>
      <Header>Followers</Header>
      {
        followers.map(follower => {
          const user = follower.follower;

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

export default Followers;
