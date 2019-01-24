import React from 'react';
import { Grid, Segment, Icon, Table } from "semantic-ui-react";

import Settings from '../../../settings';

const GroupManagePosts = ({noPosts, posts}) => {

  if (noPosts || !posts.length) {
    return (
      <Grid.Column width={8}>
        <Segment>
          {"No posts in this group yet."}
        </Segment>
      </Grid.Column>
    )
  }else {
    return (
      <Grid.Column>
        <Segment>
          <Table striped>
            <Table.Header>
                    <Table.Row>
                <Table.HeaderCell>Title</Table.HeaderCell>
                <Table.HeaderCell>Likes</Table.HeaderCell>
                <Table.HeaderCell>Views</Table.HeaderCell>
                <Table.HeaderCell>Rating</Table.HeaderCell>
                <Table.HeaderCell>Submitter</Table.HeaderCell>
                <Table.HeaderCell>Remove</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
            {
              posts.map((p, i) => (
                <Table.Row key={i}>
                  <Table.Cell>
                    <a
                      href={Settings.baseSteemURL+p.st_category+'/@/'+p.st_author+'/'+p.st_permlink}>{p.st_title}
                    </a>
                  </Table.Cell>
                  <Table.Cell>{p.likes}</Table.Cell>
                  <Table.Cell>{p.views}</Table.Cell>
                  <Table.Cell>{p.rating}</Table.Cell>
                  <Table.Cell>{p.added_by}</Table.Cell>
                  <Table.Cell><a href='/'><Icon name='minus circle' color='blue' /></a></Table.Cell>
                </Table.Row>
              ))
            }
            </Table.Body>
          </Table>

        </Segment>
      </Grid.Column>
    )
  }
}

export default GroupManagePosts;
