import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {checkStatus, parseJson} from '../../utilities/helpers';
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

    fetch('/auth/logout', {
      method: 'post',
      body: JSON.stringify({
        user: user
      }),
      headers: {
        "Content-Type": "application/json",
      }
    }).then(checkStatus)
      .then(parseJson)
      .then((res) => {
        this.props.onLogout();
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
        (this.state.redirect) ? (
          <Redirect to='/' />
        ) : <h2>Logged out. Redirecting in 2 seconds...</h2>
      }
      </div>
    )
  }
}

export default Logout;
