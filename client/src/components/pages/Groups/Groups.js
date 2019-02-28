import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Loader } from "semantic-ui-react";

import PropTypes from 'prop-types';

import { getGroupsPage, logger } from '../../../utils/fetchFunctions';
import GroupSummary from './GroupSummary';
import GroupDetails from './GroupDetails';
import './Groups.css';

//TODO: Show list of recent communities added. Option to sort by:
//New, Popular (Likes), Activity (Recent submissions), Rating

/**
 *  Community page component that displays a variety of data tailored around
 *  the community activity. From recently active, to popular, to newly created.
 */
class Groups extends Component {

  static propTypes = {
    user: PropTypes.string,
    csrf: PropTypes.string,
  };

  static defaultProps = {
    user: 'x',
    csrf: '',
  };

  state = {
    areGroupsLoading: true,
    groups: {},
  }

  /**
   *  When going to Communities page from other pages, load componentDidMount
   *  with props set and fetch data.
   */
  componentDidMount() {
    const {
      user
    } = this.props;

    this.getGroups(user);
  }

  /**
   *  When Comommunities page is the first page, props aren't set yet, check
   *  props for user set and then fetch data. `go` is a flad to run only once
   *  on update check (else infinite loop)
   *
   *  @param {object} prevProps Previous props
   */
  /*componentDidUpdate(prevProps) {
    const {user} = this.props;
    if (this.state.go) {
      this.getGroups(user, '2');
    }
  }*/

  /**
   *  Get the various community data to display on the page.
   *
   *  @param {string} user User logged in
   */
  getGroups = (user) => {
    if (user === '') user = 'x';
    getGroupsPage(user)
    .then(result => {
      this.setState({
        areGroupsLoading: false,
        groups: result.data,
      });
    }).catch(err => {
      logger('error', err);
    });
  }

  render() {

    const {
      state: {
        areGroupsLoading,
        groupRequested,
        groups,
      },
      props: {
        user,
        match: {
          path,
          params,
        },
        isAuth,
        csrf,
      }
    } = this;

    return (
      (path === '/groups')
      ? areGroupsLoading
        ? <Loader />
        : (
          <GroupSummary
            groupRequested={groupRequested}
            onJoinGroup={this.onJoinGroup}
            groups={groups}
          />
        )
      : (
        <GroupDetails
          params={params}
          user={user}
          isAuth={isAuth}
          csrf={csrf}
        />
      )
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
  const { userData, csrf, isAuth } = state.auth;

  return {
    user: userData.name,
    csrf,
    isAuth,
  }
}

export default connect(mapStateToProps)(Groups);
