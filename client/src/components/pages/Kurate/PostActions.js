import React, {createRef, Component} from 'react';
import './PostActions.css';
import { Icon, Popup } from "semantic-ui-react";

import Slider from 'react-rangeslider'
import './VoteSlider.css';
import DollarDisplay from '../../common/DollarDisplay';
import UserLink from '../../common/UserLink';


const getUpvotes = activeVotes => activeVotes.filter(vote => vote.percent > 0);
const getDownvotes = activeVotes => activeVotes.filter(vote => vote.percent < 0);
const sortVotes = (votes, sortBy) => votes.sort((a, b) => a[sortBy] - b[sortBy]);

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
class PostActions extends Component {
  state = {
    unvote: false,
    showSlider: false,
    sliderWeight: 10000
  }
  createRef = createRef();

  vote = (e, user) => {
    e.preventDefault();

    //Don't upvote if not logged in
    if (!user) {
      return null;
    }

    //Don't upvote if already upvoted
    const upvote = document.querySelector("#upvote");
    if (upvote.classList.contains("votedOn")) {
      this.setState({unvote: true});
      return null;
    }

    this.setState({showSlider: true});
  }

  handleWeightChange = weight => {
    this.setState({ sliderWeight: weight });
  };

  handleUpvote = (e, author, permlink, weight) => {
    e.preventDefault();
    this.setState({ showSlider: false });
    //this.props.handleUpvote(author, permlink, weight);
    this.props.handleUpvote(author, permlink, 1);
  }

  handleCloseUnvote = () => {
    this.setState({unvote: false});
  }

  comment = (e) => {
    e.preventDefault();
  }

  resteem = (e) => {
    e.preventDefault();
  }

  flag = (e) => {
    e.preventDefault();
  }

  render() {
    const {
      props: {
        activeVotes, commentCount, author, category, payoutValue, permlink, title, showModal, user, handleUpvote, upvotePayload, ratio
      },
      state: {
        unvote,
        showSlider,
        sliderWeight,
      }
    } = this;

    let upvoteClasses = '';
    if (upvotePayload.isUpvoting && upvotePayload.author === author && upvotePayload.permlink === permlink) {
      upvoteClasses = 'loading';
    }else if (upvotePayload.voters.length && upvotePayload.voters.some(v => v.voter === user) && upvotePayload.author === author && upvotePayload.permlink === permlink) {
      upvoteClasses = 'votedOn';
    }else if (activeVotes.some(v => v.voter === user)) {
      upvoteClasses = 'votedOn';
    }

    let votesCount = getUpvotes(activeVotes).length;
    let voters = activeVotes;
    if (upvotePayload.voters.length && upvotePayload.author === author && upvotePayload.permlink === permlink) {
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
                onClick={e => this.handleUpvote(e, author, permlink, sliderWeight)}
              >
                <Icon name='chevron up circle' size='big' color='green' />
              </a>
            </li>
            <li>
              <span>
                <div className='weight-display'>{sliderWeight / 100}%</div>
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
      <div className='footer'>
        <ul className="meta">

          <li className="item payout">{payoutValue}</li>

          <li className="item upvote">
            <div className='vslider'>
              <div className={sliderClass}>
                {voteSlider}
              </div>
            </div>
            <Popup
              trigger={(
                <a ref={this.contextRef} href="/vote" onClick={e => this.vote(e, user)} title={`${votesCount} upvotes on Steem`}>
                  <Icon id='upvote' name='chevron up circle' size='large' className={upvoteClasses} />
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
              trigger={<strong>{votesCount}</strong>}
              horizontalOffset={15}
              flowing
              hoverable
            >
              {votersPopup}
            </Popup>
          </li>

          <li className="item disabled">
            <a href="/comment" onClick={(e) => this.comment(e)} title={`${commentCount} comments`}>
              <Icon name='comment outline' size='large' />
              <strong>{commentCount}</strong>
            </a>
          </li>

          <li className="item disabled">
            <a href="/resteem" onClick={(e) => this.resteem(e)} title="Resteem">
              <Icon name='retweet' size='large' />
            </a>
          </li>

          <li className="item disabled">
            <a href="/flag" onClick={(e) => this.flag(e)} title="Flag this post on Steem">
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
}

export default PostActions;
