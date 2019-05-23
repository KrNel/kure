import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

import { sendFollowUser, sendUnfollowUser } from '../../../actions/followActions';
import './FollowButton.css';

/**
 *  A button is shown with the unfollow or follow test shown based on the
 *  logged in user having the opposite as their current following list.
 *  When clicking the button, the followPayload will alternate the button
 *  display text to the opposite of what it was.
 *
 *  @param {array} followingList Logged in user ist of following users
 *  @param {string} user User to follow or unfollow
 *  @param {boolean} isAuth Determines if logged in user
 *  @param {function} followUser Redux follow function
 *  @param {function} unfollowUser Redux unfollow function
 *  @param {object} followPayload Redux follow/unfollow payload
 *  @param {string} pageOwner Who the page owner is
 *  @param {boolean} compact Determines if compact view
 */
const FollowButton = (props) => {
  const {
    followingList,
    user,
    isAuth,
    followUser,
    unfollowUser,
    followPayload,
    pageOwner,
    compact,
  } = props;

  if (!isAuth)
    return null;

  //is the current user being follow by the logged in user
  const followed = followingList.includes(user);

  const { userFollowing } = followPayload;
  let loading = false;

  if (userFollowing && userFollowing === user)
    loading = true;

  let button = null;
  if (!followed)
    button = (
      <Button
        content='Follow'
        basic
        onClick={() => followUser(user, pageOwner)}
        loading={loading}
      />
    )
  else
    button = (
      <Button
        content='Unfollow'
        color='blue'
        onClick={() => unfollowUser(user, pageOwner)}
        loading={loading}
      />
    )

  if (compact)
    button = (
      <span className='followSpacer'>
        { button }
      </span>
    )

  return (
    button
  )
}

FollowButton.propTypes = {
  followingList: PropTypes.arrayOf(PropTypes.string),
  user: PropTypes.string,
  isAuth: PropTypes.bool,
  followUser: PropTypes.func,
  unfollowUser: PropTypes.func,
  followPayload: PropTypes.shape(PropTypes.object.isRequired),
  pageOwner: PropTypes.string,
};

FollowButton.defaultProps = {
  followingList: [],
  user: '',
  isAuth: false,
  followUser: () => {},
  unfollowUser: () => {},
  followPayload: {},
  pageOwner: '',
};

/**
 *  Map redux state to component props.
 *
 *  @param {object} state - Redux state
 *  @returns {object} - Object with recent activity data
 */
const mapStateToProps = state => {
  const {
    auth: {
      isAuth,
    },
    follow: {
      followingList,
      followPayload,
    },
  } = state;

  return {
    isAuth,
    followingList,
    followPayload,
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
    followUser: (user, pageOwner) => (
      dispatch(sendFollowUser(user, pageOwner))
    ),
    unfollowUser: (user, pageOwner) => (
      dispatch(sendUnfollowUser(user, pageOwner))
    ),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(FollowButton);
