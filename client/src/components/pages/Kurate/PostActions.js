import React from 'react';
import './PostActions.css';
import { Icon, Popup } from "semantic-ui-react";
import Slider from 'react-rangeslider';

import SteemConnect from '../../../utils/auth/scAPI';
import DollarDisplay from '../../common/DollarDisplay';
import UserLink from '../../common/UserLink';


const getUpvotes = activeVotes => activeVotes.filter(vote => vote.percent > 0);
const getDownvotes = activeVotes => activeVotes.filter(vote => vote.percent < 0);
const sortVotes = (votes, sortBy) => votes.sort((a, b) => a[sortBy] - b[sortBy]);

const vote = (e, handleUpvote, user, author, permlink, weight) => {
  e.preventDefault();

  if (!user) {
    return null;
  }
  //handleUpvote(author, permlink, weight);

  //upvote();
  /*SteemConnect.vote('krnel', 'informationwar', 're-krnel-100-unofficially-confirmed-the-u-s-justice-department-is-going-after-julian-assange-wikileaks-20190306t024510422z', 1)
    .then((err, res) => {
console.log('err:',err)
console.log('res:',res)
    });*/
}

const comment = (e) => {
  e.preventDefault();
}

const resteem = (e) => {
  e.preventDefault();
}

const flag = (e) => {
  e.preventDefault();
}

/**
 *  Displays the data and actions for the posts.
 *  This includes likes, votes, comments, dislikes, flags and adding a post to
 *  a community.
 *
 *  @param {string} activeVotesCount Number of Steem upvotes
 *  @param {number} commentCount Number of comments
 *  @param {string} author Author of post
 *  @param {number} category Category of the post
 *  @param {string} permlink Steem permlink for post
 *  @param {string} title Post's title
 *  @param {function} showModal Parent function to show the add post modal
 */
const PostActions = ({activeVotes, commentCount, author, category, payoutValue, permlink, title, showModal, user, handleUpvote, upvotePayload, ratio}) => {

  let upvoteClasses = '';
  if (upvotePayload.isUpvoting && upvotePayload.author === author && upvotePayload.permlink === permlink) {
    upvoteClasses = 'loading';
  }else if (upvotePayload.voters.length && upvotePayload.voters.some(v => v.voter === user)) {
    upvoteClasses = 'votedOn';
  }else if (activeVotes.some(v => v.voter === user)) {
    upvoteClasses = 'votedOn';
  }

  let votesCount = getUpvotes(activeVotes).length;
  let voters = activeVotes;
  if (upvotePayload.voters.length) {
    votesCount = getUpvotes(upvotePayload.voters).length;
    voters = upvotePayload.voters;
  }

  voters = sortVotes(voters, 'rshares').reverse();

  let votersPopup = '';
  if (votesCount) {
    votersPopup = voters.slice(0, 9).map(vote => (
      <div key={vote.voter}>
        {<UserLink user={vote.voter} />}

        {vote.rshares * ratio > 0.01 && (
          <span style={{ opacity: '0.5' }}>
            {' '}
            <DollarDisplay value={vote.rshares * ratio} />
          </span>
        )}
      </div>
    ));
  }else {
    votersPopup = 'No voters yet.';
  }

  const weight = 1;

  return (
    <div className='footer'>
      <ul className="meta">
        <li className="item payout">{payoutValue}</li>
        <li className="item upvote">
          <a href="/vote" onClick={e => vote(e, handleUpvote, user, author, permlink, weight)} title={`${votesCount} upvotes on Steem`}>
            <Icon name='chevron up circle' size='large' className={upvoteClasses} />
          </a>
          {/*<Slider
              min={100}
              max={MAX_WEIGHT}
              step={100}
              value={b}
              onChange={this.handleWeightChange(up)}
              onChangeComplete={this.storeSliderWeight(up)}
              tooltip={false}
          />*/}
          <Popup
            trigger={<strong>{votesCount}</strong>}
            horizontalOffset={15}
            flowing
            hoverable
          >
            {votersPopup}
          </Popup>
        </li>
        <li className="item disabled">
          <a href="/comment" onClick={(e) => comment(e)} title={`${commentCount} comments`}>
            <Icon name='comment outline' size='large' />
            <strong>{commentCount}</strong>
          </a>
        </li>
        <li className="item disabled">
          <a href="/resteem" onClick={(e) => resteem(e)} title="Resteem">
            <Icon name='retweet' size='large' />
          </a>
        </li>
        <li className="item disabled">
          <a href="/flag" onClick={(e) => flag(e)} title="Flag this post on Steem">
            <Icon name='flag outline' size='large' />
          </a>
        </li>
      </ul>
      <div className='right'>
        {
          user
          && (
            <a href="/group/add" onClick={(e) => showModal(e, 'addPost', {author, category, permlink, title})} title="Add to a community">
              <Icon name='plus circle' size='large' />
            </a>
          )
        }
      </div>
    </div>
  )
}

export default PostActions;
