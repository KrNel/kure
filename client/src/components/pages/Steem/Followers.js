import React from 'react';
import PropTypes from 'prop-types';
import { Header, Icon, Form, Grid } from "semantic-ui-react";

import UserCard from './UserCard';
import FollowButton from './FollowButton';

/**
 *  The Follower page. Displays the list of users that follow someone, and
 *  allows for searching a follower.
 *
 *  @param {array} followers Followers of a user
 */
const Followers = (props) => {
  const {
    followers,
    userLogged,
    handleSubmitFollowFind,
    handleChangeFollowFind,
    searchFollowers,
    searchFollowLoading,
  } = props;

  return (
    <div id='follows'>
      <Grid columns={2}>
        <Grid.Column width={4}>
          <Header as='h2'>Followers</Header>
        </Grid.Column>
        <Grid.Column width={12}>
          <Form size="tiny" onSubmit={() => handleSubmitFollowFind('followers')}>
            <Form.Group className='left'>
              <Form.Field>
                <Form.Input
                  placeholder='Find a user'
                  name='searchFollowers'
                  value={searchFollowers}
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
        followers.map(follower => {
          const user = follower.follower;

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

Followers.propTypes = {
  followers: PropTypes.arrayOf(PropTypes.object),
  userLogged: PropTypes.string,
  handleSubmitFollowFind: PropTypes.func,
  handleChangeFollowFind: PropTypes.func,
  searchFollowers: PropTypes.string,
  searchFollowLoading: PropTypes.bool,
};

Followers.defaultProps = {
  followers: [],
  userLogged: '',
  handleSubmitFollowFind: () => {},
  handleChangeFollowFind: () => {},
  searchFollowers: '',
  searchFollowLoading: false,
};

export default Followers;
