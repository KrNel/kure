import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Grid } from "semantic-ui-react";
import axios from 'axios';


//import SteemConnect from '../../auth';
//import { removeToken } from '../../auth';

//const Logout = () =>
class Logout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: false
    };

    this.removeToken(this.props.user);
  }

  removeToken = (user) => {

    /*fetch('/auth/logout', {
      method: 'post',
      body: JSON.stringify({
        user: user
      }),
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": this.props.csrfToken
      }
    }).then(checkStatus)
      .then(parseJson)
      .then((res) => {
        this.props.onLogout();
      })
      .catch(err => { console.error('error on fetch logout: ', err); });*/
      axios.post('/auth/logout', {
        user: user
      }, {
        /*headers: {
          "x-csrf-token": this.props.csrfToken
        }*/
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
            <Grid verticalAlign='middle' columns={3} centered style={{height: "80vh"}}>
              <Grid.Row>
                <Grid.Column>
                  <h2>Logged out. Redirecting in 2 seconds...</h2>
                </Grid.Column>
              </Grid.Row>
            </Grid>
      }
      </div>
    )
  }
}

export default Logout;
