import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Grid, Form, Select } from "semantic-ui-react";
import _ from 'lodash';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import PostBody from './PostBody';
import { getFromMetadata } from '../helpers/parser';
import { getProxyImageURL } from '../helpers/image';
import { jsonParse } from '../helpers/formatter';
import PostFeedEmbed from '../PostFeedEmbed';
import Tags from '../Tags';
import Comments from './Comments'
import ReplyForm from './ReplyForm';
import AuthorCatgoryTime from '../AuthorCatgoryTime';
import PostActions from '../PostActions';
import Loading from '../../../Loading/Loading';
import { sumPayout } from '../../../../utils/helpers';
import './PostDetails.css'

/**
 *  Renders the post details view for Steem content.
 */
class PostDetails extends Component {

  static propTypes = {
    showModal: PropTypes.func.isRequired,
    user: PropTypes.string.isRequired,
    isAuth: PropTypes.bool,
    post: PropTypes.shape(PropTypes.object.isRequired),
    isFetching: PropTypes.bool.isRequired,
    handleUpvote: PropTypes.func.isRequired,
    upvotePayload: PropTypes.shape(PropTypes.object.isRequired),
    replies: PropTypes.arrayOf(PropTypes.object.isRequired),
    sendComment: PropTypes.func.isRequired,
    isCommenting: PropTypes.bool.isRequired,
    commentedId: PropTypes.number,
    commentPayload: PropTypes.shape(PropTypes.object.isRequired),
  };

  static defaultProps = {
    post: {},
    upvotePayload: {},
    commentPayload: {},
    commentedId: 0,
    isAuth: false,
    replies: [],
  }

  constructor(props) {
    super(props);

    //this.images = [];
    //this.imagesAlts = [];
    this.sortOptions = [
      {key: 0, value: 'old', text: 'Old'},
      {key: 1, value: 'new', text: 'New'},
      //{key: 2, value: 'votes', text: 'Votes'},
      {key: 3, value: 'rep', text: 'Reputation'},
      {key: 4, value: 'payout', text: 'Payout'}
    ];

    this.state = {
      sortBy: 'old',
    }
  }

  //Needed to `dangerouslySetInnerHTML`
  createMarkup = (html) => {
    return {__html: html};
  }

  /**
   *  Set state values for when tag input text changes.
   *
   *  @param {event} e Event triggered by element to handle
   *  @param {string} value Value of the element triggering the event
   */
   handleSortChange = (e, {value}) => {
     this.setState({
       sortBy: value,
      });
   }

  /**
   *  Lifted from busy.org source code to play d.tube videos on-site.
   */
  renderDtubeEmbedPlayer(post) {
    const parsedJsonMetaData = _.attempt(JSON.parse, post.json_metadata);

    if (_.isError(parsedJsonMetaData)) {
      return null;
    }

    const video = getFromMetadata(post.json_metadata, 'video');
    const isDtubeVideo = _.has(video, 'content.videohash') && _.has(video, 'info.snaphash');

    if (isDtubeVideo) {
      const videoTitle = _.get(video, 'info.title', '');
      const author = _.get(video, 'info.author', '');
      const permlink = _.get(video, 'info.permlink', '');
      const dTubeEmbedUrl = `https://emb.d.tube/#!/${author}/${permlink}/true`;
      const dTubeIFrame = `<iframe width="100%" height="340" src="${dTubeEmbedUrl}" title="${videoTitle}" allowFullScreen></iframe>`;
      const embed = {
        type: 'video',
        provider_name: 'DTube',
        embed: dTubeIFrame,
        thumbnail: getProxyImageURL(`https://ipfs.io/ipfs/${video.info.snaphash}`, 'preview'),
      };
      return <PostFeedEmbed embed={embed} />;
    }

    return null;
  }

