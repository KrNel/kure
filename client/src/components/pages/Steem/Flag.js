import React from 'react';
import PropTypes from 'prop-types'
import { Icon, Popup, Button } from "semantic-ui-react";
import Slider from 'react-rangeslider';
import { connect } from 'react-redux';

import PercentDisplay from './PercentDisplay';
import DollarDisplay from './DollarDisplay';
import UserLink from './UserLink';
import { getDownvotes, sortVotes } from '../../../utils/helpers';
import { downvotePost } from '../../../actions/upvoteActions';
import 'react-rangeslider/lib/index.css';
import './VoteSlider.css';

/**
 *  The flag icon is displayed for anyone logged in. The amount of flags on a
 *  post is displayed if there are flags applied to a post. Highest SP and
 *  vote weighted flags are displayed first in a popup window, along with
 *  the percent of vote applied. Flagging is sent as a downvote to Redux and
 *  the payload is returned to upate the view with the flag.
 *
 *  @param {array} activeVotes The list of voters
 *  @param {array} ratio Ratio of payout divided by rshares for post
 *  @param {array} user User logged in
 */
class Flag extends React.Component {
  static propTypes = {
    activeVotes: PropTypes.arrayOf(PropTypes.object),
    ratio: PropTypes.number,
    user: PropTypes.string,
    showModalVotes: PropTypes.func,
    handleDownvote: PropTypes.func,
    pid: PropTypes.number,
    author: PropTypes.string,
    permlink: PropTypes.string,
    upvotePayload: PropTypes.shape(PropTypes.object.isRequired),
  };

  static defaultProps = {
    activeVotes: [],
    ratio: 0,
    user: '',
    showModalVotes: () => {},
    handleDownvote: () => {},
    pid: 0,
    author:'',
    permlink: '',
    upvotePayload: {},
  };

  state = {
    unflag: false,
    showSlider: false,
    sliderWeight: 10000,
  }

  flag = (event, user, pid) => {
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
    const downvote = document.querySelector(`#flagpid-${pid}`);
    if (downvote.classList.contains("flagged")) {
      this.setState({unflag: true});
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

    const { handleDownvote, user } = this.props;

    this.setSavedVoteWeight(weight, user);

    this.setState({ showSlider: false });

    handleDownvote(author, permlink, weight * -1);
  }

  /**
   *  The unvoting is handled here with the author and permlink being used to
   *  send the flag with the vote weight of 0 to remove the previous flag.
   *
   *  @param {element} event Element triggering the event
   *  @param {string} author Post author
   *  @param {string} permlink Post permlink
   */
  handleUnvote = (event, author, permlink) => {
    event.preventDefault();

    const { handleDownvote } = this.props;

    handleDownvote(author, permlink, 0);
  }

  /**
   *  Exit out of unvote when already voted.
   */
  handleCloseUnvote = () => {
    this.setState({unflag: false});
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
    localStorage.setItem('voteWeight-down-' + user, weight);
  }

  /**
   *  Gets the vote weight from localStorage for thevote slider setting.
   *
   *  @param {string} user Voting user
   */
  getSavedVoteWeight = user => (
    localStorage.getItem('voteWeight-down-' + user)
  )

  render() {
    const {
      props: {
        activeVotes,
        ratio,
        user,
        showModalVotes,
        pid,
        author,
        permlink,
        upvotePayload,
      },
      state: {
        unflag,
        showSlider,
        sliderWeight,
      }
    } = this;

    const votedAuthor = upvotePayload.author;
    const votedPermlink = upvotePayload.permlink;
    const votedVoters = getDownvotes(upvotePayload.post.active_votes);

    const isThisPost = votedAuthor === author && votedPermlink === permlink;

    let voters = getDownvotes(activeVotes);
    let votesCount = voters.length;

    if (votedVoters.length && isThisPost) {
      votesCount = votedVoters.length;
      voters = votedVoters;
    }

    voters = sortVotes(voters, 'rshares');

    const isVotedOn = voters.some(vote => vote.voter === user);

    const isNewlyVoted = upvotePayload.votedPosts.length ? upvotePayload.votedPosts.some(votedPost => votedPost.id === pid) && isVotedOn : false;

    let voteTitle = 'Flag post';
    let downvoteClasses = '';
    let flagIcon = 'flag outline';

    if (upvotePayload.isDownvoting && isThisPost) {
      downvoteClasses = 'loading';
    }else if (isNewlyVoted) {
      downvoteClasses = 'flagged';
      voteTitle = 'Remove flag';
      flagIcon = 'flag';
    }else if (isVotedOn) {
      downvoteClasses = 'flagged';
      voteTitle = 'Remove flag';
      flagIcon = 'flag';
    }

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

    //construct the vote slider
    let sliderClass = 'vslider-show';
    let voteSlider = null;
    if (showSlider) {
      sliderClass += ' showing';
      voteSlider  = (
        <div className='change-weight'>
          <div><strong>Flagging will remove rewards.</strong></div>
          <ul>
            <li>
              <a
                href='/downvote'
                className='accept-weight'
                onClick={event => this.handleVote(event, author, permlink, sliderWeight)}
              >
                <Icon name='flag outline' size='big' color='green' />
              </a>
            </li>
            <li>
              <span>
                <div className='weight-display'>
                  {`${sliderWeight / -100}%`}
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
      <li className="item">
        <span>
          <div className='vslider'>
            <div className={sliderClass}>
              {voteSlider}
            </div>
          </div>
          <Popup
            trigger={(
              <a className='flag' href="/flag" onClick={event => this.flag(event, user, pid)} title={voteTitle}>
                <Icon id={`flagpid-${pid}`} name={flagIcon} size='large' className={downvoteClasses} />
              </a>
            )}
            open={unflag}
            onClose={this.handleCloseUnvote}
            position='top center'
            flowing
            hoverable
          >
            <p>
              {'Are you sure you want to remove the flag?'}
            </p>
            <Button
              color='green'
              content='Confirm unflag.'
              onClick={event => this.handleUnvote(event, author, permlink)}
            />
          </Popup>

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
      </li>
    )
  }
}

/**
 *  Map redux state to component props.
 *
 *  @param {object} state - Redux state
 *  @returns {object} - Object with recent activity data
 */
 const mapStateToProps = state => {
   const {
     upvote: {
       upvotePayload,
     },
   } = state;

   return {
     upvotePayload,
   }
 }

 /**
  *  Map redux dispatch functions to component props.
  *
  *  @param {object} dispatch - Redux dispatch
  *  @returns {object} - Object with recent activity data
  */
const mapDispatchToProps = dispatch => (
  {
    handleDownvote: (author, permlink, weight) => (
      dispatch(downvotePost(author, permlink, weight))
    ),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(Flag);
//export default Flag;
