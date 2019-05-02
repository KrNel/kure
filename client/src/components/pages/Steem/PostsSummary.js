import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from "semantic-ui-react";

import './PostsSummary.css';
import AuthorCatgoryTime from './AuthorCatgoryTime';
import Thumbnail from './Thumbnail';
import PostActions from './PostActions';
import { extractContent } from './helpers/extractContent';
import TitleLink from './TitleLink';
import PostLink from './PostLink';
import { sumPayout } from '../../../utils/helpers';
import Resteemers from './Resteemers';

/**
 *  Root container for post summaries.
 *
 *  @param {array} posts All the posts fetched
 *  @param {array} nextPost Whether to skip the first post, dupe of prev last post
 *  @param {function} showModal Parent function to show the add post modal
 */
const PostsSummary = (props) => {

  const {
    posts,
    showModal,
    user,
    handleUpvote,
    upvotePayload,
    isFetching,
    handleResteem,
    page,
    pageOwner,
    resteemedPayload,
  } = props;

  let {
    nextPost,
  } = props;



  if (!posts.length && !isFetching) {
    return "No Posts";
  }else {
    return (
      posts.map((p, i) => {

        if (nextPost) {
					nextPost = false;
					return false;
				}

        const vp = upvotePayload.votedPosts.find(vp => vp.id === p.id);
        if (vp)
          p = vp;

        const extract = extractContent(p);
        const post = {...p, ...extract};

        const title = post.title;
        const author = post.author;
        const authorReputation = post.author_reputation;
        const desc = post.desc;
        const permlink = post.permlink;
        const category = post.category;
        const thumb = post.image_link;
        const created = `${post.created}Z`;
        const commentCount = post.children;
        const activeVotes = post.active_votes;

        const totalPayout = sumPayout(post);
        const totalRShares = post.active_votes.reduce((a, b) => a + parseFloat(b.rshares), 0);
        const ratio = totalRShares === 0 ? 0 : totalPayout / totalRShares;

        const pid = parseInt(post.id);

        const reblogged_by = post.reblogged_by;

        let isResteemed = false;
        let isResteemedByUser = false;

        if (page === 'blog') {
          isResteemed = pageOwner !== author
        }

        let resteemed = reblogged_by && !!reblogged_by.length
        ? <Resteemers rebloggedBy={reblogged_by} /> : null;

        if (isResteemed) {
          resteemed = (
            <div className='resteemers'>
              <Icon name='retweet' />
              {' resteemed'}
            </div>
          )
        }

        const key = p+i;

        return (
          <div key={key} className='postSummary'>
            { resteemed }
            <AuthorCatgoryTime
              author={author}
              authorReputation={authorReputation}
              category={category}
              created={created}
              permlink={permlink}
            />

            <div className="block">
              {
                (thumb)
                  ? (
                    <div className="thumbnail">
                      <PostLink
                        author={author}
                        category={category}
                        permlink={permlink}
                        text={<Thumbnail thumb={thumb} />}
                      />
                    </div>
                    )
                  : ''
              }
              <div className="summary-content" data-permlink={permlink}>
                <h4>
                  <TitleLink
                    title={title}
                    category={category}
                    author={author}
                    permlink={permlink}
                  />
                </h4>
                <div className='description'>
                  <p className='ellipsis'>
                    <PostLink
                      author={author}
                      category={category}
                      permlink={permlink}
                      text={desc}
                    />
                  </p>
                </div>
                <div className='post-actions'>
                  <PostActions
                    activeVotes={activeVotes}
                    commentCount={commentCount}
                    author={author}
                    category={category}
                    payoutValue={totalPayout}
                    permlink={permlink}
                    title={title}
                    showModal={showModal}
                    user={user}
                    handleUpvote={handleUpvote}
                    upvotePayload={upvotePayload}
                    ratio={ratio}
                    pid={pid}
                    image={thumb}
                    handleResteem={handleResteem}
                    isResteemedByUser={isResteemedByUser}
                    resteemedPayload={resteemedPayload}
                    pageOwner={pageOwner}
                  />
                </div>
              </div>
            </div>
            <hr className='summaryDivider' />

          </div>
        )
      })
    )
  }
}

PostsSummary.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object),
  showModal: PropTypes.func,
  user: PropTypes.string,
  handleUpvote: PropTypes.func,
  upvotePayload: PropTypes.shape(PropTypes.object.isRequired),
  isFetching: PropTypes.bool,
  handleResteem: PropTypes.func,
};

PostsSummary.defaultProps = {
  posts: [],
  showModal: () => {},
  user: '',
  handleUpvote: () => {},
  upvotePayload: {},
  isFetching: false,
  handleResteem: () => {},
};


export default PostsSummary;
