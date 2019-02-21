import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Table, Icon, Dimmer, Loader, Header, Segment } from "semantic-ui-react";
import { Link } from 'react-router-dom';
import moment from 'moment';

const GroupManagePending = ({pending, handleApproval, approvingUser}) => (
  <React.Fragment>
    <div className='clear' />
    <Header className='noMarginTop'>Join Requests</Header>
    <div>
      {
        (pending.length)
        ? (
          <Table striped>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>User</Table.HeaderCell>
                <Table.HeaderCell textAlign='center'>When</Table.HeaderCell>
                <Table.HeaderCell textAlign='center'>Approve/Deny</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {
                pending.map(u => (
                  <Table.Row key={u._id}>
                    <Table.Cell>
                      <Link
                        to={'@'+u.user}
                      >
                        {u.user}
                      </Link>
                    </Table.Cell>
                    <Table.Cell collapsing textAlign='center'>{moment.utc(u.added_on).fromNow()}</Table.Cell>
                    <Table.Cell collapsing textAlign='center'>
                      {
                        (approvingUser === u.user)
                          ? <Dimmer inverted active><Loader /></Dimmer>
                          : ''
                      }
                      <a href={`/approve/${u.user}/`} onClick={e => handleApproval(e, u.user, 'approve')}><Icon name='plus' color='blue' /></a>
                      {' / '}
                      <a href={`/reject/${u.user}/`} onClick={e => handleApproval(e, u.user, 'reject')}><Icon name='delete' color='blue' /></a>

                    </Table.Cell>
                  </Table.Row>
                  )
                )
              }
            </Table.Body>
          </Table>
          )
        : <Segment>No requests to join.</Segment>
      }
    </div>
  </React.Fragment>
)

export default GroupManagePending;
