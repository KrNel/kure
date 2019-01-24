import React from 'react';
import { Grid, Segment, Icon, Table } from "semantic-ui-react";

import Settings from '../../../settings';

const GroupManageUsers = ({users}) => {
  //console.log('users: ', users)
  console.log('u: ', users);
  return (
    <Grid.Column width={8}>
        <Table striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>User</Table.HeaderCell>
              <Table.HeaderCell>Access</Table.HeaderCell>
              <Table.HeaderCell>Remove</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
          {
            users.map((u, i) => (
              <Table.Row key={i}>
                <Table.Cell><a href={Settings.baseSteemURL+'@'+u.user}>{u.user}</a></Table.Cell>
                <Table.Cell collapsing>{Settings.kGroupsAccess[u.access]}</Table.Cell>
                <Table.Cell collapsing textAlign='center'><a href='/'><Icon name='minus circle' color='blue' /></a></Table.Cell>
              </Table.Row>
            ))
          }
          </Table.Body>
        </Table>

    </Grid.Column>
  )
}

export default GroupManageUsers;
