import React, {Component} from 'react';
import PropTypes from 'prop-types';
//import Remarkable from 'remarkable';
import { Client } from 'dsteem';
import { Grid } from "semantic-ui-react";
import moment from 'moment';

import RepLog10 from '../../../utils/reputationCalc';
import AuthorCatgoryTime from './AuthorCatgoryTime';
import PostActions from './PostActions';
//import replaceLinks from './helpers/replaceLinks';

//import PostBody, { getHtml } from './PostBody';
//import { getFromMetadata, extractImageTags } from './helpers/busy/parser';

import MarkdownViewer from './helpers/MarkdownViewer';
import {extractContent} from './helpers/o/formatters';
//import { immutableAccessor } from './helpers/Accessors';
import { repLog10, parsePayoutAmount } from './helpers/ParsersAndFormatters';

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

    //this.handleClick = this.handleClick.bind(this);
    //this.handleContentClick = this.handleContentClick.bind(this);
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

  /*shouldComponentUpdate(nextProps, nextState) {
    if (this.state.post != nextState.post) return true;
    else return false;
  }*/

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

  render() {
    const {
      showModal,
      user,
    } = this.props;

    const {post = {}, isLoading} = this.state;
console.log('post:',post)
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
if (Object.getOwnPropertyNames(post).length > 0) {
/*const post_content = post;
if (!post_content) return null;
console.log('post_content:',post_content)*/
const p = extractContent(post);
//const content = post_content.toJS();
let content_body = p.body;
const jsonMetadata = p.json_metadata;
const pending_payout = parsePayoutAmount(post.pending_payout_value);
const total_payout = parsePayoutAmount(post.total_payout_value);
const high_quality_post = pending_payout + total_payout > 10.0;

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
                  {/*<div dangerouslySetInnerHTML={this.createMarkup(body)} />*/}
                  <MarkdownViewer
                    text={content_body}
                    jsonMetadata={jsonMetadata}
                    large
                    highQualityPost={high_quality_post}
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
  }else return null;
  }
}

export default PostDetails;
