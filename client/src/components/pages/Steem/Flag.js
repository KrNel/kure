import React from 'react';
import PropTypes from 'prop-types'
import { Icon, Popup } from "semantic-ui-react";

import PercentDisplay from './PercentDisplay';
import UserLink from './UserLink';
import { getDownvotes, sortVotes } from '../../../utils/helpers';

/**
 *  The flag icon is displayed for anyone logged in. The amount of flags on a
 *  post is displayed if there are flags applied to a post. Highest SP and
 *  vote weighted flags are displayed first in a popup window, along with
 *  the percent of vote applied.
 *
 *  @param {array} activeVotes The list of voters
 *  @param {array} ratio Ratio of payout divided by rshares for post
 *  @param {array} user User logged in
 */
const Flag = ({activeVotes, ratio,  user}) => {

  const flag = event => {
    event.preventDefault();
  }

  let downVotes = getDownvotes(activeVotes);
  const votesCount = downVotes.length;

  downVotes = sortVotes(downVotes, 'rshares');

  let votersPopup = '';
  if (votesCount) {
    votersPopup = downVotes.slice(0, 14).map(vote => (
      <div key={vote.voter}>
        { <UserLink user={vote.voter} /> }
        {
          <span>
            {`\u00A0\u2022\u00A0`}
            <PercentDisplay value={vote.percent / 10000} />
          </span>
        }
      </div>
    ))
  }

  return (
    <li className="item">
      <span>
        <a className='flag' href="/flag" onClick={event => flag(event)} title="Flag this post on Steem">
          <Icon name='flag outline' size='large' />
        </a>
      </span>
      {
        votesCount !== 0 && (
          <span>
            <Popup
              trigger={<span>{` ${votesCount}`}</span>}
              horizontalOffset={15}
              flowing
              hoverable
            >
              {votersPopup}
            </Popup>
          </span>
        )
      }
    </li>
  )
}

Flag.propTypes = {
  activeVotes: PropTypes.arrayOf(PropTypes.object),
  ratio: PropTypes.number,
  user: PropTypes.string,
};

Flag.defaultProps = {
  activeVotes: [],
  ratio: 0,
  user: '',
};

export default Flag;
