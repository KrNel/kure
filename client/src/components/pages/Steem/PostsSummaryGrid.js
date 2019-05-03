import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Grid, Image } from "semantic-ui-react";

import './PostsSummary.css';
import AuthorCatgoryTime from './AuthorCatgoryTime';
import PostActions from './PostActions';
import { extractContent } from './helpers/extractContent';
import TitleLink from './TitleLink';
import PostLink from './PostLink';
import { sumPayout } from '../../../utils/helpers';
import Resteemers from './Resteemers';
import Avatar from './Avatar';
import AuthorReputation from './AuthorReputation';
import Category from './Category';
import { LongNowDate, standard } from '../../../utils/dateFormatting';

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
    showDesc,
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

        let descClass = 'descriptionBox';
        let description = null;
        if (showDesc) {
          descClass = 'descriptionBox';
          description = (
            <div className='description'>
              <PostLink
                author={author}
                category={category}
                permlink={permlink}
                text={desc}
              />
            </div>
          );
        }

        const key = p+i;

        return (

          <Grid.Column key={key} width={8} className='infSummary'>
            <div className={descClass}>
              {resteemed}
              <div className='postBox'>
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
                <div className='overlayImage'>
                  <div className='recentTitle'>
                    <div className='titleContent'>
                      <TitleLink
                        title={title}
                        category={category}
                        author={author}
                        permlink={permlink}
                      />
                    </div>
                  </div>
                  <div className='left'>
                    <ul className="info">
                      <li className="item avatar"><Avatar author={author} height='30px' width='30px' /></li>
                      <li className="item author" data-author={author}>
                        {'\u00A0'}
                        <AuthorReputation author={author} reputation={authorReputation} />
                      </li>
                    </ul>

                  </div>
                  <div className='right'>
                    <div className="item tag">
                      {'Posted in '}
                      <strong><Category category={category} /></strong>
                    </div>
                    <div className="item timeago">
                      <PostLink
                        author={author}
                        category={category}
                        permlink={permlink}
                        title={standard(created)}
                        text={<LongNowDate date={created} />}
                      />
                    </div>
                  </div>
                  <div className='clear' />
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
                  {/*}<div className='left'>
                    {'by '}
                    <UserLink user={post.st_author} />
                  </div>
                  <div className='right'>
                    <div><GroupLink display={post.display} name={post.group} /></div>
                    <div>{<LongNowDate date={post.created} />}</div>
                  </div>*/}
                </div>
              </div>
              { description }
            </div>
          </Grid.Column>

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
