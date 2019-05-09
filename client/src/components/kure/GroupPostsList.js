import React from 'react';
import { Icon, Table, Dimmer, Loader } from "semantic-ui-react";
import PropTypes from 'prop-types';
import moment from 'moment';

import {roles} from '../../settings';
import TitleLink from '../pages/Steem/TitleLink';
import UserLink from '../pages/Steem/UserLink';

/**
 *  Displays the post data that belong to a commmunity groupost. Access rank/role
 *  is also displayed as a string based on the access number. The access
 *  determines if the Delete option appears to allow deleting a post.
 */
const GroupPostsList = (props) => {
  const {
    posts,
    showModal,
    deletingPost,
    access
  } = props;

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Title</Table.HeaderCell>
          <Table.HeaderCell textAlign='center'>Likes</Table.HeaderCell>
          <Table.HeaderCell textAlign='center'>Views</Table.HeaderCell>
          <Table.HeaderCell textAlign='center'>Rating</Table.HeaderCell>
          <Table.HeaderCell textAlign='center'>Submitter</Table.HeaderCell>
          <Table.HeaderCell textAlign='center'>Date</Table.HeaderCell>
          {
            access < roles.kGroupsRolesRev['Member']
            && (<Table.HeaderCell textAlign='center'>Remove</Table.HeaderCell>)
          }
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {
        posts.map((post, i) => (
          <Table.Row key={post._id}>
            <Table.Cell>
              <TitleLink
                title={post.st_title}
                category={post.st_category}
                author={post.st_author}
                permlink={post.st_permlink}
              />
            </Table.Cell>
            <Table.Cell collapsing textAlign='center'>{post.likes}</Table.Cell>
            <Table.Cell collapsing textAlign='center'>{post.views}</Table.Cell>
            <Table.Cell collapsing textAlign='center'>{post.rating}</Table.Cell>
            <Table.Cell collapsing textAlign='center'><UserLink user={post.added_by} /></Table.Cell>
            <Table.Cell collapsing textAlign='center'>{moment.utc(post.created).fromNow()}</Table.Cell>
            {
              (access <= 0)
              && (
                <Table.Cell collapsing textAlign='center'>
                  {
                    (deletingPost === post.st_permlink)
                      ? <Dimmer inverted active><Loader /></Dimmer>
                      : ''
                  }
                  {
                    //if logged in user added post, or is mod or above
                    //can delete the post
                    //(user === post.added_by)
                    //?
                    access < roles.kGroupsRolesRev['Member']
                    && (
                      <a href={'/post/delete/'+post.st_author+'/'+post.st_permlink} onClick={event => showModal(event, {author: post.st_author, post: post.st_permlink})}>
                        <Icon name='delete' color='red' />
                      </a>
                    )
                  }
                </Table.Cell>
              )
            }
          </Table.Row>
        ))
      }
      </Table.Body>
    </Table>
  )
}

GroupPostsList.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object),
  showModal: PropTypes.func,
  deletingPost: PropTypes.string,
  access: PropTypes.number,
};

GroupPostsList.defaultProps = {
  posts: [],
  deletingPost: '',
  showModal: () => {},
  access: 99,
};

export default GroupPostsList;
