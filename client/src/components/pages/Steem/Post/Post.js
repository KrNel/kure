import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import PostDetails from './PostDetails';
import ErrorBoundary from '../../../ErrorBoundary/ErrorBoundary';
import ModalGroup from '../../../Modal/ModalGroup';
import ErrorLabel from '../../../ErrorLabel/ErrorLabel';
import { getDetailsContent, clearPost, deletePost } from '../../../../actions/detailsPostActions';
import * as addPostActions from '../../../../actions/addPostActions';
import { commentsClear } from '../../../../actions/commentsActions';
import { sendComment, sendCommentClear } from '../../../../actions/sendCommentActions';
import { editPost } from '../../../../actions/sendPostActions';
import { resteem } from '../../../../actions/resteemActions';
import { upvotePost } from '../../../../actions/upvoteActions';
import { getAllFollowing } from '../../../../actions/followActions';
import { hasLength } from '../../../../utils/helpers';
import Loading from '../../../Loading/Loading';

/**
 *  Container to render post details from Steem. Receives props from
 *  redux store and send them to PostDetails for rendering, or to a
 *  modal component for selecting a community to add a post to.
 */
class Post extends Component {

  static propTypes = {
    showModal: PropTypes.func.isRequired,
    user: PropTypes.string.isRequired,
    csrf: PropTypes.string,
    post: PropTypes.shape(PropTypes.object.isRequired),
    handleUpvote: PropTypes.func.isRequired,
    upvotePayload: PropTypes.shape(PropTypes.object.isRequired),
    isCommenting: PropTypes.bool.isRequired,
    commentedId: PropTypes.number,
    commentPayload: PropTypes.shape(PropTypes.object.isRequired),
    getContent: PropTypes.func.isRequired,
    replies: PropTypes.arrayOf(PropTypes.object.isRequired),
    match: PropTypes.shape(PropTypes.object.isRequired),
    isAuth: PropTypes.bool.isRequired,
    groups: PropTypes.arrayOf(PropTypes.object.isRequired),
    modalOpenAddPost: PropTypes.bool.isRequired,
    postExists: PropTypes.bool.isRequired,
    addPostLoading: PropTypes.bool.isRequired,
    handleModalClickAddPost: PropTypes.func.isRequired,
    onModalCloseAddPost: PropTypes.func.isRequired,
    handleGroupSelect: PropTypes.func.isRequired,
    isFetchingDetails: PropTypes.bool.isRequired,
    isUpdating: PropTypes.bool,
    draft: PropTypes.shape(PropTypes.object.isRequired),
    isDeleting: PropTypes.bool,
    redirect: PropTypes.string,
    resteemedPayload: PropTypes.shape(PropTypes.object.isRequired),
    clearPostDetails: PropTypes.func,
    clearComments: PropTypes.func,
    clearNewComments: PropTypes.func,
    showEditPost: PropTypes.func,
    sendDeletePost: PropTypes.func,
    handleResteem: PropTypes.func,
    sendComment: PropTypes.func.isRequired,
    allFollowing: PropTypes.func,
    followingList: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    post: {},
    groups: [],
    upvotePayload: {},
    commentPayload: {},
    commentedId: 0,
    match: {},
    csrf: '',
    replies: [],
    isUpdating: false,
    draft: {},
    isDeleting: false,
    redirect: '',
    resteemedPayload: {},
    followingList: [],
    clearPostDetails: () => {},
    clearComments: () => {},
    clearNewComments: () => {},
    showEditPost: () => {},
    handleResteem: () => {},
    sendDeletePost: () => {},
    allFollowing: () => {},
  }

  constructor(props) {
    super(props);

    this.existPost = "Post already in group.";
    this.redirect = '';
  }

  /**
   *  Extract the author and permlink from the route address and call the
   *  redux function to get the content of the post.
   */
  componentDidMount() {
    const {
      getContent,
      allFollowing,
      match: {
        params: {
          author,
          permlink
        }
      }
    } = this.props;

    getContent(author, permlink);
    allFollowing();
  }

  /**
   *  This is needed to pull new data from a post after an update is done.
   *  Rather than simpy update the title, body and tags alone from the draft
   *  update, the time elapsed could contain new comments or upvotes that
   *  are usefult o see after an update, and one might expect to see.
   */
  componentDidUpdate(prevProps) {
    const {
      getContent,
      draft,
      redirect,
      clearPostDetails,
      match: {
        params: {
          author,
          permlink
        }
      }
    } = this.props;

    this.redirect = '';

    //if no draft present, get content data from Redux
    if (!hasLength(draft) && draft !== prevProps.draft) {
      getContent(author, permlink);
    }

    //if redirect requested, clear previous post data in Redux
    if (redirect && redirect !== prevProps.redirect) {
      this.redirect = redirect;
      clearPostDetails();
    }
  }

  componentWillUnmount() {
    const { clearPostDetails, clearComments, clearNewComments } = this.props;
    clearPostDetails();
    clearComments();
    clearNewComments();
  }