  render() {
    const {
      showModal,
      user,
      isAuth,
      isFetching,
      handleUpvote,
      upvotePayload,
      replies,
      sendComment,
      isCommenting,
      commentedId,
      commentPayload,
    } = this.props;

    const {
      sortBy,
    } = this.state;

    let {post} = this.props;
    if (upvotePayload.post.id > 0 && post.id === upvotePayload.post.id) {
      post = upvotePayload.post
    }

    const title = post.title;
    const author = post.author;
    const authorReputation = post.author_reputation;
    const permlink = post.permlink;
    const category = post.category;
    const created = post.created;
    const activeVotes = post.active_votes;

    const totalPayout = sumPayout(post);
    const totalRShares = post.active_votes.reduce((a, b) => a + parseFloat(b.rshares), 0);
    const ratio = totalRShares === 0 ? 0 : totalPayout / totalRShares;

    const commentCount = post.children;
    const canonicalUrl = `https://thekure.net${post.url}`;
    const url = `https://thekure.net${post.url}`;
    const ampUrl = `${url}/amp`;
    const metaTitle = `${title} - KURE`;
    const desc = post.desc;
    const postMetaData = jsonParse(post.json_metadata);
    const postMetaImage = postMetaData && postMetaData.image && postMetaData.image[0];
    const image = postMetaImage || `https://steemitimages.com/u/${author}/avatar` || '/images/logo.png';

    const body = post.body || '';
    //const parsedBody = getHtml(body, {}, 'text');
    //this.images = extractImageTags(parsedBody);

    let tags = getFromMetadata(post.json_metadata, 'tags');
    if (tags === null) tags = [post.category];

    const comments = replies;
    const pid = post.id;

    return (
      <HelmetProvider>
        <React.Fragment>
          <Helmet>
            <title>{title}</title>
            <link rel="canonical" href={canonicalUrl} />
            <link rel="amphtml" href={ampUrl} />
            <meta property="description" content={desc} />
            <meta property="og:title" content={metaTitle} />
            <meta property="og:type" content="article" />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={image} />
            <meta property="og:description" content={desc} />
            <meta property="og:site_name" content="Kure" />
            <meta property="article:tag" content={category} />
            <meta property="article:published_time" content={new Date(created).toDateString()} />
          </Helmet>
          <Grid verticalAlign='middle' columns={1} centered>
            <Grid.Row>
              <Grid.Column width={11}>
                <React.Fragment>
                  {
                    isFetching ? <Loading />
                    : (
                      <React.Fragment>
                        <div className='PostContent'>
                          <h1>
                            {title}

                          </h1>
                          <AuthorCatgoryTime
                            author={author}
                            authorReputation={authorReputation}
                            category={category}
                            created={created}
                            permlink={permlink}
                          />
                          <hr />
                          {this.renderDtubeEmbedPlayer(post)}
                          <PostBody
                            full
                            rewriteLinks={false}
                            body={body}
                            jsonMetadata={post.json_metadata}
                          />
                          <br />
                          <div className='footer'>
                            <div className='left'>
                              <Tags tags={tags} />
                            </div>
                            <div className='alt-site right'>
                              {`View on `}
                              <a
                                target='_blank'
                                rel='noopener noreferrer'
                                href={`https://steemit.com${post.url}`}
                              >
                                {'Steemit'}
                              </a>
                              {' | '}
                              <a
                                target='_blank'
                                rel='noopener noreferrer'
                                href={`https://busy.org/@${author}/${permlink}`}
                              >
                                {'Busy'}
                              </a>
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
                                image={image}
                              />
                            </div>
                            <hr />
                            {
                              isAuth &&
                              (
                                <ReplyForm
                                  sendComment={sendComment}
                                  isCommenting={isCommenting}
                                  parentPost={post}
                                  commentedId={commentedId}
                                />
                              )
                            }
                          </div>
                        </div>
                      </React.Fragment>
                    )
                  }
                  <div className='comments' id='comments'>
                    {
                      !!comments.length && (
                        <React.Fragment>
                          <div className='left'>
                            <h2>Comments</h2>
                          </div>
                          <div className='right'>
                            <Form>
                              <Form.Group>
                                <Form.Field
                                  control={Select}
                                  defaultValue={this.sortOptions[0].value}
                                  options={this.sortOptions}
                                  onChange={this.handleSortChange}
                                />
                              </Form.Group>
                            </Form>
                          </div>
                          <Comments
                            comments={comments}
                            sendComment={sendComment}
                            isCommenting={isCommenting}
                            commentedId={commentedId}
                            isAuth={isAuth}
                            commentPayload={commentPayload}
                            pid={pid}
                            handleUpvote={handleUpvote}
                            user={user}
                            upvotePayload={upvotePayload}
                            sortBy={sortBy}
                          />
                        </React.Fragment>
                      )
                    }
                  </div>
                </React.Fragment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </React.Fragment>
      </HelmetProvider>
    )
  }
}

export default PostDetails;
