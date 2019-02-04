import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Table, Icon, Dimmer, Loader } from "semantic-ui-react";

import Settings from '../../../settings';

/**
 *  Table of user for the selected group.
 *
 *  Button icon for deleting a user.
 *
 *  @param {object} props - Component props
 *  @param {array} props.users - Users data to be mapped and displayed
 *  @param {function} props.showModal - Sets the modal to be shown or hidden
 *  @param {string} props.deletingUser - The user to be deleted
 *  @returns {Component} - Table of user data
 */
const GroupManageUsers = ({users, showModal, deletingUser}) => (
  <Grid.Column width={8}>
    <Table striped>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>User</Table.HeaderCell>
          <Table.HeaderCell textAlign='center'>Role</Table.HeaderCell>
          <Table.HeaderCell textAlign='center'>Remove</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {
          users.map((u, i) => {
            const access = Settings.kGroupsAccess[u.access]
            return (
              <Table.Row key={u._id}>
                <Table.Cell><a href={Settings.baseSteemURL+'@'+u.user}>{u.user}</a></Table.Cell>
                <Table.Cell collapsing textAlign='center'>{access}</Table.Cell>
                <Table.Cell collapsing textAlign='center'>
                  {
                    (deletingUser === u.user)
                      ? <Dimmer inverted active><Loader /></Dimmer>
                      : ''
                  }
                  {u.access !== 0 && <a href={`/users/delete/${u.user}/`} onClick={e => showModal(e, {user: u.user})}><Icon name='delete' color='blue' /></a>}
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
};

export default GroupManageUsers;
