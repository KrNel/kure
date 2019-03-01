import React from 'react';
import { Link } from 'react-router-dom';


const GroupsName = ({ name, display }) => (
  <Link
    to={`/group/${name}`}
  >
    {display}
  </Link>
)

export default GroupsName;
