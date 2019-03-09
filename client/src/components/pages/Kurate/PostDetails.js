import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Client } from 'dsteem';
import { Grid } from "semantic-ui-react";
import moment from 'moment';
import _ from 'lodash';

import PostBody, { getHtml } from './PostBody';
import { getFromMetadata, extractImageTags } from './helpers/parser';
import { getProxyImageURL } from './helpers/image';
import PostFeedEmbed from './PostFeedEmbed';

import RepLog10 from '../../../utils/reputationCalc';
import AuthorCatgoryTime from './AuthorCatgoryTime';
import PostActions from './PostActions';
import Loading from '../../Loading/Loading';
import './PostDetails.css'

const client = new Client('https://hive.anyx.io/');

/**
 *  Renders the post details for Steem content for a user to view.
 */
class PostDetails extends Component {
  static propTypes = {
    match: PropTypes.shape(PropTypes.object.isRequired).isRequired,
    showModal: PropTypes.func.isRequired,
    user: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      post: {},
      isLoading: true,
    }

    this.images = [];
    this.imagesAlts = [];
  }


  /**
   *  Fetch post detail from Steem blockchain on component mount.
   */
  componentDidMount() {
    const {
      match: {
        params: {
          author,
          permlink
        }
      }
    } = this.props;

    this.openPost(author, permlink);
  }

  //Needed to `dangerouslySetInnerHTML`
  createMarkup = (html) => {
    return {__html: html};
  }

  /**
   *  Open the post for user to see.
   *
   *  @param {string} author Author of content
   *  @param {string} permlink Permlink of content
   */
  openPost = (author, permlink) => {
    client.database.call('get_content', [author, permlink]).then(result => {
      this.setState({
        post: result,
        isLoading: false
      });
    });
  }


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
    } = this.props;

    const {post, isLoading} = this.state;

    const title = post.title;
    const author = post.author;
    const authorReputation = RepLog10(post.author_reputation);
    //const url = post.url;
    const permlink = post.permlink;
    const category = post.category;
    const payoutValue = post.pending_payout_value/* + post.total_payout_value*/;
    //const created = new Date(post.created).toDateString();
    const createdFromNow = moment.utc(post.created).fromNow();
    const activeVotesCount = (post.active_votes) ? post.active_votes.length : 0;
    const commentCount = post.children;



    let signedBody = post.body || '';

    const parsedBody = getHtml(signedBody, {}, 'text');

    this.images = extractImageTags(parsedBody);

    //const tags = _.union(getFromMetadata(post.json_metadata, 'tags'), [post.category]);
    const tags = getFromMetadata(post.json_metadata, 'tags');

    /*<Helmet>
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
    </Helmet>*/
    return (

      <Grid verticalAlign='middle' columns={1} centered>
        <Grid.Row>
          <Grid.Column width={12}>
            {
              isLoading ? <Loading />
              : (
                <div className='PostContent'>

                  <h1>
                    {title}

                  </h1>
                  <AuthorCatgoryTime
                    author={author}
                    authorReputation={authorReputation}
                    category={category}
                    payoutValue={payoutValue}
                    createdFromNow={createdFromNow}
                  />
                  <hr />
                  {this.renderDtubeEmbedPlayer(post)}
                  <PostBody
                    full
                    rewriteLinks={false}
                    body={signedBody}
                    json_metadata={post.json_metadata}
                  />
                  <br />
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
              )
            }
          </Grid.Column>
        </Grid.Row>
      </Grid>

    )
  }
}

export default PostDetails;
