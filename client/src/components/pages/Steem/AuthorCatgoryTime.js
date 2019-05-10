import React from 'react';
import PropTypes from 'prop-types';

import Avatar from './Avatar';
import AuthorReputation from './AuthorReputation';
import Category from './Category';
import PostLink from './PostLink';
import { LongNowDate, standard } from '../../../utils/dateFormatting';

import './AuthorCatgoryTime.css';

/**
 *  Displays the author info and some post info as well.
 *  Author name, reputation, category, posted time and payout value.
 *
 *  @param {string} author Author of post
 *  @param {number} authorReputation Author's repuation
 *  @param {string} category Category posted in
 *  @param {number} payoutValue Post payout value
 *  @param {string} createdFromNow Time since post was created
 */
const AuthorCatgoryTime = ({ author, authorReputation, category, created, permlink }) => {
  return (
    <div className='authorCatTime'>
      <ul className="info">
        <li className="item avatar"><Avatar author={author} height='30px' width='30px' /></li>
        <li className="item author" data-author={author}>
          {'\u00A0'}
          <AuthorReputation author={author} reputation={authorReputation} />
        </li>
        <li className="item tag">
          {'\u00A0in\u00A0'}
          <Category category={category} />
        </li>
        <li className="item timeago">
          {`\u00A0\u2022\u00A0`}
          <PostLink
            author={author}
            category={category}
            permlink={permlink}
            title={standard(created)}
            text={<LongNowDate date={created} />}
          />
        </li>
      </ul>
    </div>
  )
}

AuthorCatgoryTime.propTypes = {
  author: PropTypes.string,
  authorReputation: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  category: PropTypes.string,
  created: PropTypes.string,
  permlink: PropTypes.string,
};

AuthorCatgoryTime.defaultProps = {
  author: '',
  authorReputation: '',
  category: '',
  created: '',
  permlink: '',
};

export default AuthorCatgoryTime;
