import React from 'react';
import PropTypes from 'prop-types';
import { Header, Segment, Label } from "semantic-ui-react";
import { Link } from 'react-router-dom';

import GroupLink from '../../kure/GroupLink';
import { ShortNowDate, standard } from '../../../utils/dateFormatting';

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
                <div className='leftSidebarList'>
                  <GroupLink display={c.display} name={c.group} />
                </div>
                <div className='rightSidebarList meta' title={standard(c.updated)}>
                  <ShortNowDate date={c.updated} />
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

MyCommunities.propTypes = {
  isAuth: PropTypes.bool,
  myComms: PropTypes.arrayOf(PropTypes.object),
};

MyCommunities.defaultProps = {
  isAuth: false,
  myComms: [],
};

export default MyCommunities;
