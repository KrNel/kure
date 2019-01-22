import React, { Component } from 'react';
import { Loader, Grid, Header, Segment, Card, Feed } from "semantic-ui-react";
//import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';
import axios from 'axios';
//import progress from '../../../utilities/axios-nprogress';

import './Home.css';

const RecentPosts = (props) => {
    return (
      <React.Fragment>
        <div className="recPost">{props.post.st_title}</div>
      </React.Fragment>
    )
}

class Home extends Component {
  //_isMounted = false;


  constructor(props) {
    super(props);
    this.state = {
        isLoading: true,
        recentposts: []
    };

    this.signal = axios.CancelToken.source();

  }

  //controller = new AbortController();
  //signal = this.controller.signal;


  getRecentPosts = () => {
    /*setTimeout(() => fetch('/api/recentposts', {
      signal: this.signal,
      method: 'get',
      headers: {
        accept: 'application/json',
      }
    }).then(checkStatus)
      .then(parseJson)
      .then((data) => {
        this.setState({
          isLoading: false,
          recentposts: data.posts
        })
      }).catch(err => {
        if (err.name === 'AbortError') {
          console.log('Fetch aborted');
        } else {
          console.error('Uh oh, an error!', err);
        }
      })
      , 1000);*/

    setTimeout(() => axios.get('/api/recentposts', {
      cancelToken: this.signal.token,
    }).then((data) => {
      this.setState({
        isLoading: false,
        recentposts: data.data.posts
      })
    }).catch(err => {
      if (axios.isCancel(err)) {
        console.log('Error: ', err.message); // => prints: Api is being canceled
      } else {
        this.setState({ isLoading: false });
      }
    })
    , 1000);
  }

  componentDidMount() {
    //this._isMounted = true;
    this.getRecentPosts();
  }

  componentWillUnmount() {
    //this._isMounted = false;
    //this.controller.abort();
    this.signal.cancel('Api is being canceled');
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





  render() {

    let {recentposts, isLoading} = this.state;

    if (isLoading) {
      recentposts = <Loader active inline='centered' />
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
                  <Header as="h3">Recently Added</Header>
                </Grid.Column>
              </Grid.Row>

              <Grid.Row columns={1}>
                <Grid.Column>
                  <Segment className="nopad">
                    {recentposts}
                  </Segment>
                </Grid.Column>
              </Grid.Row>

              <Grid.Row className="reducePad">
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
                      </Grid.Column>

            </Grid>
          </Grid.Column>

          {/*<Grid.Row><Header as="h1">Popular Groups:</Header></Grid.Row>*/}
          {/*<Grid.Row><Header as="h1">New Groups:</Header></Grid.Row>*/}

          <Grid.Column width={4} className="sidebar">
              <Card>
                <Card.Content>
                  <Card.Header as="h3">My Groups</Card.Header>
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
