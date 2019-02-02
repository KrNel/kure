import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Table } from "semantic-ui-react";

import Settings from '../../../settings';

const GroupManageUsers = ({users}) => (
  <Grid.Column width={8}>
    <Table striped>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>User</Table.HeaderCell>
          <Table.HeaderCell>Access</Table.HeaderCell>
          {/*<Table.HeaderCell>Remove</Table.HeaderCell>*/}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {
          users.map((u, i) => {
            const access = Settings.kGroupsAccess[u.access]
            return (
              <Table.Row key={i}>
                <Table.Cell><a href={Settings.baseSteemURL+'@'+u.user}>{u.user}</a></Table.Cell>
                <Table.Cell collapsing>{access}</Table.Cell>
                {/*<Table.Cell collapsing textAlign='center'><a href={`/delete/${u.user}/`}><Icon name='minus circle' color='blue' /></a></Table.Cell>*/}
              </Table.Row>
            )
          })
        }
      </Table.Body>
    </Table>
  </Grid.Column>
)

GroupManageUsers.propTypes = {
  users: PropTypes.array.isRequired,
};

export default GroupManageUsers;
