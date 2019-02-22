import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Table, Icon, Dimmer, Loader, Header } from "semantic-ui-react";
import { Link } from 'react-router-dom';
import moment from 'moment';

import GroupManagePending from './GroupManagePending';
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

    <GroupManagePending
      pending={pending}
      handleApproval={handleApproval}
      approvingUser={approvingUser}
    />

    <div className='clear' />
    <Header>Membership</Header>

    <Table striped>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>User</Table.HeaderCell>
          <Table.HeaderCell textAlign='center'>Role</Table.HeaderCell>
          <Table.HeaderCell textAlign='center'>Joined</Table.HeaderCell>
          <Table.HeaderCell textAlign='center'>Posts</Table.HeaderCell>
          <Table.HeaderCell textAlign='center'>Remove</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {
          users.map((u, i) => {
            const role = roles.kGroupsRoles[u.access];
            return (
              <Table.Row key={i}>
                <Table.Cell>
                  <Link
                    to={'@'+u.user}
                  >
                    {u.user}
                  </Link>
                </Table.Cell>
                <Table.Cell collapsing textAlign='center'>{role}</Table.Cell>
                <Table.Cell collapsing textAlign='center'>
                  {moment.utc(u.added_on).fromNow()}
                </Table.Cell>
                <Table.Cell collapsing textAlign='center'></Table.Cell>
                <Table.Cell collapsing textAlign='center'>
                  {
                    (deletingUser === u.user)
                      ? <Dimmer inverted active><Loader /></Dimmer>
                      : ''
                  }
                  {
                    //if user listed is owner, deny deleted
                    //if user logged in is admin, allow delete
                    access < roles.kGroupsRolesRev['Moderator']
                    ? (u.access !== 0 && access < u.access)
                      ?
                        <a href={`/users/delete/${u.user}/`} onClick={e => showModal(e, {user: u.user})}><Icon name='delete' color='blue' /></a>
                      : ''
                    : ''

                  }
                </Table.Cell>
              </Table.Row>
            )
          })
        }
      </Table.Body>
    </Table>
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
