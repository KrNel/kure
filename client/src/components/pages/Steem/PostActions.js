import React, { Component } from 'react';
import { Icon } from "semantic-ui-react";

import Vote from './Vote';

import './PostActions.css';

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
class PostActions extends Component {

  resteem = (e) => {
    e.preventDefault();
  }

  flag = (e) => {
    e.preventDefault();
  }

  render() {
    const {
      props: {
        activeVotes,
        commentCount,
        author,
        category,
        payoutValue,
        permlink,
        title,
        showModal,
        user,
        handleUpvote,
        upvotePayload,
        ratio,
        pid,
        image,
      },
    } = this;

    return (
      <React.Fragment>
        <ul className="meta">

          <Vote
            activeVotes={activeVotes}
            author={author}
            payoutValue={payoutValue}
            permlink={permlink}
            user={user}
            handleUpvote={handleUpvote}
            upvotePayload={upvotePayload}
            ratio={ratio}
            pid={pid}
          />

          <li className="item">
            <a href={`/${category}/@${author}/${permlink}#comments`}>
              <Icon name='comment outline' size='large' />
              <strong>{commentCount}</strong>
            </a>
          </li>

          <li className="item disabled">
            <a href="/resteem" onClick={(e) => this.resteem(e)} title="Resteem">
              <Icon name='retweet' size='large' />
            </a>
          </li>

          <li className="item disabled">
            <a href="/flag" onClick={(e) => this.flag(e)} title="Flag this post on Steem">
              <Icon name='flag outline' size='large' />
            </a>
          </li>

        </ul>

        <div className='right'>
          {
            user
            && (
              <a href="/group/add" onClick={(e) => showModal(e, 'addPost', {author, category, permlink, title, image})} title="Add to a community">
                <Icon name='plus circle' size='large' />
              </a>
            )
          }
        </div>
      </React.Fragment>
    )
  }
}

export default PostActions;
