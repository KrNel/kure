import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment, Icon, Loader, Dimmer, Divider } from "semantic-ui-react";

import Loading from '../../Loading/Loading';
import GroupLink from '../../kure/GroupLink';
import { long, standard } from '../../../utils/dateFormatting';

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
            groups.map((g, i) => {
              const key = g._id || i;
              const date = standard(g.created);
              return (
                <Grid.Column key={key+1} width={4}>
                  <Segment key={key+2} className='groupList'>
                    {
                      (selectedGroup === g.name)
                      && <Dimmer inverted active={isGroupLoading}><Loader /></Dimmer>
                    }
                    <div key={key+3}>
                      <h3 className='left'>
                        <GroupLink display={g.display} name={g.name} />
                      </h3>
                      {
                        match.path === '/manage' && (
                        <div className='right'>
                          <a
                            href={'edit/'+g.name}
                            onClick={e => handleManageGroup(e, g.name)}
                            title="Manage group"
                          >
                            <Icon name='edit' color='blue' />
                          </a>
                          {
                            section === 'owned' &&
                            (
                              <a
                                href={'/group/delete/'+g.name}
                                onClick={e => showModal(e, {group: g.name})}
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
                        {g.posts}
                        {g.posts === 0 || g.posts > 1 ? ' posts' : ' post'}
                      </div>
                      <div className='meta'>
                        <Icon name='user outline' color='blue' />
                        {g.users}
                        {g.users === 0 || g.users > 1 ? ' users' : ' user'}
                      </div>
                      <div className='meta'>
                        <Icon name='street view' color='blue' />
                        {g.joinRequests}
                        {g.joinRequests === 0 || g.joinRequests > 1 ? ' join requests' : ' join request'}
                      </div>
                      <br />
                      <div title={date} className='meta'>
                        <Icon name='sync alternate' color='blue' />
                        {`Updated ${long(g.updated)}`}
                      </div>
                      <div title={date} className='meta'>
                        <Icon name='calendar alternate outline' color='blue' />
                        {`Created ${long(g.created)}`}
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
