import React from 'react';

import GroupsRecent from './GroupsRecent';

const GroupSummary = ({isAuth, groupsActivity, groupRequested, onJoinGroup}) => (
  <GroupsRecent
    isAuth={isAuth}
    groupsActivity={groupsActivity}
    groupRequested={groupRequested}
    onJoinGroup={onJoinGroup}
  />
)

export default GroupSummary;
