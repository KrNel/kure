import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment, Icon, Loader, Dimmer, Divider } from "semantic-ui-react";

import Loading from '../../Loading/Loading';
import GroupLink from '../../kure/GroupLink';
import { LongNowDate, standard } from '../../../utils/dateFormatting';

/**
 *  Display the community groups for a user to manage or delete.
 *
 *  User will see current and new groups added shown here.
 *  User has the option of editing/managing a group, or deleting it.
 *
 *  @param {object} props Component props
 *  @param {array} props.groups Array of obejcts for each group to view
 *  @param {bool} props.areGroupsLoading Determines if loading spinner shown
 *  @param {function} props.handleManageGroup Parent function to manage group
 *  @param {bool} props.isGroupLoading Determines if to show loading spinner
 *  @param {bool} props.selectedGroup Selected group will have spinner
 *  @param {function} props.showModal Sets the modal to be shown or hidden
 *  @returns {Component} A list of group components is rendered
 */
const GroupsGrid = (props) => {

  const {
    groups,
    handleManageGroup,
    areGroupsLoading,
    isGroupLoading,
    selectedGroup,
    showModal,
    section,
    match,
  } = props;

  if (areGroupsLoading) {
    return <Loading />;
  }else if (groups && groups.length) {
    return (
      <Grid.Row className="content">
        <Grid.Column>
          <Grid stackable>
            {
            groups.map((group, index) => {
              const key = group._id || index;

              const {
                users,
                posts,
                name,
                display,
                joinRequests,
                updated,
                created,
              } = group;

              const date = standard(created);

              return (
                <Grid.Column key={key} width={4}>
                  <Segment className='groupList'>
                    {
                      (selectedGroup === name)
                      && <Dimmer inverted active={isGroupLoading}><Loader /></Dimmer>
                    }
                    <div>
                      <h3 className='left'>
                        <GroupLink display={display} name={name} />
                      </h3>
                      {
                        match.path === '/manage' && (
                        <div className='right'>
                          <a
                            href={'edit/'+name}
                            onClick={event => handleManageGroup(event, name)}
                            title="Manage group"
                          >
                            <Icon name='edit' color='blue' />
                          </a>
                          {
                            section === 'owned' &&
                            (
                              <a
                                href={'/group/delete/'+name}
                                onClick={event => showModal(event, {group: name})}
                                title="Delete group"
                              >
                                <Icon name='delete' color='blue' />
                              </a>
                            )
                          }
                        </div>
                        )
                      }
                      <div className='clear' />

                      <Divider className='header' />

                      <div className='meta'>
                        <Icon name='newspaper outline' color='blue' />
                        {posts}
                        {posts === 0 || posts > 1 ? ' posts' : ' post'}
                      </div>
                      <div className='meta'>
                        <Icon name='user outline' color='blue' />
                        {users}
                        {users === 0 || users > 1 ? ' users' : ' user'}
                      </div>
                      <div className='meta'>
                        <Icon name='street view' color='blue' />
                        {joinRequests}
                        {joinRequests === 0 || joinRequests > 1 ? ' join requests' : ' join request'}
                      </div>
                      <br />
                      <div title={date} className='meta'>
                        <Icon name='sync alternate' color='blue' />
                        {'Updated '}
                        <LongNowDate date={updated} />
                      </div>
                      <div title={date} className='meta'>
                        <Icon name='calendar alternate outline' color='blue' />
                        {'Created '}
                        <LongNowDate date={created} />
                      </div>
                    </div>
                  </Segment>
                </Grid.Column>
              )
            })
          }
          </Grid>
        </Grid.Column>
      </Grid.Row>
    )
  }else {
    const message = (section === 'owned')
      ? ("You don't own any community groups. You can create up to 4 community groups.")
      : ("You don't belong to any other communities.")
    return (
      <Grid.Column width={8}>
        <Segment>
          <p>
            {message}
          </p>
        </Segment>
      </Grid.Column>
    )
  }
}

GroupsGrid.propTypes = {
  groups: PropTypes.arrayOf(PropTypes.object.isRequired),
  areGroupsLoading: PropTypes.bool,
  handleManageGroup: PropTypes.func,
  isGroupLoading: PropTypes.bool,
  selectedGroup: PropTypes.string,
  showModal: PropTypes.func,
  section: PropTypes.string,
};

GroupsGrid.defaultProps = {
  groups: [],
  areGroupsLoading: false,
  handleManageGroup: () => {},
  isGroupLoading: false,
  selectedGroup: '',
  showModal: () => {},
  section: '',
};

export default GroupsGrid;
