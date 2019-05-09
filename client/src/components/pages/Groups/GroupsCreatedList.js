import React from 'react';
import { Table } from "semantic-ui-react";

import GroupLink from '../../kure/GroupLink';
import UserLink from '../Steem/UserLink';
import { ShortNowDate } from '../../../utils/dateFormatting';

/**
 *  Show the newly created groups as a table list.
 *
 *  @param {array} groups Data for newly created groups
 */
const GroupsCreated = ({ groups }) => {
  if (groups.length) {
    return (
      <React.Fragment>
        <Table striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Community</Table.HeaderCell>
              <Table.HeaderCell textAlign='center'>Posts</Table.HeaderCell>
              <Table.HeaderCell textAlign='center'>Users</Table.HeaderCell>
              <Table.HeaderCell textAlign='center'>Created</Table.HeaderCell>
              <Table.HeaderCell textAlign='center'>Owner</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {
              groups.map(group => (
                <Table.Row key={group._id}>
                  <Table.Cell>
                    <GroupLink display={group.display} name={group.name} />
                  </Table.Cell>
                  <Table.Cell collapsing textAlign='center'>{group.posts}</Table.Cell>
                  <Table.Cell collapsing textAlign='center'>{group.users}</Table.Cell>
                  <Table.Cell collapsing textAlign='center'>{<ShortNowDate date={group.created} />}</Table.Cell>
                  <Table.Cell collapsing textAlign='center'><UserLink user={group.owner} /></Table.Cell>
                </Table.Row>
              ))
            }
          </Table.Body>
        </Table>
      </React.Fragment>
    )
  }
}

export default GroupsCreated;
