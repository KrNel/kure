import React from 'react';
import PropTypes from 'prop-types';
import { Header, Segment, Label } from "semantic-ui-react";
import { Link } from 'react-router-dom';

import { ShortNowDate, standard } from '../../../utils/dateFormatting';
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
            mySubs.map(post => (
              <li key={post._id}>
                <div className='leftSidebarList ellipsis'>
                  <TitleLink
                    title={post.st_title}
                    category={post.st_category}
                    author={post.st_author}
                    permlink={post.st_permlink}
                  />
                </div>
                <div className='rightSidebarList meta' title={standard(post.created)}>
                  <ShortNowDate date={post.created} />
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

MySubmissions.propTypes = {
  isAuth: PropTypes.bool,
  mySubs: PropTypes.arrayOf(PropTypes.object),
};

MySubmissions.defaultProps = {
  isAuth: false,
  mySubs: [],
};

export default MySubmissions;
