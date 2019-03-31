import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 *  Creates the link for a community group.
 *
 *  @param {string} name Name of group for link building
 *  @param {string} display Display name of group for view
 *  @return {element} Span element containing formatted value
 */
const GroupsName = ({ name, display }) => (
  <Link
    to={`/groups/group/${name}`}
  >
    {display}
  </Link>
)

GroupsName.propTypes = {
  name: PropTypes.string,
  display: PropTypes.string,
};

GroupsName.defaultProps = {
  name: '',
  display: '',
};

export default GroupsName;
