import React from 'react';
import PropTypes from 'prop-types';
import { Header } from 'semantic-ui-react';

import UserCard from './UserCard';
import FollowButton from './FollowButton';

/**
 *  The Follower page. Displays the list of users that follow someone.
 *
 *  @param {array} followers Followers of a user
 */
const Followers = (props) => {
  const {
    followers,
    userLogged,
  } = props;

  return (
    <div id='follows'>
      <Header>Followers</Header>
      {
        followers.map(follower => {
          const user = follower.follower;

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

Followers.propTypes = {
  followers: PropTypes.arrayOf(PropTypes.object),
  userLogged: PropTypes.string,
};

Followers.defaultProps = {
  followers: [],
  userLogged: '',
};

export default Followers;
