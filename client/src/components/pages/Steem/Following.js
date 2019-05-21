import React from 'react';
import PropTypes from 'prop-types';
import { Header } from 'semantic-ui-react';

import UserCard from './UserCard';
import FollowButton from './FollowButton';

/**
 *  The Follower page. Displays the list of users someone follows.
 *
 *  @param {array} following Users being followed
 */
const Following = (props) => {
  const {
    following,
    userLogged,
  } = props;

  return (
    <div id='follows'>
      <Header>Followers</Header>
      {
        following.map(follower => {
          const user = follower.following;

          return (
            <div className='follow' key={user}>
              <UserCard user={user}>
                {
                  userLogged !== user
                  ? <FollowButton user={user} />
                  : null
                }
              </UserCard>
            </div>
          )
        })
      }
    </div>
  )
}

Following.propTypes = {
  following: PropTypes.arrayOf(PropTypes.object.isRequired),
  userLogged: PropTypes.string,
};

Following.defaultProps = {
  following: [],
  userLogged: '',
};

export default Following;
