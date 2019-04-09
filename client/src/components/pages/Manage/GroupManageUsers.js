import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from "semantic-ui-react";

import GroupManagePending from './GroupManagePending';
import GroupUsers from '../../kure/GroupUsers'
import {roles} from '../../../settings';

/**
 *  Table of user for the selected group.
 *
 *  Shows the user name, access role and a remove button icon for deleting a user.
 *
 *  @param {object} props Component props
 *  @param {array} props.users Users data to be mapped and displayed
 *  @param {function} props.showModal Sets the modal to be shown or hidden
 *  @param {string} props.deletingUser The user to be deleted
 *  @param {string} props.access Access type for user logged in
 *  @param {array} props.pending Data for user's pending approval for group
 *  @param {function} props.handleApproval Handles approve/deny action
 *  @param {string} props.approvingUser User being approved
 *  @returns {Component} Table of user data
 */
const GroupManageUsers = ({users, showModal, deletingUser, access, pending, handleApproval, approvingUser}) => (
  <Grid.Column width={10}>
    {
    access <= roles.kGroupsRolesRev['Moderator']
    ? (
      <GroupManagePending
        pending={pending}
        handleApproval={handleApproval}
        approvingUser={approvingUser}
      />
    )
    : ''
    }
    <div className='clear' />

    <GroupUsers
      users={users}
      showModal={showModal}
      deletingUser={deletingUser}
      access={access}
    />
  </Grid.Column>
);

GroupManageUsers.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  showModal: PropTypes.func.isRequired,
  deletingUser: PropTypes.string.isRequired,
  access: PropTypes.number.isRequired,
  pending: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleApproval: PropTypes.func.isRequired,
  approvingUser: PropTypes.string.isRequired,
};

export default GroupManageUsers;
