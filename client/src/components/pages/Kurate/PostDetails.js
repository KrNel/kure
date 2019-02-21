import React, {Component} from 'react';
import Remarkable from 'remarkable';
import { Client } from 'dsteem';
import { Grid } from "semantic-ui-react";
import moment from 'moment';

//import HtmlReady from '../pages/Kurate/helpers/htmlready';
//import { extractContent } from '../pages/Kurate/helpers/formatters';
import RepLog10 from '../../../utils/reputationCalc';
import AuthorCatgoryTime from './AuthorCatgoryTime';
import PostActions from './PostActions';
import replaceLinks from './helpers/replaceLinks';

/*import { getUserGroups, addPost, logger } from '../../../utils/fetchFunctions';
import ModalGroup from '../Modal/ModalGroup';
import ErrorLabel from '../ErrorLabel/ErrorLabel';*/

import './PostDetails.css'

const client = new Client('https://hive.anyx.io/');

class PostDetails extends Component {
  state = {
    post: {},
    isLoading: true,
    /*modalOpenAddPost: false,
    addPostData: {},
    postExists: false,
    addPostLoading: false,*/
  }

  componentDidMount() {
//console.log('pp:',this.props)
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

  createMarkup = (html) => {
    return {__html: html};
  }

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

    const {post, isLoading} = this.state;

    const md = new Remarkable({
      html: true,
      linkify: true
    });

    let body;

    if (post.body) {
      body = replaceLinks(post.body);
    }
    body = md.render(body)

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

    return (
      <Grid verticalAlign='middle' columns={1} centered>
        <Grid.Row>
          <Grid.Column width={12}>
            {
              !isLoading
              ? (
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
                  <div dangerouslySetInnerHTML={this.createMarkup(body)} />
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
              : ('Loading...')
            }
          </Grid.Column>
        </Grid.Row>
      </Grid>

    )
  }
}

export default PostDetails;
