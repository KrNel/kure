import React from 'react';
import { Icon } from "semantic-ui-react";
import PropTypes from 'prop-types';

import UserLink from './UserLink';
import './Resteemers.css';

const Resteemers = ({rebloggedBy}) => {
  const users = rebloggedBy.map(user => <UserLink key={user} user={user} />);

  return (
    <div className='resteemers'>
      <Icon name='retweet' />
      {
        users.map((u, i) => (
          <span key={u.key}>
            { (i ? ', ' : '') }
            { u }
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
