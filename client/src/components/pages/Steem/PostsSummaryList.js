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
*  Post data is received from Steem for display in a list style like Steemit.
*  Each post has data extracted from it to dispaly on the page view. Redux
*  state data is also used for upvote and resteem actions.
 *
 *  @param {array} posts All the posts fetched
 *  @param {function} showModal To show the add post modal
 *  @param {string} user Logged in user
 *  @param {function} handleUpvote Send upvotes to Steem
 *  @param {object} upvotePayload Results of upvote containing vote data
 *  @param {boolean} isFetching Determines if data is being fetched
 *  @param {function} handleResteem Send a resteem to Steem
 *  @param {string} page The current page
 *  @param {string} pageOwner The user name of blog or feed page
 *  @param {object} resteemedPayload Results of resteem with resteem post data
 *  @param {boolean} showDesc If the description if to be shown
 */
const PostsSummaryList = (props) => {

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
    showModalVotes,
    showResteems,
  } = props;

  if (!posts.length && !isFetching) {
    return "No Posts";
  }else {
    return (
      posts.map(postData => {
        const pid = parseInt(postData.id);

        const votedPost = upvotePayload.votedPosts.find(votedPost => votedPost.id === (postData.id));
        if (votedPost)
          postData = votedPost;

        const extract = extractContent(postData);
        const post = {...postData, ...extract};

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

        const payoutDeclined = post.max_accepted_payout === '0.000 SBD';
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

        if (!showResteems && isResteemed)
          return null;

        const isFullPower = post.percent_steem_dollars === 0;

        return (
          <div key={permlink} className='infSummary postSummary'>
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
                    payoutDeclined={payoutDeclined}
                    isFullPower={isFullPower}
                    showModalVotes={showModalVotes}
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

PostsSummaryList.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object),
  showModal: PropTypes.func,
  user: PropTypes.string,
  handleUpvote: PropTypes.func,
  upvotePayload: PropTypes.shape(PropTypes.object.isRequired),
  isFetching: PropTypes.bool,
  handleResteem: PropTypes.func,
  showModalVotes: PropTypes.func,
};

PostsSummaryList.defaultProps = {
  posts: [],
  showModal: () => {},
  user: '',
  handleUpvote: () => {},
  upvotePayload: {},
  isFetching: false,
  handleResteem: () => {},
  showModalVotes: () => {},
};


export default PostsSummaryList;
