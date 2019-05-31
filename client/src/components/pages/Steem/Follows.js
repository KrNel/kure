import React from 'react';
import PropTypes from 'prop-types';
import { Header, Icon, Form, Grid } from "semantic-ui-react";

import UserCard from './UserCard';
import FollowButton from './FollowButton';
import './Follows.css';

/**
 *  Container to handle the state for the Follower and Following pages.
 *  Changes to the search form are store din the state, and a search request
 *  is received and sent to Redux for the particular page type.
 */
class Follows extends React.Component {
  static propTypes = {
    followers: PropTypes.arrayOf(PropTypes.object),
    following: PropTypes.arrayOf(PropTypes.object),
    userLogged: PropTypes.string,
    author: PropTypes.string,
    getSearchFollow: PropTypes.func,
    path: PropTypes.string,
    searchFollowLoading: PropTypes.bool,
  };

  static defaultProps = {
    followers: [],
    userLogged: '',
    following: [],
    author: '',
    getSearchFollow: () => {},
    path: '',
    searchFollowLoading: false,
  };

  state = {
    searchFollowers: '',
    searchFollowing: '',
  }

  alphabet = ("abcdefghijklmnopqrstuvwxyz").split("");

  /**
   *  Create the links for the alphabet to allow searching for followers and
   *  following by letter.
   */
  searchAlpha = this.alphabet.map((letter, index) => {
    return (
      <span key={letter}>
        {
          index === 13 && <br />
        }
        <a
          href={`follows/${letter}`}
          onClick={(e) => this.getLetterSearch(e, letter)}
          className='searchLetter'
        >
          { letter }
        </a>
      </span>
    )
  })

  /**
   *  Set state values for when finding a user changes.
   *
   *  @param {event} e Event triggered by element to handle
   *  @param {string} name Name of the element triggering the event
   *  @param {string} value Value of the element triggering the event
   */
  handleChangeFollowFind = (event, { name, value }) => {
    this.setState({
      [name]: value,
     });
  }

  /**
   *  Send a search to Redux based on the type/page (followers}following).
   *
   *  @param {string} page Page requesting a search
   */
  handleSubmitFollowFind = (page, searchLetter = '') => {
    const {
      props: {
        author,
        getSearchFollow,
      },
      state: {
        searchFollowers,
        searchFollowing,
      }
    } = this;

    if (page === 'followers') {
      const searchVal = searchLetter || searchFollowers;
      getSearchFollow(author, searchVal, page);
      this.setState({searchFollowers: searchVal});
    }else {
      const searchVal = searchLetter || searchFollowing;
      getSearchFollow(author, searchVal, page);
      this.setState({searchFollowing: searchVal});
    }
  }

  /**
   *  Intermediary function to stop the default link behavior and then
   *  send a search for a follower/following user via Redux.
   *
   *  @param {event} event Event triggered by element
   *  @param {string} letter Letter clicked on
   */
  getLetterSearch = (event, searchLetter) => {
    event.preventDefault();

    const { path } = this.props;
    const followType = path === '/@:author/followers' ? 'followers' : 'following';

    this.handleSubmitFollowFind(followType, searchLetter);
  }

  render() {
    const {
      props: {
        userLogged,
        followers,
        following,
        path,
        searchFollowLoading,
      },
      state: {
        searchFollowers,
        searchFollowing,
      }
    } = this;

    let followHeader = 'Followers';
    let followType = 'followers';
    let followArray = followers;
    if (path === '/@:author/following') {
      followHeader = 'Following';
      followType = 'following';
      followArray = following;
    }

    return (
      <div id='follows'>
        <Grid stackable>
          <Grid.Column width={4}>
            <Header as='h2'>{followHeader}</Header>
          </Grid.Column>
          <Grid.Column width={6}>
            <Form size="tiny" onSubmit={() => this.handleSubmitFollowFind(followType)}>
              <Form.Group className='left'>
                <Form.Field>
                  {
                    path === '/@:author/followers'
                    ? (
                      <Form.Input
                        placeholder='Find a user'
                        name='searchFollowers'
                        value={searchFollowers}
                        onChange={this.handleChangeFollowFind}
                        loading={searchFollowLoading}
                        icon='user'
                        iconPosition='left'
                      />
                    )
                    : (
                      <Form.Input
                        placeholder='Find a user'
                        name='searchFollowing'
                        value={searchFollowing}
                        onChange={this.handleChangeFollowFind}
                        loading={searchFollowLoading}
                        icon='user'
                        iconPosition='left'
                      />
                    )
                  }
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
          <Grid.Column width={6}>
            <div className='searchLetters'>
              { this.searchAlpha }
            </div>
          </Grid.Column>
          <Grid.Row>
            <Grid.Column>
              {
                followArray.map(follow => {
                  const user = followType === 'followers' ? follow.follower : follow.following;

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
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}

export default Follows;
