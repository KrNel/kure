import React, { Component } from 'react';
import PropTypes from 'prop-types'
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

  static propTypes = {
    activeVotes: PropTypes.arrayOf(PropTypes.object),
    commentCount: PropTypes.number,
    author: PropTypes.string,
    category: PropTypes.string,
    payoutValue: PropTypes.number,
    permlink: PropTypes.string,
    title: PropTypes.string,
    showModal: PropTypes.func,
    user: PropTypes.string,
    handleUpvote: PropTypes.func,
    upvotePayload: PropTypes.shape(PropTypes.object.isRequired),
    ratio: PropTypes.number,
    pid: PropTypes.number,
    image: PropTypes.string,
    isPost: PropTypes.bool,
    onEditPost: PropTypes.func,
  };

  static defaultProps = {
    activeVotes: [],
    commentCount: '',
    author: '',
    category: '',
    payoutValue: '',
    permlink: '',
    title: '',
    showModal: () => {},
    user: '',
    handleUpvote: () => {},
    upvotePayload: {},
    ratio: '',
    pid: '',
    image: '',
    isPost: false,
    onEditPost: () => {},
  };


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
        isPost,
        onEditPost,
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
            <span>
              <a href={`/${category}/@${author}/${permlink}#comments`}>
                <Icon name='comment outline' size='large' />
                {` ${commentCount}`}
              </a>
            </span>
          </li>

          <li className="item disabled">
            <span>
              <a href="/resteem" onClick={(e) => this.resteem(e)} title="Resteem">
                <Icon name='retweet' size='large' />
              </a>
            </span>
          </li>

          <li className="item disabled">
            <span>
              <a href="/flag" onClick={(e) => this.flag(e)} title="Flag this post on Steem">
                <Icon name='flag outline' size='large' />
              </a>
            </span>
          </li>

        </ul>

        <div className='right'>
          {
            user
            && (
              <React.Fragment>
                {
                  isPost && author === user && (
                    <span>
                      <a href="/post/edit" onClick={e => onEditPost(e)} title="Edit post">
                        <Icon name='compose' size='large' />
                      </a>
                      {` `}
                    </span>
                  )
                }
                <a href="/group/add" onClick={e => showModal(e, 'addPost', {author, category, permlink, title, image})} title="Add to a community">
                  <Icon name='plus circle' size='large' />
                </a>
              </React.Fragment>
            )
          }
        </div>
      </React.Fragment>
    )
  }
}

export default PostActions;
