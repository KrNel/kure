import React, {Component} from 'react';
import Remarkable from 'remarkable';
import { Client } from 'dsteem';
import { Grid } from "semantic-ui-react";
import moment from 'moment';

//import HtmlReady from '../pages/Kurate/helpers/htmlready';
//import { extractContent } from '../pages/Kurate/helpers/formatters';
import RepLog10 from '../../utils/reputationCalc';
import AuthorCatgoryTime from '../pages/Kurate/AuthorCatgoryTime';
import PostActions from '../pages/Kurate/PostActions';
import './PostDetails.css'

const client = new Client('https://hive.anyx.io/');

class PostDetails extends Component {
  state = {
    post: {},
    isLoading: true,
  }

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

    const {post, isLoading} = this.state;

    const md = new Remarkable({
      html: true,
      linkify: true
    });

    let body = post.body;
console.log('b1:',body)
    const urlChar = '[^\\s"<>\\]\\[\\(\\)]';
    const urlCharEnd = urlChar.replace(/\]$/, ".,']"); // insert bad chars to end on
    const imagePath =
        '(?<!img.*>)(?:(?:\\.(?:tiff?|jpe?g|gif|png|svg|ico)|ipfs/[a-z\\d]{40,}))';
    const domainPath = '(?:[-a-zA-Z0-9\\._]*[-a-zA-Z0-9])';
    const urlChars = '(?:' + urlChar + '*' + urlCharEnd + ')?';

    const urlSet = ({ domain = domainPath, path } = {}) => {
        // urlChars is everything but html or markdown stop chars
        return `(?<!(?:img|a).*)https?:\/\/${domain}(?::\\d{2,5})?(?:[/\\?#]${urlChars}${
            path ? path : ''
        })${path ? '' : '?'}`;
        /*return `https?:\/\/${domain}(?::\\d{2,5})?(?:[/\\?#]${urlChars}${
            path ? path : ''
        })${path ? '' : '?'}`;*/
        //https://localhost:3000/news/@rebe.torres12/una-renegada-a-renegade
    };

    if (body) {
      body = post.body.replace(new RegExp(urlSet(), 'gi'), ln => {
console.log('ln',ln)
        //if (!new RegExp(urlSet({ path: imagePath }), 'i').test(ln))
          if (new RegExp(urlSet({ path: imagePath }), 'i').test(ln)) {
              //return `<img src="${ipfsPrefix(ln)}" />`;
              return `<img src="${ln}" />`;
          }
          // do not linkify .exe or .zip urls
          if (/\.(zip|exe)$/i.test(ln)) return ln;

          return `<a href="${ln}">${ln}</a>`;
        //}
      });
    }
    body = md.render(body)

console.log('b2:',body)
    const title = post.title;
    const author = post.author;
    const authorReputation = RepLog10(post.author_reputation);
    //const url = post.url;
    //const permlink = post.permlink;
    const category = post.category;
    const payoutValue = post.pending_payout_value/* + post.total_payout_value*/;
    //const created = new Date(post.created).toDateString();
    const createdFromNow = moment.utc(post.created).fromNow();
    const activeVotesCount = post.active_votes.length;
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
