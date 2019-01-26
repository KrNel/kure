import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Grid, Segment, Header } from "semantic-ui-react";
import axios from 'axios';

class Logout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: false
    };

    this.removeToken(this.props.user);
  }

  removeToken = (user) => {
      axios.post('/auth/logout', {
        user: user
      })
      .then((res) => {
        this.props.onLogout();
      })
      .catch((err) => {
        console.error('error on axios logout: ', err);
      });
  }

  componentDidMount() {
    this.interval = setTimeout(() => this.setState({ redirect: true }), 2000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render () {
    return (
      <div>
      {
        (this.state.redirect)
          ? <Redirect to='/' />
          :
            <Grid verticalAlign='middle' columns={5} centered style={{height: "80vh"}}>
              <Grid.Row>
                <Grid.Column>
                  <Segment textAlign='center'>
                    <Header as='h2'>Logged out.</Header>
                    <Header as='h4'>Redirecting...</Header>
                  </Segment>
                </Grid.Column>
              </Grid.Row>
            </Grid>
      }
      </div>
    )
  }
}

export default Logout;
