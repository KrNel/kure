import React, {Component} from 'react';
//import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import PostDetails from './PostDetails';
import ErrorBoundary from '../../../ErrorBoundary/ErrorBoundary';
import ModalGroup from '../../../Modal/ModalGroup';
import ErrorLabel from '../../../ErrorLabel/ErrorLabel';
import * as contentActions from '../../../../actions/steemContentActions'
import hasLength from '../../helpers/helpers';
import Loading from '../../../Loading/Loading';

/**
 *  Container to render post details from Steem.
 */
class Post extends Component {

  constructor(props) {
    super(props);

    this.existPost = "Post already in group.";
  }



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
      isFetching,
      getContent,
      handleUpvote,
      upvotePayload,
      getComments,
      sendComment,
      isCommenting,
      commentedId,
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
            (hasLength(post))
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
       isFetching,
       groups,
       postExists,
       addPostLoading,
       modalOpenAddPost,
       selectedGroup,
       addPostData,
       post,
       upvotePayload,
       isCommenting,
       commentedId,
     }
   } = state;

   return {
     user,
     csrf,
     isAuth,
     isFetching,
     groups,
     postExists,
     addPostLoading,
     modalOpenAddPost,
     selectedGroup,
     addPostData,
     post,
     upvotePayload,
     isCommenting,
     commentedId,
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
