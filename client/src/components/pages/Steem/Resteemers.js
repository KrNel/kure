import React from 'react';
import { Icon } from "semantic-ui-react";
import PropTypes from 'prop-types';

import UserLink from './UserLink';
import './Resteemers.css';

/**
 *  Iterates first through the list of resteemers to generate the links
 *  for each user as a component. Then each linked user component is
 *  interated to form a comma separated string for display.
 *
 *  @param {array} rebloggedBy List of users that reblogged the post
 */
const Resteemers = ({rebloggedBy}) => {
  const users = rebloggedBy.map(user => <UserLink key={user} user={user} />);

  return (
    <div className='resteemers'>
      <Icon name='retweet' />
      {
        users.map((user, index) => (
          <span key={user.key}>
            { (index ? ', ' : '') }
            { user }
          </span>
        ))
      }
      {' resteemed'}
    </div>
  )
}

Resteemers.propTypes = {
  rebloggedBy: PropTypes.arrayOf(PropTypes.string),
};

Resteemers.defaultProps = {
  rebloggedBy: [],
};

export default Resteemers;
