import React from 'react';
import {Grid, Segment, Label, Header} from "semantic-ui-react";

import GroupsRecent from './GroupsRecent';
import GroupsCreatedGrid from './GroupsCreatedGrid';
import GroupsCreatedList from './GroupsCreatedList';
import ToggleView from '../../kure/ToggleView';

/**
 *  All community display components are located here.
 *
 *  GroupRecent shows communities with recent activity in them.
 *
 *  @param {array} groups Data for groups
 */
const GroupSummary = (props) => {
  const {
    groups,
    match,
    showGrid,
    toggleView,
    tabSelected,
    tabView
  } = props;

  const newlyCreated =
    showGrid
    ? (
      <GroupsCreatedGrid
        groups={groups.groupsCreated}
        match={match}
      />
    )
    : (
      <GroupsCreatedList
        groups={groups.groupsCreated}
        match={match}
      />
    );

  let selectedTab = null;
  if (tabSelected === 'new') {
    selectedTab = newlyCreated;
  }else if (tabSelected === 'activity') {
    selectedTab = (
      <GroupsRecent
        groupsActivity={groups.groupsActivity}
      />
    );
  }

  let tabs = [
    {name: 'Recently Created', view: 'new'},
    {name: 'Recently Active', view: 'activity'}
  ];

  const tabViews = tabs.map(tab => {
    let classes = 'tabSelect';

    if (tabSelected === tab.view)
      classes += ' activeTab'

    return (
      <a key={tab.view} href={`/${tab.view}`} className={classes} onClick={event => tabView(event, tab.view)}>
        <Label size='big'>
          <Header as="h3">{tab.name}</Header>
        </Label>
      </a>
    )
  })

  if (groups.groupsActivity.length) {
    return (
      <Grid columns={1} stackable>
        <Grid.Column>
          <div className='newlyCreated'>
            <Grid.Row>
              <Grid.Column>
                {tabViews}
                <ToggleView
                  toggleView={toggleView}
                  showGrid={showGrid}
                />
                <div className='clear' />
              </Grid.Column>
            </Grid.Row>
            {selectedTab}
          </div>
        </Grid.Column>
      </Grid>
    )
  }else {
    return (
      <Segment>
        {'No communities.'}
      </Segment>
    )
  }
}

export default GroupSummary;
