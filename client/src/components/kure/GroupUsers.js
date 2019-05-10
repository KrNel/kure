import React from 'react';
import { Header, Icon, Table, Dimmer, Loader } from "semantic-ui-react";
import PropTypes from 'prop-types';
import moment from 'moment';

import {roles} from '../../settings';
import UserLink from '../pages/Steem/UserLink';

/**
 *  Displays the users' data that belong to a commmunity group. Access rank/role
 *  is also displayed as a string based on the access number. The access
 *  determines if the Delete option appears to allow deleting a user.
 */
const GroupUsers = ({users, showModal, deletingUser, user, access}) => (
  <React.Fragment>
    <Header>
      {`Members (${users.length})`}
    </Header>
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>User</Table.HeaderCell>
          <Table.HeaderCell textAlign='center'>Role</Table.HeaderCell>
          <Table.HeaderCell textAlign='center'>Joined</Table.HeaderCell>
          {
            access < roles.kGroupsRolesRev['Moderator']
            && (<Table.HeaderCell textAlign='center'>Remove</Table.HeaderCell>)
          }
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {
          users.map(user => {
            const role = roles.kGroupsRoles[user.access];
            return (
              <Table.Row key={user._id}>
                <Table.Cell>
                  <UserLink user={user.user} />
                </Table.Cell>
                <Table.Cell collapsing textAlign='center'>{role}</Table.Cell>
                <Table.Cell collapsing textAlign='center'>
                  {moment.utc(user.added_on).fromNow()}
                </Table.Cell>
                {
                  (access <= 0)
                  && (
                    <Table.Cell collapsing textAlign='center'>
                      {
                        (deletingUser === user.user)
                          ? <Dimmer inverted active><Loader /></Dimmer>
                          : ''
                      }
                      {
                        //if user listed is owner, deny deleted
                        //if user logged in is admin, allow delete
                        access < roles.kGroupsRolesRev['Moderator']
                        ? (user.access !== 0 && access < user.access)
                          ?
                            <a href={`/users/delete/${user.user}/`} onClick={event => showModal(event, {user: user.user})}><Icon name='delete' color='red' /></a>
                          : ''
                        : ''
                      }
                    </Table.Cell>
                  )
                }
              </Table.Row>
            )
          }
        )
      }
      </Table.Body>
    </Table>
  </React.Fragment>
)

GroupUsers.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object),
  showModal: PropTypes.func,
  deletingUser: PropTypes.string,
  user: PropTypes.string,
  access: PropTypes.number,
};

GroupUsers.defaultProps = {
  users: [],
  deletingUser: '',
  user: '',
  showModal: () => {},
  access: 99,
};

export default GroupUsers;
