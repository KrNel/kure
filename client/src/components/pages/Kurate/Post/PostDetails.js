import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Grid } from "semantic-ui-react";
import _ from 'lodash';
import Helmet from 'react-helmet';

import PostBody, { getHtml } from './PostBody';
import { getFromMetadata, extractImageTags } from '../helpers/parser';
import { getProxyImageURL } from '../helpers/image';
import { jsonParse } from '../helpers/formatter';
import PostFeedEmbed from '../PostFeedEmbed';
import Tags from '../Tags';
import Comments from './Comments'

import RepLog10 from '../../../../utils/reputationCalc';
import AuthorCatgoryTime from '../AuthorCatgoryTime';
import PostActions from '../PostActions';
import Loading from '../../../Loading/Loading';
import './PostDetails.css'

/**
 *  Renders the post details view for Steem content.
 */
class PostDetails extends Component {
  static propTypes = {
    match: PropTypes.shape(PropTypes.object.isRequired).isRequired,
    showModal: PropTypes.func.isRequired,
    user: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.images = [];
    this.imagesAlts = [];


  }

  componentDidMount() {
console.log(this.props.post.children)
    if (this.props.post.children > 0) {
      this.props.getComments(this.props.post.author, this.props.post.permlink);
    }
  }

  //Needed to `dangerouslySetInnerHTML`
  createMarkup = (html) => {
    return {__html: html};
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
      isFetching,
      handleUpvote,
      upvotePayload,
      getComments,
    } = this.props;

    let {post} = this.props;
    if (upvotePayload.post.id > 0) {
      post = upvotePayload.post
    }
    const title = post.title;
    const author = post.author;
    const authorReputation = RepLog10(post.author_reputation);
    const permlink = post.permlink;
    const category = post.category;
    const payoutValue = post.pending_payout_value/* + post.total_payout_value*/;
    const created = new Date(post.created).toDateString();
    //const createdFromNow = moment.utc(post.created).fromNow();
    const activeVotes = post.active_votes;

    const totalPayout =
      parseFloat(post.pending_payout_value) +
      parseFloat(post.total_payout_value) +
      parseFloat(post.curator_payout_value);
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
    const parsedBody = getHtml(body, {}, 'text');
    this.images = extractImageTags(parsedBody);

    //const tags = _.union(getFromMetadata(post.json_metadata, 'tags'), [post.category]);
    const tags = getFromMetadata(post.json_metadata, 'tags');

    return (
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
          <meta property="article:published_time" content={created} />
        </Helmet>
        <Grid verticalAlign='middle' columns={1} centered>
          <Grid.Row>
            <Grid.Column width={12}>
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
                      />
                      <hr />
                      {this.renderDtubeEmbedPlayer(post)}
                      <PostBody
                        full
                        rewriteLinks={false}
                        body={body}
                        json_metadata={post.json_metadata}
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
                            payoutValue={payoutValue}
                            permlink={permlink}
                            title={title}
                            showModal={showModal}
                            user={user}
                            handleUpvote={handleUpvote}
                            upvotePayload={upvotePayload}
                            ratio={ratio}
                            pid={post.id}
                          />
                        </div>
                      </div>
                    </div>
                    <hr />
                    <div className='comments'>
                      <Comments
                        comments={post.replies}
                      />
                    </div>
                  </React.Fragment>
                )
              }
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </React.Fragment>
    )
  }
}

export default PostDetails;
