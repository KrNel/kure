import React from 'react';
import { Header, Segment, Label } from "semantic-ui-react";
import { Link } from 'react-router-dom';

import { short, standard } from '../../../utils/dateFormatting';
import TitleLink from '../Steem/TitleLink';

const MySubmissions = ({ isAuth, mySubs }) => (
  <Segment.Group className='box'>
    <Segment>
      <Label attached='top' className='head'>
        <Header as='h3'>My Submissions</Header>
      </Label>
      <ul className='custom-list'>
        {
          !isAuth
          ? <li>Must be logged in.</li>
          : mySubs.length
            ?
            mySubs.map(p => (
              <li key={p._id}>
                <div className='leftSidebarList ellipsis'>
                  <TitleLink
                    title={p.st_title}
                    category={p.st_category}
                    author={p.st_author}
                    permlink={p.st_permlink}
                  />
                </div>
                <div className='rightSidebarList meta' title={standard(p.created)}>
                  {short(p.created)}
                </div>
                <div className='clear' />
              </li>
            ))
            : (
              <li>
                <Link to='/steem'>Kurate</Link>
                {' some posts.'}
              </li>
            )
        }
      </ul>
    </Segment>
  </Segment.Group>
)

export default MySubmissions;
