import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

const FollowButton = (props) => {
  const {
    followingList,
    user,
  } = props;

  const followed = followingList.includes(user);

  return (
    
      !followed
      ? <Button content='Follow' />
      : <Button content='Unfollow' />

  )
}

/**
 *  Map redux state to component props.
 *
 *  @param {object} state - Redux state
 *  @returns {object} - Object with recent activity data
 */
const mapStateToProps = state => {
  const {
    follow: {
      followingList,
    }
  } = state;

  return {
    followingList,
  }
}

export default connect(mapStateToProps)(FollowButton);
