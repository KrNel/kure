import React from 'react';
import PropTypes from 'prop-types';
import { Table, Icon, Dimmer, Loader, Header, Segment } from "semantic-ui-react";
import { Link } from 'react-router-dom';
import moment from 'moment';

/**
 *  Table of user pending approval for community group.
 *
 *  Shows the user name, when they requested to join, and a button icon for
 *  approval or denial of request to join.
 *
 *  @param {array} props.pending Data for user's pending approval for group
 *  @param {function} props.handleApproval Handles approve/deny action
 *  @param {string} props.approvingUser User being approved
 *  @returns {Component} Table of user data
 */
const GroupManagePending = ({pending, handleApproval, approvingUser}) => (
  <React.Fragment>
    <div className='clear' />
    <Header className='noMarginTop'>
      {`Join Requests (${pending.length})`}
    </Header>
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
                pending.map(user => (
                  <Table.Row key={user._id}>
                    <Table.Cell>
                      <Link
                        to={'@'+user.user}
                      >
                        {user.user}
                      </Link>
                    </Table.Cell>
                    <Table.Cell collapsing textAlign='center'>{moment.utc(user.added_on).fromNow()}</Table.Cell>
                    <Table.Cell collapsing textAlign='center'>
                      {
                        (approvingUser === user.user)
                          ? <Dimmer inverted active><Loader /></Dimmer>
                          : ''
                      }
                      <a href={`/approve/${user.user}/`} onClick={event => handleApproval(event, user.user, 'approve')}><Icon name='plus' color='green' /></a>
                      {' / '}
                      <a href={`/deny/${user.user}/`} onClick={event => handleApproval(event, user.user, 'deny')}><Icon name='delete' color='red' /></a>
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

GroupManagePending.propTypes = {
  pending: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleApproval: PropTypes.func.isRequired,
  approvingUser: PropTypes.string.isRequired,
};

export default GroupManagePending;
