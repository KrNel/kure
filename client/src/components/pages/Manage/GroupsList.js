import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment, Icon, Loader, Dimmer, Divider } from "semantic-ui-react";
import moment from 'moment';

import Loading from '../../Loading/Loading';

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
 *  @param {bool} props.noOwned Determines if there are no Owned groups
 *  @param {bool} props.isGroupLoading Determines if to show loading spinner
 *  @param {bool} props.selectedGroup Selected group will have spinner
 *  @param {function} props.showModal Sets the modal to be shown or hidden
 *  @returns {Component} A list of group components is rendered
 */
const GroupsList = (props) => {

  const {
    groups,
    handleManageGroup,
    areGroupsLoading,
    noOwned,
    isGroupLoading,
    selectedGroup,
    showModal,
    type,
  } = props;

  if (areGroupsLoading) {
    return <Loading />;
  }else if (groups && groups.length && !noOwned) {
    return (
      <Grid.Row className="content">
        <Grid.Column>
          <Grid stackable>
            {
            groups.map((g, i) => {
              const key = g._id || i;
              const date = moment(g.created).format("ddd MMM DD, YYYY");
              return (
                <Grid.Column key={key+1} width={4}>
                  <Segment key={key+2} className='groupList'>
                    {
                      (selectedGroup === g.name)
                        ? <Dimmer inverted active={isGroupLoading}><Loader /></Dimmer>
                        : ''
                    }
                    <div key={key+3}>
                      <h3 className='left'>
                        <a
                          href={'edit/'+g.name}
                          onClick={e => handleManageGroup(e, g.name)}
                          title="Manage group"
                        >
                          {g.display}
                        </a>
                      </h3>
                      <div className='right'>
                        <a
                          href={'edit/'+g.name}
                          onClick={e => handleManageGroup(e, g.name)}
                          title="Manage group"
                        >
                          <Icon name='edit' color='blue' />
                        </a>
                        {
                          type === 'owned' &&
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
                      <div className='clear' />
                      <Divider className='header' />
                      <div>
                        {`Created: ${date}`}
                      </div>
                      <div>
                        {'Posts: '}
                        {g.posts}
                      </div>
                      {/*<div>Followers: {g.followers}</div>*/}
                      {/*<div>Likes: {g.likes}</div>*/}
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
    const message = (type === 'owned')
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

GroupsList.propTypes = {
  groups: PropTypes.arrayOf(PropTypes.object).isRequired,
  areGroupsLoading: PropTypes.bool.isRequired,
  handleManageGroup: PropTypes.func.isRequired,
  noOwned: PropTypes.bool.isRequired,
  isGroupLoading: PropTypes.bool.isRequired,
  selectedGroup: PropTypes.string.isRequired,
  showModal: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

export default GroupsList;
