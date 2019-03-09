import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Loading from '../../Loading/Loading';
import { getGroupsPage, logger } from '../../../utils/fetchFunctions';
import GroupSummary from './GroupSummary';
import './Groups.css';
import ErrorBoundary from '../../ErrorBoundary/ErrorBoundary';

//TODO: Show list of recent communities added. Option to sort by:
//New, Popular (Likes), Activity (Recent submissions), Rating

/**
 *  Community page component that displays a variety of data tailored around
 *  the community activity. From recently active, to popular, to newly created.
 */
class Groups extends Component {

  static propTypes = {
    user: PropTypes.string,
  };

  static defaultProps = {
    user: 'x',
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
        groups,
      }
    } = this;

    return (
      areGroupsLoading
        ? <Loading />
        : (
          <ErrorBoundary>
            <GroupSummary
              groups={groups}
            />
          </ErrorBoundary>
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
  const { user, isAuth } = state.auth;

  return {
    user,
    isAuth,
  }
}

export default connect(mapStateToProps)(Groups);
