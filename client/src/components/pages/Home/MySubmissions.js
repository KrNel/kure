import React from 'react';
import { Header, Segment, Label } from "semantic-ui-react";
import { Link } from 'react-router-dom';

import DateFromNow from '../../Common/DateFromNow';

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
                <div className='left'>
                  <Link
                    to={p.st_category+'/@'+p.st_author+'/'+p.st_permlink}
                  >
                    {
                      // eslint-disable-next-line
                      (p.st_title.length > 14) //longer than 14 chars?
                        //eslint-disable-next-line
                        ? (/[^\u0000-\u007f]/.test(p.st_title)) //non latin?
                          ? p.st_title.substr(0,8) + " ..." //truncate non latin
                          : p.st_title.substr(0,14) + " ..." //truncate latin
                        : p.st_title //no truncate
                    }
                  </Link>
                </div>
                <div className='right meta'>
                  <DateFromNow date={p.created} />
                </div>
                <div className='clear' />
              </li>
            ))
            : (
              <li>
                <Link to='/kurate'>Kurate</Link>
                {' some posts.'}
              </li>
            )
        }
      </ul>
    </Segment>
  </Segment.Group>
)

export default MySubmissions;
