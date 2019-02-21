import React from 'react';
import './PostActions.css';
import { Icon } from "semantic-ui-react";

const vote = (e) => {
  e.preventDefault();
}

const comment = (e) => {
  e.preventDefault();
}

const resteem = (e) => {
  e.preventDefault();
}

const flag = (e) => {
  e.preventDefault();
}

/**
 *  Displays the data and actions for the posts.
 *  This includes likes, votes, comments, dislikes, flags and adding a post to
 *  a community.
 *
 *  @param {string} activeVotesCount Number of Steem upvotes
 *  @param {number} commentCount Number of comments
 *  @param {string} author Author of post
 *  @param {number} category Category of the post
 *  @param {string} permlink Steem permlink for post
 *  @param {string} title Post's title
 *  @param {function} showModal Parent function to show the add post modal
 */
const PostActions = ({activeVotesCount, commentCount, author, category, permlink, title, showModal, user}) => (
  <div>
    <ul className="meta disabled">
      <li className="item">
        <a href="/vote" onClick={(e) => vote(e)} title={`${activeVotesCount} upvotes on Steem`}>
          <Icon name='chevron up' size='large' />
        </a>
        <strong>{activeVotesCount}</strong>
      </li>
      <li className="item">
        <a href="/comment" onClick={(e) => comment(e)} title={`${commentCount} comments`}>
          <Icon name='comment outline' size='large' />
          <strong>{commentCount}</strong>
        </a>
      </li>
      <li className="item">
        <a href="/resteem" onClick={(e) => resteem(e)} title="Resteem">
          <Icon name='retweet' size='large' />
        </a>
      </li>
      <li className="item">
        <a href="/flag" onClick={(e) => flag(e)} title="Flag this post on Steem">
          <Icon name='flag outline' size='large' />
        </a>
      </li>
    </ul>
    <div className='right'>
      {
        (user)
        ? (
          <a href="/group/add" onClick={(e) => showModal(e, 'addPost', {author, category, permlink, title})} title="Add to a community">
            <Icon name='plus circle' size='large' />
          </a>
        )
        : ''
      }
    </div>
  </div>
)

export default PostActions;
