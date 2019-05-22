import React from 'react';
import PropTypes from 'prop-types';

import Followers from './Followers';
import Following from './Following';

/**
 *  Container to handle the state for the Follower and Following pages.
 *  Changes to the search form are store din the state, and a search request
 *  is received and sent to Redux for the particular page type.
 */
class FollowsContainer extends React.Component {
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
  handleSubmitFollowFind = page => {
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

    if (page === 'followers')
      getSearchFollow(author, searchFollowers, page);
    else
      getSearchFollow(author, searchFollowing, page);
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

    return (
      path === '/@:author/followers'
      ? (
        <Followers
          userLogged={userLogged}
          followers={followers}
          handleSubmitFollowFind={this.handleSubmitFollowFind}
          handleChangeFollowFind={this.handleChangeFollowFind}
          searchFollowers={searchFollowers}
          searchFollowLoading={searchFollowLoading}
        />

      )
      : (
        <Following
          userLogged={userLogged}
          following={following}
          handleSubmitFollowFind={this.handleSubmitFollowFind}
          handleChangeFollowFind={this.handleChangeFollowFind}
          searchFollowing={searchFollowing}
          searchFollowLoading={searchFollowLoading}
        />
      )
    )
  }
}


export default FollowsContainer;
