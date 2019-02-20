import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Loader } from "semantic-ui-react";

//import PropTypes from 'prop-types';
//import moment from 'moment';

import { getGroupsPage, requestToJoinGroup, logger } from '../../../utils/fetchFunctions';
import GroupSummary from './GroupSummary';
import './Groups.css';

//Show list of recent communities added. Option to sort by:
// New, Popular (Likes), Activity (Recent submissions), Rating
//
class Groups extends Component {
  state = {
    /*groups: {
      list,
      activity,
    }
    */
    //groupsList: [],
    areGroupsLoading: true,
    groupsActivity: [],
    groupRequested: '',
    go: true,
  }

  componentDidMount() {
    //this.setState({areGroupsLoading: true});
    const {user} = this.props;
    if (user) this.getGroups(user);
  }
  componentDidUpdate(prevProps) {
    const {user} = this.props;
    if (user && this.state.go) {
      this.getGroups(user);
    }
  }

  getGroups = (user) => {
    const listLimit = 20;
    getGroupsPage(user, listLimit)
    .then(result => {
      if (result) {
        this.setState({
          //groupsList: result.groupsList,
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

  onJoinGroup = (e, group) => {
    e.preventDefault();
    this.setState({
      isRequestingJoin: true,
      groupRequested: group,
    });
    this.joinGroupRequest(group);
  }

  joinGroupRequest = (group) => {
    const {user, csrf} = this.props;
    requestToJoinGroup({group, user}, csrf)
    .then(result => {
      if (result.data) {
        this.setState({
          isRequestingJoin: false,
          /*groupsActivity: {
            ...groupsActivity,
            access['access']: 100,
          },*/
          groupRequested: '',
          //groupsActivity: result.data.groupsActivity,
        });
      }else {
        this.setState({
          isRequestingJoin: false,
          groupRequested: '',
        });
      }
    }).catch(err => {
      logger('error', err);
    });
  }

  render() {

    const {
      state: {
        //groupsList,
        areGroupsLoading,
        groupsActivity,
        groupRequested,
        //groupRequested
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
