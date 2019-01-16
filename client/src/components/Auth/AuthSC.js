import React, {Component} from 'react';
import { Loader } from "semantic-ui-react";
import {checkStatus, parseJson} from '../../utilities/helpers';
import { Redirect } from 'react-router-dom';

class AuthSC extends Component {
  constructor(props) {
    super(props);

    this.redirectURL = "";

    this.state = {
      redirect: false
    };
  }

  componentDidMount() {
    const url = new URLSearchParams(window.location.search);
    if (url.has('access_token')) {
      this.authTokenServer(url);
    }
  }

  authTokenServer = (url) => {
    let redirect = url.get('state')
    if (redirect === 'success' || redirect === 'login') redirect = '/';
    this.redirectURL = redirect;
    window.history.replaceState(null, null, window.location.pathname);
    const expiresAt = url.get('expires_in') * 1000 + new Date().getTime();
    const accessToken = url.get('access_token');
    const user = url.get('username');

    fetch('/auth/validate', {
      method: 'post',
      body: JSON.stringify({
        expiresAt: expiresAt,
        accessToken: accessToken,
        user: user
      }),
      headers: {
        "Content-Type": "application/json",
      }
    }).then(checkStatus)
      .then(parseJson)
      .then((res) => {
        if (res.isAuth) {
          this.props.setUserData({name: user});
          this.props.handleIsAuth(true);
          this.props.handleIsAuthorizing(false);
          this.setState({ redirect: true });
        }
      });
  }

  render() {
    return (
      <div>
        {
          (this.state.redirect) ? (
            <Redirect to={this.redirectURL} />
          ) : <Loader active inline='centered' size='huge'>Logging in...</Loader>
        }
      </div>
    )
  }
}

export default AuthSC;
