import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'semantic-ui-react';

import UserLink from './UserLink';
import FollowButton from './FollowButton';
import './UserCard.css';

const UserCard = (props) => {
  const {
    user,
    children,
    followingList,
  } = props;
  return (
    <div className="userCard">
      <div className='left'>
        <span>
          <Image inline src={`https://steemitimages.com/u/${user}/avatar`} height={35} width={35} />
        </span>
        <span>
          <UserLink user={user} />
        </span>
        { children }
      </div>
      <div className='right'>
        <FollowButton user={user} />
      </div>
      <div className='clear' />
      <hr className='borderTopLight' />
    </div>
  )
}

export default UserCard;
