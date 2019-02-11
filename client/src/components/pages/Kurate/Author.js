import React from 'react';
import Avatar from './Avatar';
import './Author.css';
import {BASE_STEEM_URL} from '../../../settings';

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
const Author = ({author, authorReputation, category, payoutValue, createdFromNow}) => (
  <ul className="info">
    <li className="item avatar"><Avatar author={author} /></li>
    <li className="item author" data-author={author}>
      {'\u00A0'}
      <strong>
        <a href={BASE_STEEM_URL+'/@'+author}>{author}</a>
      </strong>
      {`\u00A0(${authorReputation})`}
    </li>
    <li className="item tag">
      {'\u00A0in\u00A0'}
      <a href={BASE_STEEM_URL+'/'+category}>{category}</a>
    </li>
    <li className="item timeago">
      {`\u00A0\u2022\u00A0${createdFromNow}\u00A0\u00A0\u2022`}
    </li>
    <li className="item payout">{`\u00A0\u0024${payoutValue}`}</li>
  </ul>
)

export default Author;
