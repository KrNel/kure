import React from 'react';
import moment from 'moment';

import './PostsSummary.css';
import AuthorCatgoryTime from './AuthorCatgoryTime';
import Thumbnail from './Thumbnail';
import PostActions from './PostActions';
import { extractContent } from './helpers/formatters';
import RepLog10 from '../../../utils/reputationCalc';
import TitleLink from '../../Common/TitleLink';


/**
 *  Root container for post summaries.
 *
 *  @param {array} posts All the posts fetched
 *  @param {array} nextPost Whether to skip the first post, dupe of prev last post
 *  @param {function} showModal Parent function to show the add post modal
 */
const PostsSummary = ({posts, nextPost, showModal, user, csrf, onClickTitle}) => {
  //const postsExtracts = extractContent(posts);

  //var posts = [];
  if (posts.length) {
    return (
      posts.map((p, i) => {

        if (nextPost) {
					nextPost = false;
					return false;
				}
        const extract = extractContent(p);
        const post = {...p, ...extract};

        const title = post.title;
        const author = post.author;
        const authorReputation = RepLog10(post.author_reputation);
        //const url = post.url;
        const desc = post.desc;
        const permlink = post.permlink;
        const category = post.category;
        const thumb = post.image_link;
        const payoutValue = post.pending_payout_value/* + post.total_payout_value*/;
        //const created = new Date(post.created).toDateString();
        const createdFromNow = moment.utc(post.created).fromNow();
        const activeVotesCount = post.active_votes.length;
        const commentCount = post.children;

        return (
          <div key={i} className='post'>
            <AuthorCatgoryTime
              author={author}
              authorReputation={authorReputation}
              category={category}
              payoutValue={payoutValue}
              createdFromNow={createdFromNow}
            />

            <div className="block">
              {
                (thumb)
                  ? (
                    <div className="thumbnail">
                      <Thumbnail thumb={thumb} />
                    </div>
                    )
                  : ''
              }
              <div className="summary-content" data-permlink={permlink}>
                <h4>
                  {/*<Link to={url}>
                    {title}
                  </Link>*/}
                  <TitleLink
                    title={title}
                    category={category}
                    author={author}
                    permlink={permlink}
                  />
                </h4>
                <p>
                  {desc}
                </p>
                <div className='post-actions'>
                  <PostActions
                    activeVotesCount={activeVotesCount}
                    commentCount={commentCount}
                    author={author}
                    category={category}
                    permlink={permlink}
                    title={title}
                    showModal={showModal}
                    user={user}
                  />
                </div>
              </div>
            </div>
            <hr />
          </div>
        )
    })
  )
  }else return "No Posts";
}

export default PostsSummary;
