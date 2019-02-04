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
 *  @param {object} props - Component props
 *  @param {array} props.groups - Array of obejcts for each group to view
 *  @param {bool} props.areGroupsLoading - Determines if loading spinner shown
 *  @param {function} props.handleManageGroup - Call parent function to maange a group
 *  @param {bool} props.noOwned - Determines if there are no Owned groups to show
 *  @param {bool} props.isGroupLoading - Determines if loading spinner shown for that group
 *  @param {bool} props.selectedGroup - Selected group will have spinner if loading data
 *  @param {function} props.showModal - Sets the modal to be shown or hidden
 *  @returns {Component} - A list of group components is rendered
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
  } = props;

  if (areGroupsLoading) {
    return <Loading />;
  }else {
    if (groups && groups.length && !noOwned) {
      return (
        <Grid.Row className="content">
          <Grid.Column>
            <Grid stackable>
              {
              groups.map((g, i) => {
                const date = moment(g.created).format("YYYY-MM-DD");
                return (
                  <Grid.Column key={g._id} width={4}>
                    <Segment key={g._id} className='groupList'>
                      {
                        (selectedGroup === g.name)
                          ? <Dimmer inverted active={isGroupLoading}><Loader /></Dimmer>
                          : ''
                      }
                      <div key={g._id}>
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
                          <a
                            href={'/group/delete/'+g.name}
                            onClick={e => showModal(e, {group: g.name})}
                            title="Delete group"
                          >
                            <Icon name='delete' color='blue' />
                          </a>
                        </div>
                        <div className='clear' />
                        <Divider />
                        <div>
                          {`Created: ${date}`}
                        </div>
                        {/*<div>
                          {'Posts: '}
                          {g.posts}
                        </div>*/}
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
      return (
        <Grid.Column width={8}>
          <Segment>
            <p>
              {"You don't own any community groups."}
              <br />
              {"You can create up to 4 community groups."}
            </p>
          </Segment>
        </Grid.Column>
      )
    }
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
};

export default GroupsList;