  render() {
    const {
      user,
      csrf,
      isAuth,
      match,
      groups,
      modalOpenAddPost,
      postExists,
      addPostLoading,
      showModal,
      handleModalClickAddPost,
      onModalCloseAddPost,
      handleGroupSelect,
      post,
      isFetchingDetails,
      getContent,
      handleUpvote,
      upvotePayload,
      replies,
      isCommenting,
      commentedId,
      commentPayload,
      isUpdating,
      isDeleting,
      resteemedPayload,
      showEditPost,
      sendDeletePost,
      handleResteem,
      sendComment,
      followingList,
    } = this.props;

    let addErrorPost = '';
    if (postExists) addErrorPost = <ErrorLabel position='left' text={this.existPost} />;

    return (
      this.redirect
      ? <Redirect to={this.redirect} />
      : (
        <ErrorBoundary>
          <React.Fragment>
            <ModalGroup
              modalOpen={modalOpenAddPost}
              onModalClose={onModalCloseAddPost}
              handleModalClick={handleModalClickAddPost}
              handleGroupSelect={handleGroupSelect}
              groups={groups}
              addErrorPost={addErrorPost}
              addPostLoading={addPostLoading}
            />
            {
              !isFetchingDetails && !hasLength(post)
              ? <div>That post does not exist.</div>
              : !isFetchingDetails && hasLength(post)
                ? (
                  <PostDetails
                    match={match}
                    showModal={showModal}
                    user={user}
                    csrf={csrf}
                    isAuth={isAuth}
                    getContent={getContent}
                    post={post}
                    handleUpvote={handleUpvote}
                    upvotePayload={upvotePayload}
                    replies={replies}
                    isCommenting={isCommenting}
                    commentedId={commentedId}
                    isFetching={isFetchingDetails}
                    commentPayload={commentPayload}
                    isUpdating={isUpdating}
                    isDeleting={isDeleting}
                    resteemedPayload={resteemedPayload}
                    showEditPost={showEditPost}
                    sendDeletePost={sendDeletePost}
                    handleResteem={handleResteem}
                    sendComment={sendComment}
                    followingList={followingList}
                  />
                )
                :  <Loading />
            }
          </React.Fragment>
        </ErrorBoundary>
      )
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
   const {
     auth: {
       user,
       csrf,
       isAuth,
     },
     detailsPost: {
       isFetchingDetails,
       post,
       isDeleting,
       redirect,
     },
     userGroups: {
       groups,
     },
     addPost: {
       postExists,
       addPostLoading,
       modalOpenAddPost,
       selectedGroup,
     },
     comments: {
       isFetchingComments,
       replies,
     },
     upvote: {
       upvotePayload,
     },
     sendComment: {
       isCommenting,
       commentedId,
       commentPayload,
       editingComment,
     },
     sendPost: {
       isUpdating,
       draft,
     },
     resteem: {
       resteemedPayload,
     },
     follow: {
       followingList,
     },
   } = state;

   return {
     user,
     csrf,
     isAuth,
     isFetchingDetails,
     groups,
     postExists,
     addPostLoading,
     modalOpenAddPost,
     selectedGroup,
     post,
     upvotePayload,
     isFetchingComments,
     replies,
     isCommenting,
     commentedId,
     commentPayload,
     editingComment,
     isUpdating,
     draft,
     isDeleting,
     redirect,
     resteemedPayload,
     followingList,
   }
 }

 /**
  *  Map redux dispatch functions to component props.
  *
  *  @param {object} dispatch - Redux dispatch
  *  @returns {object} - Object with recent activity data
  */
const mapDispatchToProps = dispatch => (
  {
    getContent: (author, permlink) => (
      dispatch(getDetailsContent(author, permlink))
    ),
    showModal: (event, type, data) => (
      dispatch(addPostActions.showModal(event, type, data))
    ),
    handleModalClickAddPost: event => (
      dispatch(addPostActions.handleModalClickAddPost(event))
    ),
    onModalCloseAddPost: () => (
      dispatch(addPostActions.onModalCloseAddPost())
    ),
    handleGroupSelect: (value) => (
      dispatch(addPostActions.handleGroupSelect(value))
    ),
    clearPostDetails: () => (
      dispatch(clearPost())
    ),
    clearComments: () => (
      dispatch(commentsClear())
    ),
    clearNewComments: () => (
      dispatch(sendCommentClear())
    ),
    showEditPost: (post) => (
      dispatch(editPost(post))
    ),
    sendDeletePost: (author, permlink) => (
      dispatch(deletePost(author, permlink))
    ),
    handleResteem: (pid, author, permlink) => (
      dispatch(resteem(pid, author, permlink))
    ),
    handleUpvote: (author, permlink, weight) => (
      dispatch(upvotePost(author, permlink, weight))
    ),
    sendComment: (body, parentPost) => (
      dispatch(sendComment(body, parentPost))
    ),
    allFollowing: () => (
      dispatch(getAllFollowing())
    )
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(Post);
