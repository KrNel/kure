import React, {Component} from 'react';
//import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import PostDetails from './PostDetails';
import ErrorBoundary from '../../../ErrorBoundary/ErrorBoundary';
import ModalGroup from '../../../Modal/ModalGroup';
import ErrorLabel from '../../../ErrorLabel/ErrorLabel';
import * as contentActions from '../../../../actions/steemContentActions'

/**

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
            post && (
              <PostDetails
                match={match}
                showModal={showModal}
                user={user}
                csrf={csrf}
                getContent={getContent}
                post={post}

              />
            )
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
       csrf
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
     }
   } = state;

   return {
     user,
     csrf,
     isFetching,
     groups,
     postExists,
     addPostLoading,
     modalOpenAddPost,
     selectedGroup,
     addPostData,
     post,
   }
 }

const mapDispatchToProps = (dispatch) => (
  {
    getContent: (author, permlink) => (
      dispatch(contentActions.getDetailsContent(author, permlink))
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
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(Post);
