import React, { Component } from 'react';
import { Icon, Popup } from "semantic-ui-react";
import Slider from 'react-rangeslider'

import DollarDisplay from '../../common/DollarDisplay';
import UserLink from '../../common/UserLink';

import 'react-rangeslider/lib/index.css';
import './VoteSlider.css';
import './PostActions.css';

class Vote extends Component {
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
   *  @param {element} e Element triggering the event
   *  @param {string} user Username performing action
   *  @param {string} pid Post ID
   *  @return {null}
   */
  vote = (e, user, pid) => {
    e.preventDefault();

    //Don't upvote if not logged in
    if (!user) {
      return null;
    }

    //Don't upvote if already upvoted
    const upvote = document.querySelector(`#pid-${pid}`);
    if (upvote.classList.contains("votedOn")) {
      this.setState({unvote: true});
      return null;
    }

    this.setState({showSlider: true});
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
   *  @param {element} e Element triggering the event
   *  @param {string} author Post author
   *  @param {string} permlink Post permlink
   *  @param {number} weight Weight value received from slider
   */
  handleVote = (e, author, permlink, weight) => {
    e.preventDefault();

    const { handleUpvote } = this.props;

    this.setState({ showSlider: false });

    handleUpvote(author, permlink, weight);
  }

  /**
   *  Exit out of unvote when already voted.
   */
  handleCloseUnvote = () => {
    this.setState({unvote: false});
  }

  getUpvotes = activeVotes => activeVotes.filter(vote => vote.percent > 0);
  getDownvotes = activeVotes => activeVotes.filter(vote => vote.percent < 0);
  sortVotes = (votes, sortBy) => votes.sort((a, b) => a[sortBy] - b[sortBy]);

  render() {
    const {
      props: {
        activeVotes,
        author,
        category,
        payoutValue,
        permlink,
        title,
        user,
        handleUpvote,
        upvotePayload,
        ratio,
        pid
      },
      state: {
        unvote,
        showSlider,
        sliderWeight,
      }
    } = this;

    const votedAuthor = upvotePayload.author;
    const votedPermlink = upvotePayload.permlink;
    const votedVoters = upvotePayload.post.active_votes;
    const isVoted = upvotePayload.votedPosts.length ? upvotePayload.votedPosts.some(vp => vp.id === pid) : false;

    const isThisPost = votedAuthor === author && votedPermlink === permlink;

    let upvoteClasses = '';
    if (upvotePayload.isUpvoting && isThisPost) {
      upvoteClasses = 'loading';
    }else if (isVoted) {
      upvoteClasses = 'votedOn';
    }else if (activeVotes.some(v => v.voter === user)) {
      upvoteClasses = 'votedOn';
    }

    let votesCount = this.getUpvotes(activeVotes).length;
    let voters = activeVotes;
    if (votedVoters.length && isThisPost) {
      votesCount = this.getUpvotes(votedVoters).length;
      voters = votedVoters;
    }

    voters = this.sortVotes(voters, 'rshares').reverse();

    let votersPopup = '';
    if (votesCount) {
      votersPopup = voters.slice(0, 14).map(vote => (
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
                onClick={e => this.handleVote(e, author, permlink, sliderWeight)}
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
                onClick={e => {
                  e.preventDefault();
                  this.setState({ showSlider: false });
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
        <li className="item payout">{payoutValue}</li>

        <li className="item upvote">
          <div className='vslider'>
            <div className={sliderClass}>
              {voteSlider}
            </div>
          </div>
          <Popup
            trigger={(
              <a ref={this.contextRef} href="/vote" onClick={e => this.vote(e, user, pid)} title={`${votesCount} upvotes on Steem`}>
                <Icon id={`pid-${pid}`} name='chevron up circle' size='large' className={upvoteClasses} />
              </a>
            )}
            open={unvote}
            onClose={this.handleCloseUnvote}
            position='top center'
            flowing
            hoverable
          >
            {'Unvoting in the works.'}
          </Popup>
          <Popup
            trigger={<span>{votesCount}</span>}
            horizontalOffset={15}
            flowing
            hoverable
          >
            {votersPopup}
          </Popup>
        </li>
      </React.Fragment>
    )
  }
}

export default Vote;
