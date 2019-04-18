import React from 'react';

import './PostsSummary.css';
import AuthorCatgoryTime from './AuthorCatgoryTime';
import Thumbnail from './Thumbnail';
import PostActions from './PostActions';
import { extractContent } from './helpers/extractContent';
import TitleLink from './TitleLink';
import PostLink from './PostLink';
import { sumPayout } from '../../../utils/helpers';

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
    isFetchingSummary,
    isFetchingScroll
  } = props;

  let {
    nextPost,
  } = props;

  if (!posts.length && !isFetchingSummary && !isFetchingScroll) {
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
        const created = post.created;
        const commentCount = post.children;
        const activeVotes = post.active_votes;

        const totalPayout = sumPayout(post);
        const totalRShares = post.active_votes.reduce((a, b) => a + parseFloat(b.rshares), 0);
        const ratio = totalRShares === 0 ? 0 : totalPayout / totalRShares;

        return (
          <div key={p.id} className='postSummary'>
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
                    pid={post.id}
                    image={thumb}
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

export default PostsSummary;
