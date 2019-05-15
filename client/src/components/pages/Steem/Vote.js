import React, { Component } from 'react';
import { Icon, Popup, Button } from "semantic-ui-react";
import Slider from 'react-rangeslider';
import PropTypes from 'prop-types';

import DollarDisplay from './DollarDisplay';
import PercentDisplay from './PercentDisplay';
import UserLink from './UserLink';
import FullPower from './FullPower';
import { getUpvotes, sortVotes } from '../../../utils/helpers';

import 'react-rangeslider/lib/index.css';
import './VoteSlider.css';
import './PostActions.css';

/* eslint-disable react/jsx-one-expression-per-line */

/**
 *  Component to show the payout amount, vote button and vote count.
 *
 *  The vote button opens up a vote slider component to allow choosing a
 *  percentage of voting power to apply, from 1-100%. The second vote from the
 *  slider then sends the post and user data to the redux store function
 *  to apply the vote to the Steem blockchain. Data is returned from the
 *  redux store in 'upvotePayload' to calcualte new values to show.
 */
class Vote extends Component {

  static propTypes = {
    user: PropTypes.string.isRequired,
    activeVotes: PropTypes.arrayOf(PropTypes.object),
    author: PropTypes.string.isRequired,
    payoutValue: PropTypes.number.isRequired,
    permlink: PropTypes.string.isRequired,
    handleUpvote: PropTypes.func.isRequired,
    upvotePayload: PropTypes.shape(PropTypes.object.isRequired),
    ratio: PropTypes.number.isRequired,
    pid: PropTypes.number.isRequired,
    payoutDeclined: PropTypes.bool,
    isFullPower: PropTypes.bool,
  };

  static defaultProps = {
    activeVotes: [],
    upvotePayload: {},
    payoutDeclined: false,
    isFullPower: false,
  }

  state = {
    unvote: false,
    showSlider: false,
    sliderWeight: 10000
  }

  /**
   *  Initial voting requests to process when upvote clicked.
   *  Take the post ID and find the matching element on page to test if the
   *  class 'votedOn' exists. If it does, set the state 'unvote' to true to
   *  signal that the click is for an unvote, not an upvote.
   *  If there is no 'votedOn' class, then it's an upvote, and show the slider.
   *
   *  @param {element} event Element triggering the event
   *  @param {string} user Username performing action
   *  @param {string} pid Post ID
   *  @return {null}
   */
  vote = (event, user, pid) => {
    event.preventDefault();

    //Don't upvote if not logged in
    if (!user) {
      return null;
    }

    let weight = this.getSavedVoteWeight(user);
    if (weight === null) {
      weight = 10000;
    }


    //Don't upvote if already upvoted
    const upvote = document.querySelector(`#pid-${pid}`);
    if (upvote.classList.contains("votedOn")) {
      this.setState({unvote: true});
      return null;
    }

    this.setState({
      showSlider: true,
      sliderWeight: parseInt(weight),
    });
  }

  /**
   *  Changes to the weight for the slider by setting state to weight.
   *
   *  @param {number} weight Weight value received from slider
   */
  handleWeightChange = weight => {
    this.setState({ sliderWeight: weight });
  };

  /**
   *  The real upvote is sent here after the confimation to vote is done via
   *  the slider.
   *
   *  @param {element} event Element triggering the event
   *  @param {string} author Post author
   *  @param {string} permlink Post permlink
   *  @param {number} weight Weight value received from slider
   */
  handleVote = (event, author, permlink, weight) => {
    event.preventDefault();

    const { handleUpvote, user } = this.props;

    this.setSavedVoteWeight(weight, user);

    this.setState({ showSlider: false });

    handleUpvote(author, permlink, weight);
  }

  /**
   *  The unvoting is  handled here with the author and permlink being used to
   *  send the upvote with the vote weight of 0 to remove the previous vote.
   *
   *  @param {element} event Element triggering the event
   *  @param {string} author Post author
   *  @param {string} permlink Post permlink
   */
  handleUnvote = (event, author, permlink) => {
    event.preventDefault();

    const { handleUpvote } = this.props;

    handleUpvote(author, permlink, 0);
  }

  /**
   *  Exit out of unvote when already voted.
   */
  handleCloseUnvote = () => {
    this.setState({unvote: false});
  }

  /**
   *  When the upvote slider is closed, the vote weight is saved in
   *  localStorage for future use of that user.
   *
   *  @param {element} event Element triggering the event
   *  @param {string} user Voting user
   *  @param {number} weight Weight value received from slider
   */
  closeVoteSlider = (event, user, weight) => {
    event.preventDefault();
    this.setSavedVoteWeight(weight, user);
    this.setState({ showSlider: false });
  }

  /**
   *  Sets the vote weight into localStorage for the user's future use.
   *
   *  @param {string} user Voting user
   *  @param {number} weight Weight value received from slider
   */
  setSavedVoteWeight = (weight, user) => {
    localStorage.setItem('voteWeight-' + user, weight);
  }

  /**
   *  Gets the vote weight from localStorage for thevote slider setting.
   *
   *  @param {string} user Voting user
   */
  getSavedVoteWeight = user => (
    localStorage.getItem('voteWeight-' + user)
  )

