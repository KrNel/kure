import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import PostDetails from './PostDetails';
import ErrorBoundary from '../../../ErrorBoundary/ErrorBoundary';
import ModalGroup from '../../../Modal/ModalGroup';
import ErrorLabel from '../../../ErrorLabel/ErrorLabel';
import { getDetailsContent } from '../../../../actions/detailsPostActions';
import * as addPostActions from '../../../../actions/addPostActions';
import { upvotePost } from '../../../../actions/upvoteActions';
import { sendComment } from '../../../../actions/sendCommentActions';
import {hasLength} from '../../../../utils/helpers';
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
  }

  constructor(props) {
    super(props);

    this.existPost = "Post already in group.";
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
    } = this.props;

    let addErrorPost = '';
    if (postExists) addErrorPost = <ErrorLabel position='left' text={this.existPost} />;

    return (
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
                />
              )
              :  <Loading />

          }
        </React.Fragment>
      </ErrorBoundary>
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
    sendComment: (parentPost, body) => (
      dispatch(sendComment(parentPost, body))
    ),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(Post);
