import React from 'react';
import PropTypes from 'prop-types';

import GroupsGrid from '../Manage/GroupsGrid';

/**
 *  Show the newly created groups as a table list.
 *
 *  @param {array} groups Data for newly created groups
 */
const GroupsCreatedGrid = ({ groups, match }) => (
  <GroupsGrid
    groups={groups}
    match={match}
  />
)

GroupsCreatedGrid.propTypes = {
  groups: PropTypes.arrayOf(PropTypes.object.isRequired),
  match: PropTypes.shape(PropTypes.object.isRequired),
};

GroupsCreatedGrid.defaultProps = {
  groups: [],
  match: {},
};

export default GroupsCreatedGrid;
