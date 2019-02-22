import React from 'react';
import { Header, Table, Label } from "semantic-ui-react";
import { Link } from 'react-router-dom';
import moment from 'moment';

const GroupsCreated = ({ groupsCreated }) => {
  return (

    <React.Fragment>
      <Label size='large' color='blue'><Header>Newly Created</Header></Label>

      <Table striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Group</Table.HeaderCell>
            <Table.HeaderCell textAlign='center'>Posts</Table.HeaderCell>
            <Table.HeaderCell textAlign='center'>Users</Table.HeaderCell>
            <Table.HeaderCell textAlign='center'>Created</Table.HeaderCell>
            <Table.HeaderCell textAlign='center'>Owner</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {
            groupsCreated.map((g, i) => {
              return (
                <Table.Row key={g._id}>
                  <Table.Cell>{g.display}</Table.Cell>
                  <Table.Cell collapsing textAlign='center'>{g.posts}</Table.Cell>
                  <Table.Cell collapsing textAlign='center'>{g.users}</Table.Cell>
                  <Table.Cell collapsing textAlign='center'>{moment.utc(g.created).fromNow()}</Table.Cell>
                  <Table.Cell collapsing textAlign='center'>{g.owner}</Table.Cell>
                </Table.Row>
              )
            })
          }
        </Table.Body>
      </Table>
    </React.Fragment>
  )
}

export default GroupsCreated;
