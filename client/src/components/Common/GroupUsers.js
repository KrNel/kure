import React from 'react';
import { Header, Icon, Table, Dimmer, Loader } from "semantic-ui-react";
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';

import {roles} from '../../settings';

const GroupUsers = ({users, showModal, deletingUser, user, access}) => (
  <React.Fragment>
    <Header>
      {`Members (${users.length})`}
    </Header>
    <Table striped>
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
                {
                  (access <= 0)
                  && (
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


export default GroupUsers;
