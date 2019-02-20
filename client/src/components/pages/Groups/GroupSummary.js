import React from 'react';

import GroupsRecent from './GroupsRecent';

const GroupSummary = ({isAuth, groupsActivity, groupRequested}) => (
  <GroupsRecent
    isAuth={isAuth}
    groupsActivity={groupsActivity}
    groupRequested={groupRequested}
  />
)

export default GroupSummary;
