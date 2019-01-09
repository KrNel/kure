import React, { Component } from 'react';
import { Grid, Header, Segment, Card, Feed } from "semantic-ui-react";
import fetch from 'isomorphic-fetch';
import {checkStatus, parseJson} from '../../../utilities/helpers';

import './Home.css';

const RecentPosts = (props) => {
    return (
      <div>
        <div>
          {props.post.list}
        </div>
        <hr />
      </div>
    )
}

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
        fetched: false,
        recentposts: []
    };
  }

  componentDidMount() {
    this.getRecentPosts();
  }

  /*
  find better way to handle response errors?

  .then(res => {
    if (res.status === 200) {
      this.props.history.push('/');
    } else {
      const error = new Error(res.error);
      throw error;
    }
  })
  .catch(err => {
    console.error(err);
    alert('Error logging in please try again');
  });
  */

  getRecentPosts = () => {
    setTimeout(() => fetch('/api/recentposts', {
      method: 'get',
      headers: {
        accept: 'application/json',
      }
    }).then(checkStatus)
      .then(parseJson)
      .then((data) => {
        this.setState({
          fetched: true,
          recentposts: data.posts
        })
    }), 1000);
  }

  render() {

    let {recentposts, fetched} = this.state;

    if (!fetched) {
      recentposts = <div className='ui active centered inline loader' />
    }else {
      recentposts = recentposts.map(post =>
        <RecentPosts key={post._id} post={post} />
      )
    }

    //const recentposts = data;


    return (
      <div className="home">
        <Grid columns={2} stackable>
          <Grid.Column width={12} className="main">
            <Grid>
              <Grid.Row className="reducePad">
                <Grid.Column>
                  <Header as="h3">Post Activity:</Header>
                </Grid.Column>
              </Grid.Row>

              <Grid.Row columns={1}>
                <Grid.Column>
                  <Segment>
                    {recentposts}
                  </Segment>
                </Grid.Column>
              </Grid.Row>

              <Grid.Row className="reducePad">
                <Grid.Column>
                  <Header as="h3">Group Activity:</Header>
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column>
                  <Grid stackable className="recActivity">
                    <Grid.Row columns="3">
                      <Grid.Column>
                        <Segment>
                          <p>1</p>
                          <p>Sample test to test the limits of the word wrap in a paragraph box.</p>
                        </Segment>
                      </Grid.Column>
                      <Grid.Column>
                        <Segment>
                          <p>2</p>
                          <p>Sample test to test the limits of the word wrap in a paragraph box.</p>
                        </Segment>
                      </Grid.Column>
                      <Grid.Column>
                        <Segment>
                          <p>3</p>
                          <p>Sample test to test the limits of the word wrap in a paragraph box.</p>
                        </Segment>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Grid.Column>

              {/*<Grid.Row><Header as="h1">Popular Groups:</Header></Grid.Row>*/}
              {/*<Grid.Row><Header as="h1">New Groups:</Header></Grid.Row>*/}

              </Grid.Row>
            </Grid>
          </Grid.Column>

          <Grid.Column width={4} className="sidebar">
              <Card>
                <Card.Content>
                  <Card.Header>My Groups</Card.Header>
                </Card.Content>
                <Card.Content>
                  <Feed>
                    <Feed.Event>
                      {/*<Feed.Label image='/images/avatar/small/jenny.jpg' />*/}
                      <Feed.Content>
                        <Feed.Date content='1 day ago' />
                        <Feed.Summary>
                          Thumb - Post Title - Likes?
                        </Feed.Summary>
                      </Feed.Content>
                    </Feed.Event>
                  </Feed>
                </Card.Content>
              </Card>
              {/*<Segment>My Groups</Segment>
              <Segment>My Posts</Segment>
              <Segment>My Hits</Segment>*/}
          </Grid.Column>

        </Grid>
      </div>
    )
  }
}

/*<Grid celled padded style={{height: '100vh'}}>
  <Grid.Row style={{height: '70%'}}>
    <Grid.Column width={10}>
      <p>One</p>
    </Grid.Column>
    <Grid.Column width={6}>
      <p>Two</p>
    </Grid.Column>
  </Grid.Row>

  <Grid.Row style={{height: '30%'}}>
    <Grid.Column width={10}>
      <p>Three</p>
    </Grid.Column>
    <Grid.Column width={3}>
      <p>Four</p>
    </Grid.Column>
    <Grid.Column width={3}>
      <p>Five</p>
    </Grid.Column>
  </Grid.Row>
</Grid>*/

export default Home;
