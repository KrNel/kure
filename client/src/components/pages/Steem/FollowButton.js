import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

import { sendFollowUser, sendUnfollowUser } from '../../../actions/followActions';

/**
 *  The Follower page. Displays the list of users that follow someone.
 *
 *  @param {array} followers Followers of a user
 */
const FollowButton = (props) => {
  const {
    followingList,
    user,
    isAuth,
    followUser,
    unfollowUser,
    followPayload,
  } = props;

  const followed = followingList.includes(user);
  const { isFollowing, userFollowing } = followPayload;
  let loading = false;

  if (isFollowing && userFollowing === user)
    loading = true;

  let button = null;
  if (isAuth) {
    if (!followed)
      button = (
        <Button
          content='Follow'
          basic
          onClick={() => followUser(user)}
          loading={loading}
        />
      )
    else
      button = (
        <Button
          content='Unfollow'
          color='blue'
          onClick={() => unfollowUser(user)}
          loading={loading}
        />
      )
  }

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
};

FollowButton.defaultProps = {
  followingList: [],
  user: '',
  isAuth: false,
  followUser: () => {},
  unfollowUser: () => {},
  followPayload: {},
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
    followUser: user => (
      dispatch(sendFollowUser(user))
    ),
    unfollowUser: user => (
      dispatch(sendUnfollowUser(user))
    ),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(FollowButton);