  render() {
    const {
      props: {
        activeVotes,
        author,
        payoutValue,
        permlink,
        user,
        upvotePayload,
        ratio,
        pid,
        payoutDeclined,
        isFullPower,
      },
      state: {
        unvote,
        showSlider,
        sliderWeight,
      }
    } = this;

    const isFlagged = activeVotes.some(vote => vote.percent < 0);

    const votedAuthor = upvotePayload.author;
    const votedPermlink = upvotePayload.permlink;
    const votedVoters = upvotePayload.post.active_votes;

    const isThisPost = votedAuthor === author && votedPermlink === permlink;

    let votesCount = getUpvotes(activeVotes).length;
    let voters = activeVotes;
    if (votedVoters.length && isThisPost) {
      votesCount = getUpvotes(votedVoters).length;
      voters = votedVoters;
    }

    voters = sortVotes(voters, 'rshares').reverse();

    const isVotedOn = voters.some(vote => vote.voter === user && vote.percent !== 0);

    //determine if the Redux state voted posts is the current post, and if the
    //the voters list contains the current user and is not an unvote (0%)
    const isNewlyVoted = upvotePayload.votedPosts.length ? upvotePayload.votedPosts.some(votedPost => votedPost.id === pid) && isVotedOn : false;

    //determine if post/comment is being or is voted on
    let voteTitle = 'Upvote post';
    let upvoteClasses = '';
    if (upvotePayload.isUpvoting && isThisPost) {
      upvoteClasses = 'loading';
    }else if (isNewlyVoted) {
      upvoteClasses = 'votedOn';
      voteTitle = 'Unvote post';
    }else if (isVotedOn) {
      upvoteClasses = 'votedOn';
      voteTitle = 'Unvote post';
    }else if (voters.some(vote => vote.voter === user && vote.percent === 0)) {
      upvoteClasses = 'voteRemoved';
      voteTitle = 'Re-upvote post';
    }

    //vote count popup to show who voted, the vote value and percentage applied
    let votersPopup = '';
    if (votesCount) {
      votersPopup = voters.slice(0, 14).map(vote => (
        <div key={vote.voter}>
          { <UserLink user={vote.voter} /> }

          { vote.rshares * ratio > 0.001 && (
            <span>
              {`\u00A0\u00A0`}
              <DollarDisplay value={vote.rshares * ratio} />
            </span>
          )}

          {
            <span>
              {`\u00A0\u2022\u00A0`}
              <PercentDisplay value={vote.percent / 10000} />
            </span>
          }
        </div>
      ))
    }else {
      votersPopup = 'No voters yet.';
    }

    //construct the vote slider
    let sliderClass = 'vslider-show';
    let voteSlider = null;
    if (showSlider) {
      sliderClass += ' showing';
      voteSlider  = (
        <div className='change-weight'>
          <ul>
            <li>
              <a
                href='/upvote'
                className='accept-weight'
                onClick={event => this.handleVote(event, author, permlink, sliderWeight)}
              >
                <Icon name='chevron up circle' size='big' color='green' />
              </a>
            </li>
            <li>
              <span>
                <div className='weight-display'>
                  {`${sliderWeight / 100}%`}
                </div>
                <Slider
                  min={100}
                  max={10000}
                  step={100}
                  value={sliderWeight}
                  onChange={this.handleWeightChange}
                  tooltip={false}
                />
              </span>
            </li>
            <li>
              <a
                href='/close'
                className='close-weight'
                onClick={event => {
                  this.closeVoteSlider(event, user, sliderWeight)
                }}
              >
                <Icon name='window close outline' size='big' color='red' />
              </a>
            </li>
          </ul>
        </div>
      )
    }

    return (
      <React.Fragment>
        <li className="item payout">
          {
            isFullPower && <FullPower />
          }
          {
            isFlagged && (
              <span>
                {
                  isFullPower && ' '
                }
                <Icon
                  name='flag outline'
                  color='red'
                  size='large'
                  title='Flagged post'
                />
                {' '}
              </span>
            )
          }
          <span>
            <DollarDisplay
              value={payoutValue}
              payoutDeclined={payoutDeclined}
            />
          </span>
        </li>

        <li className="item upvote">
          <span>
            <div className='vslider'>
              <div className={sliderClass}>
                {voteSlider}
              </div>
            </div>
            <Popup
              trigger={(
                <a ref={this.contextRef} href="/vote" onClick={event => this.vote(event, user, pid)} title={voteTitle}>
                  <Icon id={`pid-${pid}`} name='chevron up circle' size='large' className={upvoteClasses} />
                </a>
              )}
              open={unvote}
              onClose={this.handleCloseUnvote}
              position='top center'
              flowing
              hoverable
            >
              <p>
                Are you sure you want to remove
                <br />
                the vote and curation rewards?
              </p>
              <Button
                color='green'
                content='Confirm unvote.'
                onClick={event => this.handleUnvote(event, author, permlink)}
              />
            </Popup>
            <Popup
              trigger={<span>{` ${votesCount}`}</span>}
              horizontalOffset={15}
              flowing
              hoverable
            >
              {votersPopup}
            </Popup>
          </span>
        </li>
      </React.Fragment>
    )
  }
}

export default Vote;
