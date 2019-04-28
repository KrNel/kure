import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Icon, Button, Popup, Loader, Dimmer } from "semantic-ui-react";

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
    onDeletePost: PropTypes.func,
    handleResteem: PropTypes.func,
    isResteemed: PropTypes.bool,
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
    onDeletePost: () => {},
    handleResteem: () => {},
    isResteemed: false,
  };


  resteem = (e) => {
    e.preventDefault();
    const { pid, author, permlink, handleResteem } = this.props;
    handleResteem(pid, author, permlink);
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
        onDeletePost,
        resteemedPayload,
        pageOwner,
      },
    } = this;

    let isResteemedByUser = null;
    if (resteemedPayload.pids.length && resteemedPayload.pids.indexOf(pid) > -1) {
      isResteemedByUser = true;
    }

    if (pageOwner === user && author !== user) {
      isResteemedByUser = true;
    }

    const disable = resteemedPayload.resteeming === pid;

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
          {
            user && user !== author && !isResteemedByUser && (
              <li className="item">
                <Popup
                  trigger={(
                    <span>
                      <a href="/resteem" onClick={e => e.preventDefault()} title="Resteem">
                        <Icon name='retweet' size='large' />
                      </a>
                    </span>
                  )}
                  position='top left'
                  flowing
                  hoverable
                  on='click'
                  disabled={disable}
                >
                  <Button
                    color='green'
                    content={`Confirm resteem. It can't be undone.`}
                    onClick={this.resteem}
                    disabled={disable}
                  />
                </Popup>
              </li>


            )
          }
          {
            user && (
              <li className="item disabled">
                <span>
                  <a href="/flag" onClick={(e) => this.flag(e)} title="Flag this post on Steem">
                    <Icon name='flag outline' size='large' />
                  </a>
                </span>
              </li>
            )
          }
        </ul>

        <div className='right'>
          {
            user
            && (
              <div>
                {
                  isPost && author === user && (
                    <React.Fragment>
                      <Button
                        animated='vertical'
                        color='blue'
                        onClick={e => onEditPost(e)}
                        title="Edit post"
                        className='actionEdit'
                      >
                        <Button.Content hidden>Edit</Button.Content>
                        <Button.Content visible>
                          <Icon name='edit' />
                        </Button.Content>
                      </Button>

                      {
                        !activeVotes.length && !commentCount && (
                          <Popup
                            trigger={(
                              <Button
                                animated='vertical'
                                color='blue'
                                title="Delete post"
                                className='actionDelete'
                              >
                                <Button.Content hidden>Del</Button.Content>
                                <Button.Content visible>
                                  <Icon name='remove' />
                                </Button.Content>
                              </Button>
                            )}
                            position='top left'
                            flowing
                            hoverable
                            on='click'
                          >
                            <Button
                              color='red'
                              content='Confirm delete.'
                              onClick={e => onDeletePost(e, author, permlink)}
                            />
                          </Popup>
                        )
                      }
                    </React.Fragment>
                  )
                }
                <Button
                  animated='vertical'
                  color='blue'
                  onClick={e => showModal(e, 'addPost', {author, category, permlink, title, image})}
                  title="Add to a community"
                  className='actionAdd'
                >
                  <Button.Content hidden>Add</Button.Content>
                  <Button.Content visible>
                    <Icon name='plus circle' />
                  </Button.Content>
                </Button>
              </div>
            )
          }
        </div>
        <div className='clear' />
      </React.Fragment>
    )
  }
}

export default PostActions;
