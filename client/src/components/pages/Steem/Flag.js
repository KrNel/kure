import React from 'react';
import PropTypes from 'prop-types'
import { Icon, Popup } from "semantic-ui-react";

import PercentDisplay from './PercentDisplay';
import DollarDisplay from './DollarDisplay';
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
const Flag = ({activeVotes, ratio,  user, showModalVotes}) => {

  const flag = event => {
    event.preventDefault();
  }

  let voters = getDownvotes(activeVotes);
  const votesCount = voters.length;

  voters = sortVotes(voters, 'rshares');

  let votersPopup = '';
  if (votesCount) {
    votersPopup = voters.slice(0, 14).map(vote => (
      <div key={vote.voter}>
        { <UserLink user={vote.voter} /> }
        <span>
          {`\u00A0\u00A0`}
          <DollarDisplay value={vote.rshares * ratio} />
        </span>
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
        votesCount > 0 && (
          <span>
            <Popup
              trigger={(
                <span>
                  <a
                    href='#votes'
                    onClick={event => showModalVotes(event, {voters, ratio})}
                  >
                    {` ${votesCount}`}
                  </a>
                </span>
              )}
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
  showModalVotes: PropTypes.func,
};

Flag.defaultProps = {
  activeVotes: [],
  ratio: 0,
  user: '',
  showModalVotes: () => {},
};

export default Flag;
