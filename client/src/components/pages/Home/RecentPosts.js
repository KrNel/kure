import React from 'react';
import PropTypes from 'prop-types'
import { Table, Segment } from "semantic-ui-react";
import { Link } from 'react-router-dom';

import SteemConnect from '../../../utils/auth/scAPI';

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
      <Table striped>
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
              <Link
                to={p.st_category+'/@'+p.st_author+'/'+p.st_permlink}
              >
                {(p.st_title.length > 70)
                  ? p.st_title.substr(0,70) + " ..."
                  : p.st_title}
              </Link>
              </Table.Cell>
              <Table.Cell collapsing textAlign='center'>{p.display}</Table.Cell>
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
