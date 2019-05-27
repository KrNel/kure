import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid } from "semantic-ui-react";
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import ManageGroups from './ManageGroups';
import ErrorBoundary from '../../ErrorBoundary/ErrorBoundary';
import { getUserGroups, logger } from '../../../utils/fetchFunctions';
import './Manage.css';
import defaultImage from '../../../images/steemkure-600.png';

/**
 *  The root manangement page for community groups, posts and users.
 *
 *  Loads the two Communiy Group list types: Owned and Joined.
 *  The logged in user name and CSRF token are passed to each.
 *
 *  @param {object} props Component props
 *  @param {string} props.user User name to use in Manage page
 *  @param {string} props.csrf CSRF token to prevent CSRF attacks
 *  @returns {Component} Loads various components to manage community groups
 */
class Manage extends Component {

  static propTypes = {
    user: PropTypes.string.isRequired,
    csrf: PropTypes.string.isRequired,
    match: PropTypes.shape(PropTypes.object.isRequired).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      groupsOwned: [],
      groupsJoined: [],
      areGroupsLoading: true,
    }
  }

  /**
   *  Fetch the group data for the user.
   */
  componentDidMount() {
    const { user } = this.props;
    this.getGroupsFetch(user);
  }

  /**
   *  Get the groups from the database and split into owned or joined groups.
   *  Set groups state, and reset loading flag.
   *
   *  @param {string} user logged in user name
   */
  getGroupsFetch = (user) => {
    getUserGroups(user, 'all')
    .then(res => {
      let groupsOwned = [];
      let groupsJoined = [];

      res.data.groups.map(group => {
        if (group.access === 0) {
          groupsOwned.push(group);
        }else {
          groupsJoined.push(group);
        }
        return group;
      })

      this.setState({
        groupsOwned,
        groupsJoined,
        areGroupsLoading: false,
     });
    }).catch(err => {
      logger('error', err);
    });
  }

  /**
   *  When a community is transfered to a new owner, get the data again to
   *  display the community in the proper section (from owned to joined).
   */
  onChangeOwnership = () => {
    const { user } = this.props;
    this.getGroupsFetch(user);
  }

  render() {
    const {
      user,
      csrf,
      match
    } = this.props;

    const {
      groupsOwned,
      groupsJoined,
      areGroupsLoading
    } = this.state;

    const metaUrl = `https://thekure.net/manage`;
    const pageTitle = `Managing ${user}'s Communities`;
    const desc = 'Manage the communities you own or have joined.';
    const metaTitle = `${pageTitle} - KURE`;
    const ampUrl = `manage/amp`;
    const image = `https://thekure.net${defaultImage}`;

    return (
      <React.Fragment>
        <Helmet>
          <title>{pageTitle}</title>
          <link rel="canonical" href={metaUrl} />
          <link rel="amphtml" href={ampUrl} />
          <meta property="description" content={desc} />
          <meta property="og:title" content={metaTitle} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={metaUrl} />
          <meta property="og:image" content={image} />
          <meta property="og:description" content={desc} />
          <meta property="og:site_name" content="KURE" />
        </Helmet>
        <ErrorBoundary>
          <div className="manage">
            <Grid columns={1} stackable>
              <Grid.Column width={16} className="main">
                <Grid>

                  <ManageGroups
                    user={user}
                    csrf={csrf}
                    section='owned'
                    headerText='Communities You Own'
                    match={match}
                    areGroupsLoading={areGroupsLoading}
                    groups={groupsOwned}
                    onChangeOwnership={this.onChangeOwnership}
                  />

                  <ManageGroups
                    user={user}
                    csrf={csrf}
                    section='joined'
                    headerText='Communities You Joined'
                    match={match}
                    areGroupsLoading={areGroupsLoading}
                    groups={groupsJoined}
                    onChangeOwnership={this.onChangeOwnership}
                  />

                </Grid>
              </Grid.Column>
            </Grid>
          </div>
        </ErrorBoundary>
      </React.Fragment>

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
  const { user, csrf } = state.auth;

  return {
    user,
    csrf
  }
}

export default connect(mapStateToProps)(Manage);
