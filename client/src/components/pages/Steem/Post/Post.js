import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import PostDetails from './PostDetails';
import ErrorBoundary from '../../../ErrorBoundary/ErrorBoundary';
import ModalGroup from '../../../Modal/ModalGroup';
import ErrorLabel from '../../../ErrorLabel/ErrorLabel';
import { getDetailsContent, clearPost } from '../../../../actions/detailsPostActions';
import * as addPostActions from '../../../../actions/addPostActions';
import { upvotePost } from '../../../../actions/upvoteActions';
import { sendComment } from '../../../../actions/sendCommentActions';
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
    sendComment: PropTypes.func.isRequired,
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
    clearPostData: PropTypes.func,
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
    clearPostData: () => {},
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
      match: {
        params: {
          author,
          permlink
        }
      }
    } = this.props;

    getContent(author, permlink);
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
      clearPostData,
      match: {
        params: {
          author,
          permlink
        }
      }
    } = this.props;

    this.redirect = '';

    if (!hasLength(draft) && draft !== prevProps.draft) {
      getContent(author, permlink);
    }

    if (redirect && redirect !== prevProps.redirect) {
      this.redirect = redirect;
      clearPostData();
    }
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
      sendComment,
      isCommenting,
      commentedId,
      commentPayload,
      isUpdating,
      isDeleting,
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
                    sendComment={sendComment}
                    isCommenting={isCommenting}
                    commentedId={commentedId}
                    isFetching={isFetchingDetails}
                    commentPayload={commentPayload}
                    isUpdating={isUpdating}
                    isDeleting={isDeleting}
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
     }
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
    showModal: (e, type, data) => (
      dispatch(addPostActions.showModal(e, type, data))
    ),
    handleModalClickAddPost: (e) => (
      dispatch(addPostActions.handleModalClickAddPost(e))
    ),
    onModalCloseAddPost: () => (
      dispatch(addPostActions.onModalCloseAddPost())
    ),
    handleGroupSelect: (value) => (
      dispatch(addPostActions.handleGroupSelect(value))
    ),
    handleUpvote: (voter, author, permlink, weight) => (
      dispatch(upvotePost(voter, author, permlink, weight))
    ),
    sendComment: (body, parentPost) => (
      dispatch(sendComment(body, parentPost))
    ),
    clearPostData: () => (
      dispatch(clearPost())
    ),clearPost
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(Post);
