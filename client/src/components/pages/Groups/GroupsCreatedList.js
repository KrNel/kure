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
const GroupsCreated = ({ groups}) => {
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
              groups.map((g, i) => (
                <Table.Row key={g._id}>
                  <Table.Cell>
                    <GroupLink display={g.display} name={g.name} />
                  </Table.Cell>
                  <Table.Cell collapsing textAlign='center'>{g.posts}</Table.Cell>
                  <Table.Cell collapsing textAlign='center'>{g.users}</Table.Cell>
                  <Table.Cell collapsing textAlign='center'>{<ShortNowDate date={g.created} />}</Table.Cell>
                  <Table.Cell collapsing textAlign='center'><UserLink user={g.owner} /></Table.Cell>
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
