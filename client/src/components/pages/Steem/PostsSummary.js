import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Grid, Image } from "semantic-ui-react";

import './PostsSummary.css';
import PostActions from './PostActions';
import { extractContent } from './helpers/extractContent';
import TitleLink from './TitleLink';
import PostLink from './PostLink';
import { sumPayout } from '../../../utils/helpers';
import Resteemers from './Resteemers';
import AuthorCatgoryTime from './AuthorCatgoryTime';

/**
 *  Post data is received from Steem for display in a grid of boxes.
 *  Each post has data extracted from it to  dispaly on the page view. Redux
 *  state data is also used for upvote and resteem actions.
 *
 *  @param {array} posts All the posts fetched
 *  @param {function} showModal Parent function to show the add post modal
 */
const PostsSummaryGrid = (props) => {

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
    showDesc,
    percentSD,
  } = props;

  if (!posts.length && !isFetching) {
    return "No Posts";
  }else {
    return (
      posts.map((p, i) => {

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
        const payoutDeclined = post.max_accepted_payout === '0.000 SBD';
        const reblogged_by = post.reblogged_by;

        let isResteemed = false;

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

          <Grid.Column key={key} width={8} className='infSummary'>

            <div className='postBox'>
              {resteemed}
              <div className='cropImage'>
                {
                  (thumb)
                  ? (
                    <div className="thumbnail">
                      <PostLink
                        author={author}
                        category={category}
                        permlink={permlink}
                        text={<Image src={`https://steemitimages.com/640x480/${thumb}`} alt="image" />}
                      />
                    </div>
                    )
                  : ''
                }
              </div>
              <AuthorCatgoryTime
                author={author}
                authorReputation={authorReputation}
                category={category}
                created={created}
                permlink={permlink}
              />
              <div className='title'>
                <TitleLink
                  title={title}
                  category={category}
                  author={author}
                  permlink={permlink}
                />
              </div>
              {
                showDesc && (
                  <div className='description'>
                    <PostLink
                      author={author}
                      category={category}
                      permlink={permlink}
                      text={desc}
                    />
                  </div>
                )
              }
              <div>

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
                    resteemedPayload={resteemedPayload}
                    pageOwner={pageOwner}
                    payoutDeclined={payoutDeclined}
                    percentSD={post.percent_steem_dollars}
                  />
                </div>
              </div>
            </div>
          </Grid.Column>

        )
      })
    )
  }
}

PostsSummaryGrid.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object),
  showModal: PropTypes.func,
  user: PropTypes.string,
  handleUpvote: PropTypes.func,
  upvotePayload: PropTypes.shape(PropTypes.object.isRequired),
  isFetching: PropTypes.bool,
  handleResteem: PropTypes.func,
};

PostsSummaryGrid.defaultProps = {
  posts: [],
  showModal: () => {},
  user: '',
  handleUpvote: () => {},
  upvotePayload: {},
  isFetching: false,
  handleResteem: () => {},
};


export default PostsSummaryGrid;
