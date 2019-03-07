import React from 'react';
import PropTypes from 'prop-types'
import { Table, Segment } from "semantic-ui-react";

import SteemConnect from '../../../utils/auth/scAPI';
import GroupLink from '../../common/GroupLink';
import TitleLink from '../../common/TitleLink';

/**
 *  Component to display the post data sent.
 *  If posts exist, display them. If not, display message.
 *
 *  @param {object} props Component props
 *  @param {object} props.post The post data to display
 *  @param {function} props.isAuth Determines if user is authenticated
 *  @returns {element} Displays the post, or message if no posts are in the app
 */
const RecentPosts = ({posts, isAuth}) => {
  const loginURL = SteemConnect.getLoginURL('/');
  if (posts.length) {
    return (
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Title</Table.HeaderCell>
            <Table.HeaderCell textAlign='center'>Group</Table.HeaderCell>
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
                  cutoff={67}
                />
              </Table.Cell>
              <Table.Cell collapsing textAlign='center'>
                <GroupLink display={p.display} name={p.group} />
              </Table.Cell>
            </Table.Row>
          ))
        }
        </Table.Body>
      </Table>
    )
  }else {
    if (isAuth)
      return (
        <Segment>
          <div className="recPost">
            {"There are no posts yet. Go to "}
            <a href="/manage">
              {"Manage"}
            </a>
            {" and create a community."}
          </div>
        </Segment>
      )
    else {
      return (
        <Segment>
          <div className="recPost">
            {"There are no posts yet. "}
            <a href={loginURL}>
              {"Login"}
            </a>
            {" to "}
            <a href="/manage">
              {"create"}
            </a>
            {" or join a community."}
          </div>
        </Segment>
      )
    }
  }
}

RecentPosts.propTypes = {
  post: PropTypes.shape(PropTypes.object),
  isAuth: PropTypes.bool.isRequired,
};

export default RecentPosts;
