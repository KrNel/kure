import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'semantic-ui-react';

import UserLink from './UserLink';
import './UserCard.css';

/**
 *  Displays the user avatar and username floated left, with any children data
 *  passed floated to the right.
 *
 *  @param {string} user User being displayed
 *  @param {object} children Child components
 */
const UserCard = (props) => {
  const {
    user,
    children,
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
      </div>
      <div className='right'>
        { children }
      </div>
      <div className='clear' />
      <hr className='borderTopLight' />
    </div>
  )
}

UserCard.propTypes = {
  user: PropTypes.string,
  children: PropTypes.shape(PropTypes.object.isRequired),
};

UserCard.defaultProps = {
  user: '',
  children: {},
};

export default UserCard;
