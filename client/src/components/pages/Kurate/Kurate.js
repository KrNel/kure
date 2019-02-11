import React, {Component}  from 'react';
import { connect } from 'react-redux';
import { Client } from 'dsteem';
import { Button } from "semantic-ui-react";

import PostsSummary from './PostsSummary';
import PostDetails from './PostDetails';
import { getUserGroups, addPost } from '../Manage/fetchFunctions';
import ModalGroup from '../../Modal/ModalGroup';
import ErrorLabel from '../../ErrorLabel/ErrorLabel';

const client = new Client('https://hive.anyx.io/');

/**
 *  Kurate gets the Steem blockchain content and dusplays a list of post
 *  summaries for browsing. Content can be added to a community group
 *  to which the user belongs.
 */
class Kurate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      postsListShow: 'none',
      postShow: 'none',
      post: {},
      selectedGroup: '',
      modalOpen: false,
      addPostData: {},
      groups: [{key: 0, text: 'No Groups', value: '0'}],
      newPost: '',
      postExists: false,
      addPostLoading: false,
    }
    this.existPost = "Post already in group.";
  }

  componentDidMount() {
    this.getPosts();
    const {user} = this.props;
    //this.getGroupsFetch(user);
    this.getGroupsFetch('krnel');
  }
  /*shouldComponentUpdate(np, ns) {
     const {posts} = this.state;
     //if (ns.selectedGroup !== this.state.selectedGroup) return false;
     if (posts !== posts.length || posts !== ns.posts) {
       return true;
     }else return false;
   }*/

  /*componentDidUpdate(prevProps) {
    const {user} = this.props;
    if (user !== prevProps.user) {
      this.getGroupsFetch(user);
    }
  }*/

  /**
   *  When the page loads, this function will get the posts from Steem.
   *  THe list can be freshed with the Refresh button, or at the bottom
   *  more posts can be displayed by clicking 'Get More Posts'.
   *
   *  @param {string} action Get initial posts, or more after.
   */
  getPosts = (action = 'init') => {
    const {posts} = this.state;
    let startAuthor = undefined;
    let startPermlink = undefined;

    if (posts.length && action === 'more') {
      startAuthor = document.querySelector('.post:last-child li.author').dataset.author;
      startPermlink = document.querySelector('.post:last-child div.summary-content').dataset.permlink;
    }

    let nextPost = false;
    if (startAuthor !== undefined && startPermlink !== undefined) {
      nextPost = true;
    }

    const query = {
      tag: '',
      limit: 20,
      truncate_body: 0,
      start_author: startAuthor,
      start_permlink: startPermlink
    };

    client.database.getDiscussions('created', query)
      .then(result => {
        //console.log('Response received:', result);
        if (result) {
          if (nextPost) {
            this.setState({
              posts: [...posts, ...result.slice(1)],
              nextPost,
            });
          }else {
            this.setState({
              posts: result,
              nextPost,
            });
          }
          this.onPostsGet();
        } else {
          //document.getElementById('postList').innerHTML = 'No result.';
        }
      }).catch(err => {
          //console.log(err);
          //alert(`Error:${err}, try again`);
      });
  }

  /**
   *  Shows the popup modal for user confirmation.
   *
   *  @param {event} e Event triggered by element to handle
   *  @param {object} modalData Post and user data for the modal
   */
  showModal = async (e, data) => {
    e.preventDefault();
    const {user, csrf} = this.props;
    this.setState({
      modalOpen: true,
      addPostData: {...data, user, csrf},
    });
  }

  /**
   *  Hides the popup modal.
   */
  onModalClose = () => this.setState({
    modalOpen: false,
    addPostLoading: false,
    postExists: false,
  });

  /**
   *  Handle the Yes or No confirmation from the modal.
   *  If Yes, proceed with deletion of post or user.
   *
   *  @param {event} e Event triggered by element to handle
   */
  handleModalClick = (e) => {
    const confirm = e.target.dataset.confirm;
    if (confirm === 'true') {
      /*if (await this.handlePostValidation(newPost)) {
        this.setState({addPostLoading: true});
        this.addPostFetch(newPost, this.groupName);
      }*/
      this.setState({addPostLoading: true});
      this.addPostFetch();
    }else this.onModalClose();
  }

  /**
   *  Send new post to be added to the database.
   *  Reset the flags depending on errors or not, add new post to posts state.
   */
  addPostFetch = () => {
    const {
      addPostData: {
        csrf,
         ...rest
      },
      selectedGroup,
    } = this.state;
    addPost({group: selectedGroup, ...rest}, csrf)
    .then(res => {
      if (!res.data.invalidCSRF) {
        if (res.data.exists) {
          this.setState({
            postExists: true,
            addPostLoading: false,
          });
        }else if (res.data.post) {
          this.setState({
            postExists: false,
            addPostLoading: false,
          });
          this.onModalClose();
        }/*else {
          //error adding in db...
          this.setState({
            postExists: false,
            addPostLoading: false,
          });
        }*/
      }
    }).catch((err) => {
      throw new Error('Error adding post: ', err);
    });
  }

  /**
   *  Set state values for when group select changes.
   *  Reset post exists error flag.
   *
   *  @param {event} e Event triggered by element to handle
   *  @param {string} value Value of the element triggering the event
   */
  handleGroupSelect = (e, {value}) => {
    this.setState({
      selectedGroup: value,
      postExists: false,
     });
  }

  /**
   *  Fetch the groups for groups selection when adding a post.
   *
   *  @param {string} user User to get groups for
   */
  getGroupsFetch = (user) => {
    getUserGroups(user, 'all')
    .then(res => {
      const groups = res.data.groups.map((g, i) => {
        return {key: i, value: g.name, text: g.display, ...g}
      })
      this.setState({
        groups
      });
    }).catch((err) => {
      throw new Error('Error getting groups: ', err);
    });
  }


  onPostsGet = () => {
    this.setState({postsListShow: 'block'})
  }

  /*openPost = (author, permlink) => {
    client.database.call('get_content', [author, permlink]).then(result => {
      this.setState({
        post: result
      });
      this.onPostOpen();
    });
  }

  onPostOpen = () => {
    this.setState({
      postsListShow: 'none',
      postShow: 'block',
    })
  }

  onPostClose = () => {
    this.setState({
      postsListShow: 'block',
      postShow: 'none',
      post: {}
    })
  }*/



  render() {
    const {
      state: {
        posts,
        postsListShow,
        postShow,
        post,
        nextPost,
        modalOpen,
        groups,
        postExists,
        addPostLoading,
      }
    } = this;
    let addErrorPost = '';

    if (postExists) addErrorPost = <ErrorLabel position='left' text={this.existPost} />;

    return (
      <React.Fragment>
        <div>
          <ModalGroup
            modalOpen={modalOpen}
            onModalClose={this.onModalClose}
            handleModalClick={this.handleModalClick}
            getGroupsFetch={this.getGroupsFetch}
            handleGroupSelect={this.handleGroupSelect}
            groups={groups}
            addErrorPost={addErrorPost}
            addPostLoading={addPostLoading}
          />
          <Button id='init' color='blue' onClick={() => this.getPosts('init')}>Refresh Posts</Button>
        </div>
        <hr />
        <div>
          <div id="postList" style={{display: postsListShow}}>
            <PostsSummary
              posts={posts}
              openPost={this.openPost}
              nextPost={nextPost}
              showModal={this.showModal}
              handleGroupSelect={this.handleGroupSelect}
            />
          </div>

          <div id="postBody" style={{display: postShow}}>
            {
              (post) ? <PostDetails post={post} onPostClose={this.onPostClose} /> : ''
            }
          </div>
        </div>
        <Button id='more' color='blue' style={{display: postsListShow}} type="button" onClick={() => this.getPosts('more')}>Get More Posts</Button>
      </React.Fragment>
    )
  }
}

/**
 *  Map redux state to component props.
 *
 *  @param {object} state - Redux state
 *  @returns {object} - Object with recent activity data
 */
const mapStateToProps = state => {
  const { userData, csrf } = state.auth;

  return {
    user: userData.name,
    csrf
  }
}

export default connect(mapStateToProps)(Kurate);
