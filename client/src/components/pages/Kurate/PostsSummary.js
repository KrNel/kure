import React from 'react';
import moment from 'moment';

import './PostsSummary.css';
import Author from './Author';
import Thumbnail from './Thumbnail';
import PostActions from './PostActions';
import { extractContent } from './helpers/formatters';
import {BASE_STEEM_URL} from '../../../settings';

/**
 *  Logarithmic part of rep calculations.
 */
function log10(str) {
    const leadingDigits = parseInt(str.substring(0, 4));
    const log = Math.log(leadingDigits) / Math.LN10 + 0.00000001;
    const n = str.length - 1;
    return n + (log - parseInt(log));
}

/**
 *  Computer the author's reputation level.
 */
export const repLog10 = rep2 => {
    if (rep2 == null) return rep2;
    let rep = String(rep2);
    const neg = rep.charAt(0) === '-';
    rep = neg ? rep.substring(1) : rep;

    let out = log10(rep);
    if (isNaN(out)) out = 0;
    out = Math.max(out - 9, 0); // @ -9, $0.50 earned is approx magnitude 1
    out = (neg ? -1 : 1) * out;
    out = out * 9 + 25; // 9 points per magnitude. center at 25
    // base-line 0 to darken and < 0 to auto hide (grep rephide)
    out = parseInt(out);
    return out;
};

/**
 *  Root container for post summaries.
 *
 *  @param {array} posts All the posts fetched
 *  @param {array} openPost Parent function to show post details
 *  @param {array} nextPost Whether to skip the first post, dupe of prev last post
 *  @param {function} showModal Parent function to show the add post modal
 */
const PostsSummary = ({posts, openPost, nextPost, showModal}) => {
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
//console.log('extract: ', extract)
        const post = {...p, ...extract};
//console.log('post: ', post)
      /*<div key={i} onClick={() => openPost(author, permlink)} role="presentation">
        <h4>{title}</h4>
        <p>
          {'by '}
          {author}
        </p>
        <center>
          <img src={image} alt={title} style={{maxWidth: "450px"}} />
        </center>
        <p>{created}</p>
      </div>*/
      //const image = json.image ? json.image[0] : '';
      const title = post.title;
      const author = post.author;
      const authorReputation = repLog10(post.author_reputation);
      const url = post.url;
      const desc = post.desc;
      const permlink = post.permlink;
      const category = post.category;
      const thumb = post.image_link;
      const payoutValue = post.total_payout_value;
      //const created = new Date(post.created).toDateString();
      const createdFromNow = moment.utc(post.created).fromNow();
      const activeVotesCount = post.active_votes.length;
      const commentCount = post.children;

      return (
        <div key={i} className='post'>
          <Author
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
                <a href={BASE_STEEM_URL+url}>{title}</a>
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
