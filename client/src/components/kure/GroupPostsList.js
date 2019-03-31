import React from 'react';
import { Icon, Table, Dimmer, Loader } from "semantic-ui-react";
import PropTypes from 'prop-types';
import moment from 'moment';

import {roles} from '../../settings';
import TitleLink from '../pages/Steem/TitleLink';
import UserLink from '../pages/Steem/UserLink';

/**
 *  Displays the post data that belong to a commmunity group. Access rank/role
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
        posts.map((p, i) => (
          <Table.Row key={p._id}>
            <Table.Cell>
              <TitleLink
                title={p.st_title}
                category={p.st_category}
                author={p.st_author}
                permlink={p.st_permlink}
              />
            </Table.Cell>
            <Table.Cell collapsing textAlign='center'>{p.likes}</Table.Cell>
            <Table.Cell collapsing textAlign='center'>{p.views}</Table.Cell>
            <Table.Cell collapsing textAlign='center'>{p.rating}</Table.Cell>
            <Table.Cell collapsing textAlign='center'><UserLink user={p.added_by} /></Table.Cell>
            <Table.Cell collapsing textAlign='center'>{moment.utc(p.created).fromNow()}</Table.Cell>
            {
              (access <= 0)
              && (
                <Table.Cell collapsing textAlign='center'>
                  {
                    (deletingPost === p.st_permlink)
                      ? <Dimmer inverted active><Loader /></Dimmer>
                      : ''
                  }
                  {
                    //if logged in user added post, or is mod or above
                    //can delete the post
                    //(user === p.added_by)
                    //?
                    access < roles.kGroupsRolesRev['Member']
                    && (
                      <a href={'/post/delete/'+p.st_author+'/'+p.st_permlink} onClick={e => showModal(e, {author: p.st_author, post: p.st_permlink})}>
                        <Icon name='delete' color='blue' />
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
  user: PropTypes.string,
  access: PropTypes.number,
};

GroupPostsList.defaultProps = {
  posts: [],
  deletingPost: '',
  user: '',
  showModal: () => {},
  access: 99,
};

export default GroupPostsList;
