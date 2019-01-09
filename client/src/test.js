import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Grid, Segment, Card, Feed, Header } from "semantic-ui-react";
import { BrowserRouter as Router } from "react-router-dom";

import NavMenu from './components/nav/NavMenu';

import "semantic-ui-css/semantic.css";
import './styles/App.css';
import './styles/Home.css';

class App extends Component {
  render () {
    return (
      <div>
        <Grid>
          <Grid.Column>
            <NavMenu />
          </Grid.Column>
        </Grid>
        <Grid container className="wrapper">
          <Grid.Column width={16}>
            <div className="home">
              <Grid>
                <Grid.Row columns={3}>
                  <Grid.Column width={12} className="main">
                    <Grid>
                      <Grid.Row><Header as="h3">Recent Post Activity:</Header></Grid.Row>
                      <Grid.Row stackable columns={1}>
                        <Grid.Column>
                          <Segment>
                            1
                          </Segment>
                        </Grid.Column>
                      </Grid.Row>

                      <Grid.Row><Header as="h3">Recent Group Activity:</Header></Grid.Row>
                      <Grid.Row columns={3}>
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

                  <Grid.Column width={4} className="sidebar">
                    <Grid.Column>
                      <Card>
                        <Card.Content>
                          <Card.Header>My Groups</Card.Header>
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
                    </Grid.Column>
                  </Grid.Column>

                </Grid.Row>
              </Grid>
            </div>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
);
