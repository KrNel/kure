import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
//import SteemConnect from '../../auth';
//import { removeToken } from '../../auth';

//const Logout = () =>
class Logout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: false
    };

    this.removeToken();
  }

  removeToken = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('username');
    //???
    //SteemConnect.revokeToken();

    this.props.onLogout();
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
        ) : "Logged out. Redirecting in 2 seconds..."
      }
      </div>
    )
  }
}

export default Logout;
