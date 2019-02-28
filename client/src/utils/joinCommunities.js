import React from 'react';
import { Loader, Dimmer } from "semantic-ui-react";

import {roles} from '../settings';

const joinCommunities = (isAuth, groupRequested, gname, gaccess, onJoinGroup) => {
  if  (isAuth) {
    if (groupRequested === gname) {
      return <Dimmer inverted active><Loader /></Dimmer>;
    }else if (gaccess && gaccess.access !== 100) {
      return roles.kGroupsRoles[gaccess.access];
    }else if (gaccess && gaccess.access === 100) {
      return 'Requested';
    }else {
      return (
        <a
          href={`/join/${gname}`}
          onClick={e => onJoinGroup(e, gname)}
        >
          {'Join'}
        </a>
      )
    }
  }else return '';
}

export default joinCommunities;
