import React from 'react';
import { Header, Segment, Label } from "semantic-ui-react";
import { Link } from 'react-router-dom';

import GroupLink from '../../common/GroupLink';
import {short} from '../../../utils/timeFromNow';

const MyCommunities = ({ isAuth, myComms }) => (
  <Segment.Group className='box'>
    <Segment>
      <Label attached='top' className='head'>
        <Header as='h3'>My Communities</Header>
      </Label>
      <ul className='custom-list'>
        {
          !isAuth
          ? <li>Must be logged in.</li>
          : myComms.length
            ?
            myComms.map(c => (
              <li key={c._id}>
                <div className='left'>
                  <GroupLink display={c.display} name={c.group} />
                </div>
                <div className='right meta'>
                  {short(c.updated)}
                </div>
                <div className='clear' />
              </li>
            ))
            : (
              <li>
                <Link to='/Manage'>Create</Link>
                {' a community.'}
              </li>
            )
        }
      </ul>
    </Segment>
  </Segment.Group>
)

export default MyCommunities;
