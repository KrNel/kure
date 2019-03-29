import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import PostDetails from './PostDetails';
import ErrorBoundary from '../../../ErrorBoundary/ErrorBoundary';
import ModalGroup from '../../../Modal/ModalGroup';
import ErrorLabel from '../../../ErrorLabel/ErrorLabel';
import * as contentActions from '../../../../actions/steemContentActions'
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
    getComments: PropTypes.func.isRequired,
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
      getComments,
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
            !isFetchingDetails && hasLength(post)
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
                getComments={getComments}
                sendComment={sendComment}
                isCommenting={isCommenting}
                commentedId={commentedId}
                isFetching={isFetchingDetails}
                commentPayload={commentPayload}
              />
            )
            : <Loading />
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
     steemContent: {
       isFetchingDetails,
       groups,
       postExists,
       addPostLoading,
       modalOpenAddPost,
       selectedGroup,
       post,
       upvotePayload,
       isCommenting,
       commentedId,
       commentPayload,
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
     isCommenting,
     commentedId,
     commentPayload,
   }
 }

const mapDispatchToProps = (dispatch) => (
  {
    getContent: (author, permlink) => (
      dispatch(contentActions.getDetailsContent(author, permlink))
    ),
    getComments: (author, permlink) => (
      dispatch(contentActions.getPostComments(author, permlink))
    ),
    showModal: (e, type, data) => (
      dispatch(contentActions.showModal(e, type, data))
    ),
    handleModalClickAddPost: (e) => (
      dispatch(contentActions.handleModalClickAddPost(e))
    ),
    onModalCloseAddPost: () => (
      dispatch(contentActions.onModalCloseAddPost())
    ),
    handleGroupSelect: (value) => (
      dispatch(contentActions.handleGroupSelect(value))
    ),
    handleUpvote: (voter, author, permlink, weight) => (
      dispatch(contentActions.upvotePost(voter, author, permlink, weight))
    ),
    sendComment: (parentPost, body) => (
      dispatch(contentActions.sendComment(parentPost, body))
    ),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(Post);
