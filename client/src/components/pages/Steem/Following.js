import React from 'react';
import PropTypes from 'prop-types';
import { Header, Icon, Form, Grid } from "semantic-ui-react";

import UserCard from './UserCard';
import FollowButton from './FollowButton';

/**
 *  The Follower page. Displays the list of users someone follows, and
 *  allows for searching a following user.
 *
 *  @param {array} following Users being followed
 */
const Following = (props) => {
  const {
    following,
    userLogged,
    handleSubmitFollowFind,
    handleChangeFollowFind,
    searchFollowing,
    searchFollowLoading,
  } = props;

  return (
    <div id='follows'>
      <Grid columns={2}>
        <Grid.Column width={4}>
          <Header as='h2'>Following</Header>
        </Grid.Column>
        <Grid.Column width={12}>
          <Form size="tiny" onSubmit={() => handleSubmitFollowFind('following')}>
            <Form.Group className='left'>
              <Form.Field>
                <Form.Input
                  placeholder='Find a user'
                  name='searchFollowing'
                  value={searchFollowing}
                  onChange={handleChangeFollowFind}
                  loading={searchFollowLoading}
                  icon='user'
                  iconPosition='left'
                />
              </Form.Field>
              <Form.Button
                icon
                size="tiny"
                color="blue"
                disabled={searchFollowLoading}
              >
                <Icon name="search" />
              </Form.Button>
            </Form.Group>
          </Form>
        </Grid.Column>
      </Grid>
      {
        following.map(follower => {
          const user = follower.following;

          return (
            <div className='follow' key={user}>
              <UserCard user={user}>
                {
                  userLogged !== user
                  ? <FollowButton user={user} />
                  : null
                }
              </UserCard>
            </div>
          )
        })
      }
    </div>
  )
}

Following.propTypes = {
  following: PropTypes.arrayOf(PropTypes.object.isRequired),
  userLogged: PropTypes.string,
  handleSubmitFollowFind: PropTypes.func,
  handleChangeFollowFind: PropTypes.func,
  searchFollowing: PropTypes.string,
  searchFollowLoading: PropTypes.bool,
};

Following.defaultProps = {
  following: [],
  userLogged: '',
  handleSubmitFollowFind: () => {},
  handleChangeFollowFind: () => {},
  searchFollowing: '',
  searchFollowLoading: false,
};

export default Following;
