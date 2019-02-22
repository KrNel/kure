import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Loader } from "semantic-ui-react";

import PropTypes from 'prop-types';

import { getGroupsPage, requestToJoinGroup, logger } from '../../../utils/fetchFunctions';
import GroupSummary from './GroupSummary';
import './Groups.css';

//TODO: Show list of recent communities added. Option to sort by:
//New, Popular (Likes), Activity (Recent submissions), Rating

/**
 *  Community page component that displays a variety of data tailored around
 *  the community activity. From recently active, to popular, to newly created.
 */
class Groups extends Component {
  state = {
    areGroupsLoading: true,
    groupsActivity: [],
    groupRequested: '',
    go: true,
  }

  /**
   *  When going to Communities page from other pages, load componentDidMount
   *  with props set and fetch data.
   */
  componentDidMount() {
    const {user} = this.props;
    if (user) this.getGroups(user);
  }

  /**
   *  When Comommunities page is the first page, props aren't set yet, check
   *  props for user set and then fetch data. `go` is a flad to run only once
   *  on update check (else infinite loop)
   *
   *  @param {object} prevProps Previous props
   */
  componentDidUpdate(prevProps) {
    const {user} = this.props;
    if (user && this.state.go) {
      this.getGroups(user);
    }
  }

  /**
   *  Get the various community data to display on the page.
   *
   *  @param {string} user User logged in
   */
  getGroups = (user) => {
    const listLimit = 20;
    getGroupsPage(user, listLimit)
    .then(result => {
      if (result) {
        this.setState({
          areGroupsLoading: false,
          groupsActivity: result.data.groupsActivity,
          go: false
        });
      } else {
        this.setState({
          areGroupsLoading: false,
          go: false
        });
      }
    }).catch(err => {
      logger('error', err);
    });
  }

  /**
   *  When user requests to join a community, send the request to DB
   *  for processing.
   *
   *  @param {element} e Element onClick comes from
   *  @param {string} group Group being requested to join
   */
  onJoinGroup = (e, group) => {
    e.preventDefault();
    this.setState({
      groupRequested: group,
    });
    this.joinGroupRequest(group);
  }

  /**
   *  Send request to DB, return true to remove `Join` for group.
   *
   *  @param {string} group Group being requested to join
   */
  joinGroupRequest = (group) => {
    const {user, csrf} = this.props;
    requestToJoinGroup({group, user}, csrf)
    .then(result => {
      const {groupsActivity, groupRequested}= this.state;
      let gActivity = groupsActivity;
      if (result.data) {
        const newGroup = groupsActivity.map(g => {
          if (g.name === groupRequested) {
            return {
              ...g,
              access: {
                access: 100
              }
            }
          }
          return g;
        });
        gActivity = newGroup;
      }
      this.setState({
        groupsActivity: gActivity,
        groupRequested: '',
      });

    }).catch(err => {
      logger('error', err);
    });
  }

  render() {

    const {
      state: {
        areGroupsLoading,
        groupsActivity,
        groupRequested,
      },
      props: {
        isAuth,
      }
    } = this;

    return (
      areGroupsLoading
      ? <Loader />
      : (
        <GroupSummary
          isAuth={isAuth}
          groupsActivity={groupsActivity}
          groupRequested={groupRequested}
          onJoinGroup={this.onJoinGroup}
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
    isAuth
  }
}

export default connect(mapStateToProps)(Groups);
