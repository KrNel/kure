import React from 'react';
import { Grid, Header, Segment, Icon, Form } from "semantic-ui-react";

const GroupEdit = ({editGroup}) => {
  editGroup = editGroup[0];
  let display;
  const baseURL = "https://steemit.com/";

  if (!editGroup.posts.length) {
    display =
      <Segment>
        {"No posts in group "} {editGroup.group.display}
      </Segment>
  }else {
    display =
    <Segment>
      <table style={{width:"100%"}}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Likes</th>
            <th>Views</th>
            <th>Rating</th>
            <th>Submitter</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
        {
          editGroup.posts.map((p, i) => (
            <tr key={i}>
              <td><a href={baseURL+p.st_category+'/@/'+p.st_author+'/'+p.st_permlink}>{p.st_title}</a></td>
              <td>{p.likes}</td>
              <td>{p.views}</td>
              <td>{p.rating}</td>
              <td>{p.added_by}</td>
              <td><a href='/'><Icon name='minus circle' color='blue' /></a></td>
            </tr>
          ))
        }
        </tbody>
      </table>

    </Segment>
  }

  return (
    <Grid.Row>
      <Grid.Column>
        <Grid stackable className="editGroups">
          <Grid.Row>
            <Grid.Column>
              <Header as='h3'>Editing Group: {editGroup.group.display}</Header>
              {display}
              {/*<Segment>
                <div>
                  <p>Posts (Search) - (Add)</p>
                  <p>List ...stats... - (Delete)</p>
                </div>
              </Segment>
              <Segment>
                <div>
                  <p>Users (Search) - (Add)</p>
                  <p>List Cards ...stats...? - (Edit Role) - (Delete)</p>
                </div>
              </Segment>*/}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Grid.Column>
    </Grid.Row>
  )
}

export default GroupEdit;
