import React from 'react';
import { Grid, Segment } from "semantic-ui-react";
import PropTypes from 'prop-types';

import GroupPosts from '../../common/GroupPosts'

/**
 *  Table of posts for the selected group.
 *
 *  Shows the title, likes, views, rating, submitter and remove button icon
 *  for deleting a post.
 *
 *  @param {object} props Component props
 *  @param {array} props.posts Posts data to be mapped and displayed
 *  @param {function} props.showModal Sets the modal to be shown or hidden
 *  @param {string} props.deletingPost The post to be deleted
 *  @returns {Component} Table of post data
 */
const GroupManagePosts = ({posts, showModal, deletingPost, user, access}) => {

  if (!posts.length) {
    return (
      <Grid.Column width={8}>
        <Segment>
          {"No posts in this group."}
        </Segment>
      </Grid.Column>
    )
  }else {
    return (
      <Grid.Column>
        <GroupPosts
          posts={posts}
          showModal={showModal}
          deletingPost={deletingPost}
          user={user}
          access={access}
        />
      </Grid.Column>
    )
  }
}

GroupManagePosts.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
  showModal: PropTypes.func.isRequired,
  deletingPost: PropTypes.string.isRequired,
};

export default GroupManagePosts;
