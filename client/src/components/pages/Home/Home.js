import React, { Component } from 'react';
import { Loader, Grid, Header, Segment } from "semantic-ui-react";
import axios from 'axios';

import RecentlyAdded from './RecentlyAdded'
//import progress from '../../../utilities/axios-nprogress';
import './Home.css';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
        isLoading: true,
        recentlyAdded: []
    };

    this.signal = axios.CancelToken.source();

  }

  componentDidMount() {
    this.getRecentPosts();
  }

  componentWillUnmount() {
    this.signal.cancel('Api is being canceled');
  }

  getRecentPosts = async () => {
    axios.get('/api/recentposts', {
      cancelToken: this.signal.token,
    }).then((data) => {
      const posts = data.data.posts
      if (posts.length) {
        this.setState({
          isLoading: false,
          recentlyAdded: data.data.posts
        })
      }else {
        this.setState({
          isLoading: false,
          recentlyAdded: [{st_title: ''}]
        })
      }
    }).catch(err => {
      if (axios.isCancel(err)) {
        console.log('Error: ', err.message);
      } else {
        this.setState({ isLoading: false });
        console.error(err);
      }
    })
  }



  render() {
    let {recentlyAdded, isLoading} = this.state;

      if (isLoading) {
        recentlyAdded = <Loader active inline='centered' />
      }else {
        recentlyAdded = recentlyAdded.map((post, i) =>
          <RecentlyAdded key={i} post={post} isAuth={this.props.isAuth} />
        )
      }

    return (
      <div className="home">
        <Grid columns={1} stackable>
          <Grid.Column width={16} className="main">
            <Grid>
              <Grid.Row className="reducePad">
                <Grid.Column>
                  <Header as="h3">Recently Added</Header>
                </Grid.Column>
              </Grid.Row>

              <Grid.Row columns={1}>
                <Grid.Column>
                  <Segment className="nopad">
                    {recentlyAdded}
                  </Segment>
                </Grid.Column>
              </Grid.Row>

              {/*<Grid.Row className="reducePad">
                <Grid.Column>
                  <Header as="h3">Community Activity</Header>
                </Grid.Column>
              </Grid.Row>

                <Grid.Column width={8}>
                  <Segment>
                    <p>1</p>
                    <p>Sample test to test the limits of the word wrap in a paragraph box.</p>
                  </Segment>
                </Grid.Column>
                <Grid.Column width={8}>
                  <Segment>
                    <p>2</p>
                    <p>Sample test to test the limits of the word wrap in a paragraph box.</p>
                  </Segment>
                </Grid.Column>
                <Grid.Column width={8}>
                  <Segment>
                    <p>3</p>
                    <p>Sample test to test the limits of the word wrap in a paragraph box.</p>
                  </Segment>
                </Grid.Column>
                <Grid.Column width={8}>
                  <Segment>
                    <p>3</p>
                    <p>Sample test to test the limits of the word wrap in a paragraph box.</p>
                  </Segment>
                </Grid.Column>*/}

            </Grid>
          </Grid.Column>

          {/*<Grid.Row><Header as="h1">Popular Groups:</Header></Grid.Row>*/}
          {/*<Grid.Row><Header as="h1">New Groups:</Header></Grid.Row>*/}

          {/*<Grid.Column width={4} className="sidebar">
            <Card>
              <Card.Content>
                <Card.Header as="h3">My Groups</Card.Header>
              </Card.Content>
              <Card.Content>
                <Feed>
                  <Feed.Event>
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
          </Grid.Column>*/}

        </Grid>
      </div>
    )
  }
}

export default Home;
